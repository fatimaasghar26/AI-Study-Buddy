let tasks = [];
let currentFilter = 'all';

async function loadTasks() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    tasks = [];
    renderTasks();
    return;
  }

  const { data, error } = await db
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Could not load tasks:', error.message);
    return;
  }

  tasks = data.map(t => ({
    id: t.id,
    name: t.name,
    subject: t.subject,
    date: t.due_date,
    priority: t.priority,
    done: t.done
  }));
  renderTasks();
}

async function addTask() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    alert('Please log in first.');
    return;
  }

  let name = document.getElementById('taskName').value.trim();
  let subject = document.getElementById('taskSubject').value.trim();
  let date = document.getElementById('taskDate').value;
  let priority = document.getElementById('taskPriority').value;

  if (name === '') {
    alert('Enter task name');
    return;
  }

  const { data, error } = await db.from('tasks').insert({
    user_id: session.user.id,
    name,
    subject,
    due_date: date || null,
    priority,
    done: false
  }).select().single();

  if (error) {
    alert('Could not add task: ' + error.message);
    return;
  }

  tasks.push({
    id: data.id,
    name: data.name,
    subject: data.subject,
    date: data.due_date,
    priority: data.priority,
    done: data.done
  });
  renderTasks();

  document.getElementById('taskName').value = '';
  document.getElementById('taskSubject').value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('taskPriority').value = 'Medium';
}

async function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newDone = !task.done;
  const { error } = await db.from('tasks').update({ done: newDone }).eq('id', id);

  if (error) {
    alert('Could not update task: ' + error.message);
    return;
  }

  task.done = newDone;
  renderTasks();
}

async function deleteTask(id) {
  const { error } = await db.from('tasks').delete().eq('id', id);

  if (error) {
    alert('Could not delete task: ' + error.message);
    return;
  }

  tasks = tasks.filter(t => t.id !== id);
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
  loadTasks();
});
