// Constants
const USER_STORAGE_KEY = 'authUser';

// Util: Generate a secure unique ID
function generateId(prefix = 'user') {
  return `${prefix}-${crypto.randomUUID()}`;
}

// Util: Load user from localStorage
function getStoredUser() {
  const userJSON = localStorage.getItem(USER_STORAGE_KEY);
  return userJSON ? JSON.parse(userJSON) : null;
}

// Util: Save user to localStorage
function setStoredUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

// Util: Clear stored user
function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

// Migrate guest data (placeholder for real sync logic)
function migrateGuestData(oldId, newId) {
  console.log(`Migrating data from ${oldId} to ${newId}`);
  // Implement cloud sync or local migration here
}

// Create Google Login Button (simulated or real)
function createLoginButton(user) {
  const btn = document.createElement('button');
  btn.textContent = 'Login with Google';
  btn.onclick = async () => {
    try {
      // Simulate login with random ID
      const newId = generateId('user');

      // Migrate data
      migrateGuestData(user.userId, newId);

      // Save real user
      const loggedInUser = {
        userId: newId,
        isGuest: false,
        profile: {
          name: 'Google User',
          avatarUrl: null // Simulate real profile data
        }
      };
      setStoredUser(loggedInUser);
      location.reload();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };
  return btn;
}

// Render user status in the UI
function renderUserStatus(user) {
  const userStatus = document.getElementById('userStatus');
  userStatus.innerHTML = '';

  const label = document.createElement('div');
  label.textContent = `Logged in as ${user.isGuest ? 'Guest' : user.profile?.name || 'User'}`;
  userStatus.appendChild(label);

  if (user.isGuest) {
    userStatus.appendChild(createLoginButton(user));
  }

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Logout';
  logoutBtn.onclick = () => {
    clearStoredUser();
    location.reload();
  };
  userStatus.appendChild(logoutBtn);
}

// Initialize authentication
function initializeAuth() {
  let user = getStoredUser();

  if (!user) {
    // Create guest user
    user = {
      userId: generateId('guest'),
      isGuest: true,
      profile: null
    };
    setStoredUser(user);
  }

  renderUserStatus(user);
}

// Entry point
window.onload = initializeAuth;
