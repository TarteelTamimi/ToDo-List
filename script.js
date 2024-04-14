window.addEventListener('load', () => {
    const form = document.querySelector("#new-task");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    const count_el = document.querySelector("#count");

    loadTasks();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;

        if (!task) {
            alert("Please add a task");
            return;
        }

        const task_el = createTaskElement(task);

        list_el.appendChild(task_el);
        
        input.value = "";
        saveTasks();
    })

    function createTaskElement(taskText) {
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
            list_el.removeChild(task_el);
            saveTasks();
        });

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
        const tasks = Array.from(list_el.querySelectorAll(".task")).map(taskEl => {
            return taskEl.querySelector(".text").value;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        count_el.innerHTML = `Total tasks: ${tasks.length}`
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(taskText => {
            const task_el = createTaskElement(taskText);
            list_el.appendChild(task_el);
        });

        count_el.innerHTML = `Total tasks: ${tasks.length}`
    }
})

