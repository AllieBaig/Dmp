// profile.js - handles user profile (temp and authenticated)
let profile = {
  id: localStorage.getItem("userId") || crypto.randomUUID(),
  isTemp: localStorage.getItem("isTemp") !== "false",
  totalListenTime: parseInt(localStorage.getItem("totalListenTime") || "0", 10),
  badges: JSON.parse(localStorage.getItem("badges") || "[]"),
};

function saveProfile() {
  localStorage.setItem("userId", profile.id);
  localStorage.setItem("isTemp", profile.isTemp);
  localStorage.setItem("totalListenTime", profile.totalListenTime);
  localStorage.setItem("badges", JSON.stringify(profile.badges));
}

function upgradeToAuthProfile(userId) {
  profile.id = userId;
  profile.isTemp = false;
  saveProfile();
  alert("Temporary profile data transferred to authenticated user!");
}

function simulateLogin() {
  const simulatedUserId = "google-uid-" + crypto.randomUUID().slice(0, 8);
  upgradeToAuthProfile(simulatedUserId);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("profileInfo").textContent = profile.isTemp
    ? "Guest Profile"
    : `Logged in as ${profile.id}`;
  document.getElementById("simulateLoginBtn").addEventListener("click", simulateLogin);
});
