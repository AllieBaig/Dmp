// app.js - Refactored Dual-Player Music PWA Logic

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("audioFileInput");
  const songList = document.getElementById("audioFileList");

  if (!fileInput || !songList) {
    console.error("Required DOM elements not found.");
    return;
  }

  fileInput.addEventListener("change", handleFileSelection);

  function handleFileSelection(event) {
    const files = Array.from(event.target.files || []);
    songList.innerHTML = "";

    if (files.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No files selected.";
      songList.appendChild(li);
      return;
    }

    files.forEach((file) => {
      const li = document.createElement("li");
      li.textContent = sanitizeText(file.name);
      songList.appendChild(li);
    });

    // Optionally store selected filenames in localStorage for persistence
    const fileNames = files.map((file) => file.name);
    localStorage.setItem("audioFileNames", JSON.stringify(fileNames));
  }

  // Optional: Prepopulate list from localStorage on page load
  const savedFiles = JSON.parse(localStorage.getItem("audioFileNames") || "[]");
  savedFiles.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = sanitizeText(name);
    songList.appendChild(li);
  });
});

function exportLibrary() {
  let userProfile = {};

  try {
    const storedProfile = localStorage.getItem("userProfile");
    userProfile = storedProfile ? JSON.parse(storedProfile) : {};
  } catch (error) {
    console.error("Failed to parse user profile:", error);
    alert("Export failed: Corrupted user profile data.");
    return;
  }

  const data = {
    songs: [], // Placeholder - Add song metadata or filenames if needed
    profile: userProfile,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);

  a.href = url;
  a.download = "library.json";
  a.click();

  // Revoke URL to release memory
  URL.revokeObjectURL(url);

  alert("Library exported successfully.");
}

// Utility: Prevent injection risks by enforcing text-only content
function sanitizeText(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span.textContent;
}
