// app.js - placeholder for audio app logic
document.getElementById("fileInput").addEventListener("change", function(event) {
  const files = Array.from(event.target.files);
  const list = document.getElementById("songList");
  list.innerHTML = "";
  files.forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    list.appendChild(li);
  });
});

function exportLibrary() {
  const data = { songs: [], profile: JSON.parse(localStorage.getItem("userProfile") || "{}") };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "library.json";
  a.click();
}
