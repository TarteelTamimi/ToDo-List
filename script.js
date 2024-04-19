const form = document.querySelector("#new-task");
const input = document.querySelector("#new-task-input");
const list_el = document.querySelector("#tasks");
const count_el = document.querySelector("#count");
const add_button = document.querySelector("#new-task-submit");

if (!localStorage.getItem('functionCalled')) {
    loadFetchedTasks();
    localStorage.setItem('functionCalled', 'true');
}

async function fetchTasks() {
    const response = await fetch('https://dummyjson.com/todos');
    const tasks = await response.json();
    return tasks;
}

async function loadFetchedTasks() {
    const fetchedTaskObj = await fetchTasks();
    const fetchedTask_comp = [];
    const fetchedTask_notComp = [];

    for (let i = 0; i < fetchedTaskObj.todos.length; i++) {
        if (fetchedTaskObj.todos[i].completed) {
            fetchedTask_comp.push(fetchedTaskObj.todos[i].todo);
        } else {
            fetchedTask_notComp.push(fetchedTaskObj.todos[i].todo);
        }
    }

    for (let i = 0; i < fetchedTask_notComp.length; i++) {
        const task_el = createTaskElement(fetchedTask_notComp[i]);
        list_el.appendChild(task_el);
    }
    console.log(fetchedTask_comp)
    console.log(fetchedTask_notComp)

    for (let i = 0; i < fetchedTask_comp.length; i++) {
        const task_el = createTaskElement(fetchedTask_comp[i], true);
        list_el.appendChild(task_el);
    }

    saveTasks();
}

function createTaskElement(taskText, isComplete = false) {
    const task_el = document.createElement("div");
    task_el.classList.add("task");

    const task_content_el = document.createElement("div");
    task_content_el.classList.add("content");

    const task_input_el = document.createElement("input");
    task_input_el.classList.add("text");
    task_input_el.type = "text";
    task_input_el.value = taskText;
    task_input_el.setAttribute("readonly", "readonly");

    task_content_el.appendChild(task_input_el);

    const task_actions_el = document.createElement("div");
    task_actions_el.classList.add("actions");

    const task_edit_el = document.createElement("button");
    task_edit_el.classList.add("edit");
    task_edit_el.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";

    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.innerHTML = "<i class='fa-solid fa-trash'></i>";

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);
    task_el.appendChild(task_content_el);
    task_el.appendChild(task_actions_el);

    task_edit_el.addEventListener('click', () => {
        toggleTaskEditMode(task_input_el, task_edit_el);
        if (task_input_el.value == "") {
            list_el.removeChild(task_el);
        }
        saveTasks();
    });

    task_delete_el.addEventListener('click', () => {
        const isConfirmed = confirm("Are you sure you want to delete this task?");
        if (isConfirmed) {
            list_el.removeChild(task_el);
            saveTasks();
        }
    });

    // TODO : Add to local storage
    task_content_el.addEventListener('click', () => {
        task_input_el.classList.toggle('done');
    });

    if (isComplete) {
        task_input_el.classList.toggle('done');
    }

    return task_el;
}

function toggleTaskEditMode(inputElement, editButton) {
    if (inputElement.getAttribute("readonly") === "readonly") {
        inputElement.removeAttribute("readonly");
        inputElement.focus();
        editButton.innerHTML = "<i class='fa-solid fa-check'></i>";
    } else {
        inputElement.setAttribute("readonly", "readonly");
        editButton.innerHTML = "<i class='fa-solid fa-pen-to-square'></i>";
    }
}

function saveTasks() {
    const tasks = Array.from(list_el.querySelectorAll(".task")).map(task_el => {
        return task_el.querySelector(".text").value;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    count_el.innerHTML = `Total tasks: ${tasks.length}`
}

window.addEventListener('load', () => {
    loadTasks();
    add_button.disabled = true;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        const task_el = createTaskElement(task);

        list_el.appendChild(task_el);

        input.value = "";
        add_button.disabled = true;
        saveTasks();
    })

    input.addEventListener('input', () => {
        if (input.value.trim() !== "") {
            add_button.disabled = false;
        }
    });

    async function loadTasks() {
        const generatedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        for (let i = 0; i < generatedTasks.length; i++) {
            const task_el = createTaskElement(generatedTasks[i]);
            list_el.appendChild(task_el);
        }

        saveTasks();

        count_el.innerHTML = `Total tasks: ${generatedTasks.length}`
    }
})

