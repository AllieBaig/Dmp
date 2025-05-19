function loadUser() {
  const tempId = localStorage.getItem('tempUserId');
  const userStatus = document.getElementById('userStatus');

  if (!tempId) {
    const id = 'temp-' + Date.now();
    localStorage.setItem('tempUserId', id);
    userStatus.innerHTML = `Logged in as Guest`;
  } else {
    userStatus.innerHTML = `Logged in as ${tempId.startsWith('temp') ? 'Guest' : 'User'}`;
  }

  // Placeholder for actual login
  const loginBtn = document.createElement('button');
  loginBtn.textContent = "Login with Google";
  loginBtn.onclick = () => {
    const realId = "user-" + Math.floor(Math.random() * 9999);
    migrateTempData(tempId, realId);
    localStorage.setItem('tempUserId', realId);
    location.reload();
  };
  userStatus.appendChild(loginBtn);
}

function migrateTempData(tempId, newId) {
  // In actual implementation, this would sync temp localStorage to cloud
  console.log(`Migrating data from ${tempId} to ${newId}`);
}

window.onload = loadUser;
