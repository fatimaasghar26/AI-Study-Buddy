

document.addEventListener('DOMContentLoaded', () => {
  const currentUserEmail = sessionStorage.getItem('userEmail');

  showCorrectSection(currentUserEmail);
  setupAuthForm();
  setupProfileForm(currentUserEmail);
});

// Helpers for reading/writing the "registered users" store 

function getUsers() {
  return JSON.parse(localStorage.getItem('registeredUsers')) || {};
}

function saveUsers(users) {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
}

// ---------- Showing the right section on page load ----------

function showCorrectSection(currentUserEmail) {
  const loggedIn = sessionStorage.getItem('loggedIn') === 'true';
  const authSection = document.getElementById('authSection');
  const profileSection = document.getElementById('profileSection');

  if (loggedIn && currentUserEmail) {
    authSection.style.display = 'none';
    profileSection.style.display = 'block';
    loadProfile(currentUserEmail);
  } else {
    authSection.style.display = 'block';
    profileSection.style.display = 'none';
  }
}

// ---------- Sign up / log in form ----------

function setupAuthForm() {
  const formTitle = document.getElementById('formTitle');
  const submitBtn = document.getElementById('submitBtn');
  const toggleLink = document.getElementById('toggleLink');
  const toggleText = document.getElementById('toggleText');
  const repeatGroup = document.getElementById('repeatPasswordGroup');
  const rememberGroup = document.getElementById('rememberGroup');
  const termsText = document.getElementById('termsText');
  const formSubtitle = document.getElementById('formSubtitle');

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    const isCurrentlySignUp = formTitle.innerText === 'Sign Up';

    if (isCurrentlySignUp) {
      // Switch to Log In mode
      formTitle.innerText = 'Log In';
      submitBtn.innerText = 'Log In';
      toggleLink.innerText = 'Sign Up';
      toggleText.innerText = "Don't have an account?";
      formSubtitle.innerText = 'Welcome back! Please log in.';
      repeatGroup.style.display = 'none';
      rememberGroup.style.display = 'none';
      termsText.style.display = 'none';
    } else {
      // Switch to Sign Up mode
      formTitle.innerText = 'Sign Up';
      submitBtn.innerText = 'Sign Up';
      toggleLink.innerText = 'Log In';
      toggleText.innerText = 'Already have an account?';
      formSubtitle.innerText = 'Please fill in this form to create your account.';
      repeatGroup.style.display = 'block';
      rememberGroup.style.display = 'flex';
      termsText.style.display = 'block';
    }
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('repeatPasswordInput').value = '';
  });

  submitBtn.addEventListener('click', () => {
    const isSignUp = formTitle.innerText === 'Sign Up';
    if (isSignUp) {
      handleSignUp(toggleLink);
    } else {
      handleLogIn();
    }
  });
}

function handleSignUp(toggleLink) {
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const pass = document.getElementById('passwordInput').value;
  const repeatPass = document.getElementById('repeatPasswordInput').value;

  if (!email || !pass) {
    alert('Please enter your email and password.');
    return;
  }
  if (pass !== repeatPass) {
    alert('Passwords do not match!');
    return;
  }

  const users = getUsers();
  if (users[email]) {
    alert('An account with this email already exists.');
    return;
  }

  users[email] = {
    password: pass,
    profile: { firstName: '', lastName: '', pfp: 'https://via.placeholder.com/100' }
  };
  saveUsers(users);

  alert('Registration successful! Switching to Log In.');
  toggleLink.click();
}

function handleLogIn() {
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const pass = document.getElementById('passwordInput').value;

  if (!email || !pass) {
    alert('Please enter your email and password.');
    return;
  }

  const users = getUsers();
  if (users[email] && users[email].password === pass) {
    sessionStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('userEmail', email);
    window.location.reload();
  } else {
    alert('Invalid email or password.');
  }
}

// ---------- Profile view/edit (shown after logging in) ----------

function loadProfile(email) {
  const users = getUsers();
  document.getElementById('profileEmailInput').value = email;

  const profile = users[email]?.profile;
  if (!profile) return;

  if (profile.firstName) document.getElementById('firstNameInput').value = profile.firstName;
  if (profile.lastName) document.getElementById('lastNameInput').value = profile.lastName;
  if (profile.pfp) document.getElementById('pfpPreview').src = profile.pfp;
}

function setupProfileForm(currentUserEmail) {
  document.getElementById('pfpInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('pfpPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    const users = getUsers();
    if (!users[currentUserEmail]) return;

    users[currentUserEmail].profile = {
      firstName: document.getElementById('firstNameInput').value.trim(),
      lastName: document.getElementById('lastNameInput').value.trim(),
      pfp: document.getElementById('pfpPreview').src || ''
    };
    saveUsers(users);
    alert('Profile saved!');
  });

  document.getElementById('changePassBtn').addEventListener('click', () => {
    changePassword(currentUserEmail);
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.reload();
  });

  document.getElementById('deleteAccountBtn').addEventListener('click', () => {
    deleteAccount(currentUserEmail);
  });
}

function changePassword(currentUserEmail) {
  const current = document.getElementById('currentPassInput').value;
  const newPass = document.getElementById('newPassInput').value;
  const confirmPass = document.getElementById('confirmPassInput').value;

  if (!current || !newPass || !confirmPass) {
    alert('Please fill in all password fields.');
    return;
  }

  const users = getUsers();
  if (!users[currentUserEmail]) return;

  if (users[currentUserEmail].password !== current) {
    alert('Current password is incorrect.');
    return;
  }
  if (newPass !== confirmPass) {
    alert('New passwords do not match.');
    return;
  }

  users[currentUserEmail].password = newPass;
  saveUsers(users);
  alert('Password changed successfully!');

  document.getElementById('currentPassInput').value = '';
  document.getElementById('newPassInput').value = '';
  document.getElementById('confirmPassInput').value = '';
}

function deleteAccount(currentUserEmail) {
  if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) {
    return;
  }

  const users = getUsers();
  if (users[currentUserEmail]) {
    delete users[currentUserEmail];
    saveUsers(users);
  }

  sessionStorage.clear();
  alert('Account deleted.');
  window.location.reload();
}
