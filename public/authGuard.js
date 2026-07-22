let currentSession = null;
let sessionReady = false;

function updateGuardedButtons() {
  for (const buttonId of Object.keys(guardedButtons)) {
    const button = document.getElementById(buttonId);
    if (button) button.disabled = !sessionReady;
  }
}

db.auth.getSession().then(({ data }) => {
  currentSession = data.session;
  sessionReady = true;
  updateGuardedButtons();
});

db.auth.onAuthStateChange((_event, session) => {
  currentSession = session;
  sessionReady = true;
  updateGuardedButtons();
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
  sendBtn: 'Send Message',
  start: 'Study Timer'
};

document.addEventListener('DOMContentLoaded', () => {
  updateGuardedButtons();
  for (const [buttonId, actionName] of Object.entries(guardedButtons)) {
    const button = document.getElementById(buttonId);
    if (!button) continue;

    button.addEventListener('click', (e) => {
      if (!requireLogin(actionName)) e.stopImmediatePropagation();
    }, true);
  }
});
