// ── State ──────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');
let currentFilter = 'all';

// ── Save to localStorage ────────────────────────────────
function saveTasks() {
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

// ── Add Task ────────────────────────────────────────────
function addTask() {
  const name     = document.getElementById('taskName').value.trim();
  const subject  = document.getElementById('taskSubject').value.trim();
  const date     = document.getElementById('taskDate').value;
  const priority = document.getElementById('taskPriority').value;

  if (!name) {
    alert('Please enter a task name.');
    return;
  }

  const task = {
    id:       Date.now(),
    name:     name,
    subject:  subject || 'General',
    date:     date,
    priority: priority,
    done:     false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  // Clear inputs
  document.getElementById('taskName').value    = '';
  document.getElementById('taskSubject').value = '';
  document.getElementById('taskDate').value    = '';
  document.getElementById('taskPriority').value = 'Medium';
}

// ── Toggle Done ─────────────────────────────────────────
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    renderTasks();
  }
}

// ── Delete Task ─────────────────────────────────────────
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// ── Filter ──────────────────────────────────────────────
function filterTasks(filter, btn) {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  renderTasks();
}

// ── Render ──────────────────────────────────────────────
function renderTasks() {
  const list     = document.getElementById('taskList');
  const emptyMsg = document.getElementById('emptyMsg');

  // Filter tasks based on current filter
  let filtered;
  if (currentFilter === 'pending') {
    filtered = tasks.filter(t => !t.done);
  } else if (currentFilter === 'done') {
    filtered = tasks.filter(t => t.done);
  } else {
    filtered = tasks;
  }

  // Show/hide empty message
  emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';

  // Remove existing task cards (keep the emptyMsg element)
  const existingCards = list.querySelectorAll('.task-card');
  existingCards.forEach(card => card.remove());

  // Build task cards
  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card' + (task.done ? ' task-done' : '');

    // Format the due date nicely
    let dateStr = '';
    if (task.date) {
      const d = new Date(task.date + 'T00:00:00');
      dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Priority badge colour class
    const priorityClass = 'priority-' + task.priority.toLowerCase();

    card.innerHTML = `
      <div class="task-left">
        <input
          type="checkbox"
          ${task.done ? 'checked' : ''}
          onchange="toggleDone(${task.id})"
          title="Mark as ${task.done ? 'pending' : 'done'}"
        >
        <div class="task-info">
          <span class="task-name" style="${task.done ? 'text-decoration:line-through;' : ''}">${escapeHTML(task.name)}</span>
          <span class="task-meta">
            ${escapeHTML(task.subject)}${dateStr ? '  ·  Due: ' + dateStr : ''}
          </span>
        </div>
      </div>
      <div class="task-right">
        <span class="priority-badge ${priorityClass}">${task.priority}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete task">✕</button>
      </div>
    `;

    list.appendChild(card);
  });
}

// ── Sanitise user input before inserting into HTML ──────
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Allow pressing Enter in the Task Name field ─────────
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('taskName').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });

  // Initial render (loads saved tasks from localStorage)
  renderTasks();
});
