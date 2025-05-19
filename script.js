// script.js

const fileInput       = document.getElementById("fileInput");
const songList        = document.getElementById("songList");
const audioPlayer     = document.getElementById("audioPlayer");
const whiteNoise      = document.getElementById("whiteNoisePlayer");
const toggleWhitespace= document.getElementById("toggleWhiteNoise");
const statsDiv        = document.getElementById("stats");

let playlist = [];
let startTime = null;
const formats = ["audio/mpeg","audio/mp3","audio/wav","audio/aac","audio/ogg","audio/x-m4a"];

fileInput.addEventListener("change", () => {
  Array.from(fileInput.files).forEach(file => {
    if (!formats.includes(file.type)) return;
    playlist.push({ name: file.name, url: URL.createObjectURL(file) });
  });
  renderSongs();
  showStats();
});

function renderSongs() {
  songList.innerHTML = "";
  playlist.forEach(song => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.onclick = () => playSong(song.url);
    songList.appendChild(li);
  });
}

function playSong(url) {
  audioPlayer.src = url;
  audioPlayer.play();
  startTime = Date.now();
}

audioPlayer.addEventListener("pause",   recordTime);
audioPlayer.addEventListener("ended",   recordTime);

function recordTime() {
  if (!startTime) return;
  const seconds = (Date.now() - startTime) / 1000;
  let total = parseFloat(localStorage.getItem("listenTime")||"0");
  total += seconds;
  localStorage.setItem("listenTime", total.toString());
  startTime = null;
  showStats();
}

toggleWhitespace.addEventListener("click", () => {
  if (whiteNoise.paused) whiteNoise.play();
  else whiteNoise.pause();
});

function showStats() {
  const total = parseFloat(localStorage.getItem("listenTime")||"0");
  const mins  = Math.floor(total/60);
  const secs  = Math.floor(total%60);
  statsDiv.textContent = `You’ve listened: ${mins}m ${secs}s`;
}

// Ensure stats persist on reload
window.addEventListener("load", showStats);
