document.addEventListener('DOMContentLoaded', () => {
  const loggedIn = sessionStorage.getItem('loggedIn') === 'true';
  const currentUserEmail = sessionStorage.getItem('userEmail');
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
    const isSignUp = formTitle.innerText === 'Sign Up';
    if (isSignUp) {
      formTitle.innerText = 'Log In';
      submitBtn.innerText = 'Log In';
      toggleLink.innerText = 'Sign Up';
      toggleText.innerText = "Don't have an account?";
      formSubtitle.innerText = 'Welcome back! Please log in.';
      repeatGroup.style.display = 'none';
      rememberGroup.style.display = 'none';
      termsText.style.display = 'none';
    } else {
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
    const email = document.getElementById('emailInput').value.trim().toLowerCase();
    const pass = document.getElementById('passwordInput').value;
    const repeatPass = document.getElementById('repeatPasswordInput').value;
    const isSignUp = formTitle.innerText === 'Sign Up';
    if (!email || !pass) {
      alert('Please enter your email and password.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
    if (isSignUp) {
      if (pass !== repeatPass) {
        alert('Passwords do not match!');
        return;
      }
      if (users[email]) {
        alert('An account with this email already exists.');
        return;
      }
      users[email] = {
        password: pass,
        profile: { firstName: '', lastName: '', pfp: 'https://via.placeholder.com/100' }
      };
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      alert('Registration successful! Switching to Log In.');
      toggleLink.click();
    } else {
      if (users[email] && users[email].password === pass) {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        window.location.reload();
      } else {
        alert('Invalid email or password.');
      }
    }
  });
  function loadProfile(email) {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
    document.getElementById('profileEmailInput').value = email;
    if (users[email] && users[email].profile) {
      const p = users[email].profile;
      if (p.firstName) document.getElementById('firstNameInput').value = p.firstName;
      if (p.lastName) document.getElementById('lastNameInput').value = p.lastName;
      if (p.pfp) document.getElementById('pfpPreview').src = p.pfp;
    }
  }
  document.getElementById('pfpInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('pfpPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
    if (!users[currentUserEmail]) return;
    users[currentUserEmail].profile = {
      firstName: document.getElementById('firstNameInput').value.trim(),
      lastName: document.getElementById('lastNameInput').value.trim(),
      pfp: document.getElementById('pfpPreview').src || ''
    };
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    alert('Profile saved!');
  });
  document.getElementById('changePassBtn').addEventListener('click', () => {
    const current = document.getElementById('currentPassInput').value;
    const newPass = document.getElementById('newPassInput').value;
    const confirm = document.getElementById('confirmPassInput').value;
    if (!current || !newPass || !confirm) {
      alert('Please fill in all password fields.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
    if (!users[currentUserEmail]) return;
    if (users[currentUserEmail].password !== current) {
      alert('Current password is incorrect.');
      return;
    }
    if (newPass !== confirm) {
      alert('New passwords do not match.');
      return;
    }
    users[currentUserEmail].password = newPass;
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    alert('Password changed successfully!');
    document.getElementById('currentPassInput').value = '';
    document.getElementById('newPassInput').value = '';
    document.getElementById('confirmPassInput').value = '';
  });
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.reload();
  });
  document.getElementById('deleteAccountBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      const users = JSON.parse(localStorage.getItem('registeredUsers')) || {};
      if (users[currentUserEmail]) {
        delete users[currentUserEmail];
        localStorage.setItem('registeredUsers', JSON.stringify(users));
      }
      sessionStorage.clear();
      alert('Account deleted.');
      window.location.reload();
    }
  });
});s