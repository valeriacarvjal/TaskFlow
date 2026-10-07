const input = document.querySelector(".task-input input");
const button = document.querySelector(".task-input button");
const tasksContainer = document.querySelector(".tasks");
const taskCount = document.querySelector(".task-count");
const emptyState = document.querySelector(".empty-state");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Convertir tareas antiguas al nuevo formato
tasks = tasks.map(function(task) {
    if (typeof task === "string") {
        return {
            text: task,
            completed: false
        };
    }

    return task;
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    taskCount.textContent = `${remainingTasks} ${remainingTasks === 1 ? "task" : "tasks"} left`;
}
function updateEmptyState() {
    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

function showTask(taskData) {
    const task = document.createElement("div");
    task.classList.add("task");

    if (taskData.completed) {
        task.classList.add("completed");
    }

    const check = document.createElement("span");
    check.classList.add("task-check");
    check.textContent = taskData.completed ? "✓" : "○";

    const text = document.createElement("span");
    text.classList.add("task-text");
    text.textContent = taskData.text;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "×";

    task.appendChild(check);
    task.appendChild(text);
    task.appendChild(deleteButton);

    tasksContainer.appendChild(task);

    check.addEventListener("click", function() {
        taskData.completed = !taskData.completed;

        task.classList.toggle("completed");
        check.textContent = taskData.completed ? "✓" : "○";

        saveTasks();
        updateTaskCount();
    });

    deleteButton.addEventListener("click", function() {
        task.remove();

        tasks = tasks.filter(function(item) {
            return item !== taskData;
        });

        saveTasks();
        updateTaskCount();
    });
}

tasks.forEach(function(task) {
    showTask(task);
});

updateTaskCount();
updateEmptyState();

button.addEventListener("click", function() {
    const taskText = input.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = {
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    updateTaskCount();
    updateEmptyState();

    showTask(newTask);
    updateTaskCount();
    updateEmptyState();

    input.value = "";
});

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        button.click();
    }
});