document.addEventListener('DOMContentLoaded', async () => {
  const { data } = await db.auth.getSession();
  const session = data.session;
  showCorrectSection(session);
  setupAuthForm();
  if (session) {
    setupProfileForm(session.user.id);
  }
});

function showCorrectSection(session) {
  const authSection = document.getElementById('authSection');
  const profileSection = document.getElementById('profileSection');

  if (session) {
    authSection.style.display = 'none';
    profileSection.style.display = 'block';
    loadProfile(session.user);
  } else {
    authSection.style.display = 'block';
    profileSection.style.display = 'none';
  }
}

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

  submitBtn.addEventListener('click', async () => {
    const isSignUp = formTitle.innerText === 'Sign Up';
    if (isSignUp) {
      await handleSignUp(toggleLink);
    } else {
      await handleLogIn();
    }
  });
}

async function handleSignUp(toggleLink) {
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
  const { data, error } = await db.auth.signUp({ email, password: pass });

  if (error) {
    alert(error.message);
    return;
  }

  if (data.user) {
    const { error: profileError } = await db.from('profiles').insert({
      id: data.user.id,
      first_name: '',
      last_name: '',
      avatar_url: 'icon.webp'
    });
    if (profileError) {
      console.error('Profile creation failed:', profileError.message);
    }
  }

  alert('Registration successful! Check your email to confirm your account, then log in.');
  toggleLink.click();
}

async function handleLogIn() {
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const pass = document.getElementById('passwordInput').value;

  if (!email || !pass) {
    alert('Please enter your email and password.');
    return;
  }

const { error } = await db.auth.signInWithPassword({ email, password: pass });

if (error) {
    alert(error.message);
    return;
}
  window.location.reload();
}

async function loadProfile(user) {
  document.getElementById('profileEmailInput').value = user.email;

  const { data: profile, error } = await db
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Could not load profile:', error.message);
    return;
  }
  if (profile.first_name) document.getElementById('firstNameInput').value = profile.first_name;
  if (profile.last_name) document.getElementById('lastNameInput').value = profile.last_name;
  if (profile.avatar_url) document.getElementById('pfpPreview').src = profile.avatar_url;
}

function setupProfileForm(userId) {
  document.getElementById('pfpInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('pfpPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('saveProfileBtn').addEventListener('click', async () => {
    const { error } = await db.from('profiles').update({
      first_name: document.getElementById('firstNameInput').value.trim(),
      last_name: document.getElementById('lastNameInput').value.trim(),
      avatar_url: document.getElementById('pfpPreview').src || ''
    }).eq('id', userId);

    if (error) {
      alert('Could not save profile: ' + error.message);
      return;
    }
    alert('Profile saved!');
  });

  document.getElementById('changePassBtn').addEventListener('click', async () => {
    await changePassword();
  });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await db.auth.signOut();
    window.location.reload();
  });

document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    const confirmed = confirm('This will permanently delete your account. This cannot be undone. Continue?');
    if (!confirmed) return;

    const { data } = await db.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) {
        alert('You need to be logged in to do this.');
        return;
    }

    const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await response.json();

    if (!response.ok) {
        alert('Could not delete account: ' + (result?.error || 'Unknown error'));
        return;
    }

    alert('Your account has been deleted.');
    await db.auth.signOut();
    window.location.href = 'index.html';
});

async function changePassword() {
  const current = document.getElementById('currentPassInput').value;
  const newPass = document.getElementById('newPassInput').value;
  const confirmPass = document.getElementById('confirmPassInput').value;

  if (!current || !newPass || !confirmPass) {
    alert('Please fill in all password fields.');
    return;
  }
  if (newPass !== confirmPass) {
    alert('New passwords do not match.');
    return;
  }

  const { error } = await db.auth.updateUser({ password: newPass });

  if (error) {
    alert('Could not change password: ' + error.message);
    return;
  }

  alert('Password changed successfully!');
  document.getElementById('currentPassInput').value = '';
  document.getElementById('newPassInput').value = '';
  document.getElementById('confirmPassInput').value = '';
}
