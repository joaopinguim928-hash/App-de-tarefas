let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "card task";
    if (task.completed) div.classList.add("completed");

    div.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    list.appendChild(div);

    if (task.time && !task.completed) {
      scheduleNotification(task.text, task.time);
    }
  });
}

function addTask() {
  const text = document.getElementById("taskInput").value;
  const time = document.getElementById("taskTime").value;

  if (!text) return alert("Digite uma tarefa!");

  tasks.push({ text, completed: false, time });
  saveTasks();
  renderTasks();

  document.getElementById("taskInput").value = "";
  document.getElementById("taskTime").value = "";
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function scheduleNotification(text, time) {
  const delay = new Date(time) - new Date();

  if (delay > 0) {
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("Lembrete", { body: text });
      }
    }, delay);
  }
}

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

renderTasks();
