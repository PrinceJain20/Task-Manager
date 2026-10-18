// Get the page elements
const TASKS_KEY = "daymark.tasks.v1";
const THEME_KEY = "daymark.theme.v1";
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskCategory = document.getElementById("task-category");
const taskList = document.getElementById("task-list");
const formMessage = document.getElementById("form-message");
const themeButton = document.getElementById("theme-button");

// Load saved tasks from this browser
let tasks = [];

try {
  const savedTasks = localStorage.getItem(TASKS_KEY);
  if (savedTasks) {
    const oldTasks = JSON.parse(savedTasks);

    if (Array.isArray(oldTasks)) {
      tasks = oldTasks
        .filter(function (task) {
          return task && typeof task.title === "string";
        })
        .map(function (task) {
          return {
            id: task.id || Date.now(),
            title: task.title,
            category: task.category || "Personal",
            completed: task.completed === true || task.status === "completed"
          };
        });
    }
  }
} catch {
  tasks = [];
}

// Save the tasks in this browser
function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Create one task on the page
function createTask(task) {
  const listItem = document.createElement("li");
  listItem.className = "task-item";

  if (task.completed) {
    listItem.classList.add("completed");
  }

  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";

  const name = document.createElement("span");
  name.className = "task-name";
  name.textContent = task.title;

  const category = document.createElement("span");
  category.className = "task-category";
  category.textContent = task.category;

  taskInfo.appendChild(name);
  taskInfo.appendChild(category);

  const buttons = document.createElement("div");
  buttons.className = "task-actions";

  const completeButton = document.createElement("button");
  completeButton.className = "complete-button";
  completeButton.textContent = task.completed ? "Undo" : "Complete";
  completeButton.addEventListener("click", function () {
    task.completed = !task.completed;
    saveTasks();
    showTasks();
  });

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", function () {
    const newTitle = prompt("Edit the task name:", task.title);

    if (newTitle && newTitle.trim()) {
      task.title = newTitle.trim();
      saveTasks();
      showTasks();
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    tasks = tasks.filter(function (savedTask) {
      return savedTask.id !== task.id;
    });

    saveTasks();
    showTasks();
  });

  buttons.appendChild(completeButton);
  buttons.appendChild(editButton);
  buttons.appendChild(deleteButton);

  listItem.appendChild(taskInfo);
  listItem.appendChild(buttons);

  return listItem;
}

// Show all tasks and update the counts
function showTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "You have no tasks yet. Add one above to get started.";
    taskList.appendChild(emptyMessage);
  }

  tasks.forEach(function (task) {
    taskList.appendChild(createTask(task));
  });

  const completedTasks = tasks.filter(function (task) {
    return task.completed;
  }).length;

  document.getElementById("total-count").textContent = tasks.length;
  document.getElementById("todo-count").textContent = tasks.length - completedTasks;
  document.getElementById("done-count").textContent = completedTasks;

  const taskCount = tasks.length === 1 ? "1 task" : tasks.length + " tasks";
  document.getElementById("task-count").textContent = taskCount;
}

// Add a task when the form is submitted
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskTitle.value.trim();

  if (title === "") {
    formMessage.textContent = "Please enter a task name.";
    return;
  }

  tasks.push({
    id: Date.now(),
    title: title,
    category: taskCategory.value,
    completed: false
  });

  saveTasks();
  showTasks();
  taskForm.reset();
  formMessage.textContent = "";
});

// Switch between light and dark mode
themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");
  themeButton.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// Remember the selected theme
if (localStorage.getItem(THEME_KEY) === "dark") {
  document.body.classList.add("dark-theme");
  themeButton.textContent = "Light mode";
}

showTasks();

