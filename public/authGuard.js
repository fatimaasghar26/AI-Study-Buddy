// Blocks certain buttons until the user is logged in.
// Used across pages that have actions requiring an account
// (adding tasks, sending chat messages, starting the timer).

function isLoggedIn() {
  return sessionStorage.getItem('loggedIn') === 'true';
}

function requireLogin(actionName) {
  if (!isLoggedIn()) {
    alert(`Please log in first to use "${actionName}".`);
    window.location.href = 'Account.html';
    return false;
  }
  return true;
}

// Maps a button's id to the label shown in the login prompt.
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
