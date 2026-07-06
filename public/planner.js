let tasks = JSON.parse(localStorage.getItem('studyTasks')) || [];
let currentFilter = 'all';
function saveTasks() {
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
}
function addTask() {
  let name = document.getElementById('taskName').value.trim();
  let subject = document.getElementById('taskSubject').value.trim();
  let date = document.getElementById('taskDate').value;
  let priority = document.getElementById('taskPriority').value;

  if (name === '') {
    alert('Enter task name');
    return;
  }

  tasks.push({
    id: Date.now(),
    name,
    subject,
    date,
    priority,
    done: false
  });

  saveTasks();
  renderTasks();

  document.getElementById('taskName').value = '';
  document.getElementById('taskSubject').value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('taskPriority').value = 'Medium';
}
function toggleDone(id) {
  for (let t of tasks) {
    if (t.id === id) {
      t.done = !t.done;
      break;
    }
  }
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}
function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}
function renderTasks() {
  let list = document.getElementById('taskList');
  let emptyMsg = document.getElementById('emptyMsg');
  let filtered = tasks;
  if (currentFilter === 'pending') {
    filtered = tasks.filter(t => !t.done);
  } else if (currentFilter === 'done') {
    filtered = tasks.filter(t => t.done);
  }

  emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';
  document.querySelectorAll('.task-card').forEach(c => c.remove());

  filtered.forEach(task => {
    let card = document.createElement('div');
    card.className = 'task-card' + (task.done ? ' task-done' : '');

    let dateStr = '';
    if (task.date) {
      let d = new Date(task.date);
      dateStr = d.toDateString();
    }
    let priorityClass = 'priority-' + task.priority.toLowerCase();
    card.innerHTML = `
      <div>
        <input type="checkbox" ${task.done ? 'checked' : ''}
          onchange="toggleDone(${task.id})">
        <span style="${task.done ? 'text-decoration:line-through;' : ''}">
          ${escapeHTML(task.name)}
        </span>
        <br>
        <small>
          ${escapeHTML(task.subject)}
          ${dateStr ? ' | Due: ' + dateStr : ''}
        </small>
      </div>

      <div>
        <span class="${priorityClass}">${task.priority}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">X</button>
      </div>
    `;

    list.appendChild(card);
  });
}
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('taskName').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });
  renderTasks(); 
}); 
