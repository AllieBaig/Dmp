// Constants for localStorage keys
const STORAGE_KEYS = {
  userId: "userId",
  isTemp: "isTemp",
  totalListenTime: "totalListenTime",
  badges: "badges",
  version: "profileVersion",
};

const PROFILE_VERSION = 1;

const defaultProfile = {
  id: crypto.randomUUID(),
  isTemp: true,
  totalListenTime: 0,
  badges: [],
  version: PROFILE_VERSION,
};

class ProfileManager {
  constructor() {
    this.profile = { ...defaultProfile };
    this.load();
  }

  load() {
    try {
      const storedVersion = parseInt(localStorage.getItem(STORAGE_KEYS.version), 10);
      if (isNaN(storedVersion) || storedVersion > PROFILE_VERSION) {
        console.warn("Profile version mismatch or corrupted. Resetting to default.");
        return;
      }

      const id = localStorage.getItem(STORAGE_KEYS.userId);
      const isTemp = localStorage.getItem(STORAGE_KEYS.isTemp);
      const totalListenTime = parseInt(localStorage.getItem(STORAGE_KEYS.totalListenTime), 10);
      const badgesRaw = localStorage.getItem(STORAGE_KEYS.badges);

      if (id) this.profile.id = id;
      if (isTemp === "false") this.profile.isTemp = false;
      if (!isNaN(totalListenTime)) this.profile.totalListenTime = totalListenTime;

      try {
        const badges = JSON.parse(badgesRaw || "[]");
        if (Array.isArray(badges)) this.profile.badges = badges;
      } catch (e) {
        console.warn("Badges data corrupted. Resetting to empty array.");
        this.profile.badges = [];
      }
    } catch (e) {
      console.error("Failed to load profile from localStorage:", e);
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.userId, this.profile.id);
      localStorage.setItem(STORAGE_KEYS.isTemp, String(this.profile.isTemp));
      localStorage.setItem(STORAGE_KEYS.totalListenTime, String(this.profile.totalListenTime));
      localStorage.setItem(STORAGE_KEYS.badges, JSON.stringify(this.profile.badges));
      localStorage.setItem(STORAGE_KEYS.version, String(PROFILE_VERSION));
    } catch (e) {
      console.error("Failed to save profile to localStorage:", e);
    }
  }

  upgradeToAuthProfile(newUserId) {
    if (!newUserId || typeof newUserId !== "string") {
      throw new Error("Invalid user ID during upgrade.");
    }

    this.profile.id = newUserId;
    this.profile.isTemp = false;
    this.save();
    alert("Temporary profile data transferred to authenticated user!");
  }

  simulateLogin() {
    const simulatedUserId = "google-uid-" + crypto.randomUUID().slice(0, 8);
    this.upgradeToAuthProfile(simulatedUserId);
  }

  getProfile() {
    return { ...this.profile };
  }
}

// UI Logic
document.addEventListener("DOMContentLoaded", () => {
  const profileManager = new ProfileManager();
  const { id, isTemp } = profileManager.getProfile();

  const profileInfo = document.getElementById("profileInfo");
  if (profileInfo) {
    profileInfo.textContent = isTemp ? "Guest Profile" : `Logged in as ${id}`;
  }

  const loginBtn = document.getElementById("simulateLoginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => profileManager.simulateLogin());
  }
});
