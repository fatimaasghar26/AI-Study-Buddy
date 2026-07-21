
let currentSession = null;

db.auth.getSession().then(({ data }) => {
  currentSession = data.session;
});

db.auth.onAuthStateChange((_event, session) => {
  currentSession = session;
});

function isLoggedIn() {
  return !!currentSession;
}

function requireLogin(actionName) {
  if (!isLoggedIn()) {
    alert(`Please log in first to use "${actionName}".`);
    window.location.href = 'Account.html';
    return false;
  }
  return true;
}

const guardedButtons = {
  addTaskBtn: 'Add Task',
  sendBtn: 'Send Message',
  start: 'Study Timer'
};

document.addEventListener('DOMContentLoaded', () => {
  for (const [buttonId, actionName] of Object.entries(guardedButtons)) {
    const button = document.getElementById(buttonId);
    if (!button) continue;

    button.addEventListener('click', (e) => {
      if (!requireLogin(actionName)) e.stopImmediatePropagation();
    }, true);
  }
});
