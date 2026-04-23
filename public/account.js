// ── Mode: 'signup' or 'login' ───────────────────────────
let currentMode = 'signup';

// ── DOM references ──────────────────────────────────────
const formTitle           = document.getElementById('formTitle');
const formSubtitle        = document.getElementById('formSubtitle');
const formMessage         = document.getElementById('formMessage');
const emailInput          = document.getElementById('emailInput');
const passwordInput       = document.getElementById('passwordInput');
const repeatPasswordInput = document.getElementById('repeatPasswordInput');
const repeatPasswordGroup = document.getElementById('repeatPasswordGroup');
const rememberGroup       = document.getElementById('rememberGroup');
const termsText           = document.getElementById('termsText');
const submitBtn           = document.getElementById('submitBtn');
const cancelBtn           = document.getElementById('cancelBtn');
const toggleLink          = document.getElementById('toggleLink');
const toggleText          = document.getElementById('toggleText');

// ── Toggle between Sign Up and Login ───────────────────
toggleLink.addEventListener('click', function (e) {
  e.preventDefault();
  clearMessage();
  clearInputs();

  if (currentMode === 'signup') {
    switchToLogin();
  } else {
    switchToSignup();
  }
});

function switchToLogin() {
  currentMode = 'login';
  formTitle.textContent      = 'Log In';
  formSubtitle.textContent   = 'Welcome back! Please log in to your account.';
  submitBtn.textContent      = 'Log In';
  toggleText.textContent     = "Don't have an account? ";
  toggleLink.textContent     = 'Sign Up';
  repeatPasswordGroup.style.display = 'none';
  rememberGroup.style.display       = 'none';
  termsText.style.display           = 'none';
}

// function switchToSignup() {
//   currentMode = 'signup';
//   formTitle.textContent      = 'Sign Up';
//   formSubtitle.textContent   = 'Please fill in this form to create your account.';
//   submitBtn.textContent      = 'Sign Up';
//   toggleText.textContent     = 'Already have an account? ';
//   toggleLink.textContent     = 'Log In';
//   repeatPasswordGroup.style.display = 'block';
//   rememberGroup.style.display       = 'block';
//   termsText.style.display           = 'block';
// }

// // ── Submit button ───────────────────────────────────────
// submitBtn.addEventListener('click', function () {
//   clearMessage();

//   if (currentMode === 'signup') {
//     handleSignUp();
//   } else {
//     handleLogin();
//   }
// });

// // ── Cancel button ───────────────────────────────────────
// cancelBtn.addEventListener('click', function () {
//   clearInputs();
//   clearMessage();
// });

// // ── Allow Enter key to submit ───────────────────────────
// document.addEventListener('keydown', function (e) {
//   if (e.key === 'Enter') {
//     submitBtn.click();
//   }
// });

// // ── Sign Up logic ───────────────────────────────────────
// function handleSignUp() {
//   const email    = emailInput.value.trim();
//   const password = passwordInput.value;
//   const repeat   = repeatPasswordInput.value;

//   // Validation
//   if (!email) {
//     showMessage('Please enter your email address.', 'error');
//     return;
//   }
//   if (!isValidEmail(email)) {
//     showMessage('Please enter a valid email address.', 'error');
//     return;
//   }
//   if (!password) {
//     showMessage('Please enter a password.', 'error');
//     return;
//   }
//   if (password.length < 6) {
//     showMessage('Password must be at least 6 characters.', 'error');
//     return;
//   }
//   if (password !== repeat) {
//     showMessage('Passwords do not match.', 'error');
//     return;
//   }

//   // ── TODO: Replace this block with your real backend API call ──
//   // Example:
//   // fetch('/api/signup', {
//   //   method: 'POST',
//   //   headers: { 'Content-Type': 'application/json' },
//   //   body: JSON.stringify({ email, password })
//   // })
//   // .then(res => res.json())
//   // .then(data => { ... handle response ... })
//   // .catch(err => showMessage('Server error. Try again.', 'error'));

//   // For now: simulate success
//   showMessage('Account created successfully! You can now log in.', 'success');
//   clearInputs();
//   setTimeout(() => switchToLogin(), 1500);
// }

// // ── Login logic ─────────────────────────────────────────
// function handleLogin() {
//   const email    = emailInput.value.trim();
//   const password = passwordInput.value;

//   // Validation
//   if (!email) {
//     showMessage('Please enter your email address.', 'error');
//     return;
//   }
//   if (!isValidEmail(email)) {
//     showMessage('Please enter a valid email address.', 'error');
//     return;
//   }
//   if (!password) {
//     showMessage('Please enter your password.', 'error');
//     return;
//   }

//   // ── TODO: Replace this block with your real backend API call ──
//   // Example:
//   // fetch('/api/login', {
//   //   method: 'POST',
//   //   headers: { 'Content-Type': 'application/json' },
//   //   body: JSON.stringify({ email, password })
//   // })
//   // .then(res => res.json())
//   // .then(data => {
//   //   if (data.success) {
//   //     window.location.href = 'AI Chat.html';
//   //   } else {
//   //     showMessage(data.message || 'Invalid email or password.', 'error');
//   //   }
//   // })
//   // .catch(err => showMessage('Server error. Try again.', 'error'));

//   // For now: simulate success
//   showMessage('Logged in successfully! Redirecting...', 'success');
//   setTimeout(() => {
//     window.location.href = 'AI Chat.html';
//   }, 1500);
// }

// // ── Helpers ─────────────────────────────────────────────
// function isValidEmail(email) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

// function showMessage(msg, type) {
//   formMessage.textContent   = msg;
//   formMessage.style.display = 'block';

//   if (type === 'error') {
//     formMessage.style.backgroundColor = '#fdecea';
//     formMessage.style.color           = '#c62828';
//     formMessage.style.border          = '1px solid #f5c6c6';
//   } else {
//     formMessage.style.backgroundColor = '#e0f5e9';
//     formMessage.style.color           = '#2e7d32';
//     formMessage.style.border          = '1px solid #c3e6cb';
//   }
// }

// function clearMessage() {
//   formMessage.style.display = 'none';
//   formMessage.textContent   = '';
// }

// function clearInputs() {
//   emailInput.value          = '';
//   passwordInput.value       = '';
//   repeatPasswordInput.value = '';
// }