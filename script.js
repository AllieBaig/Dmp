const fileInput       = document.getElementById("audio-upload");
const songList        = document.getElementById("songList");
const audioPlayer     = document.getElementById("audioPlayer");
const whiteNoise      = document.getElementById("whiteNoisePlayer");
const toggleWhiteNoise = document.getElementById("toggleWhiteNoise");
const statsDiv        = document.getElementById("stats");

const AUDIO_MIME_TYPES = new Set([
  "audio/mpeg", "audio/mp3", "audio/wav", "audio/aac", "audio/ogg", "audio/x-m4a"
]);

const STORAGE_KEY = "dualPlayer_listenTime";

let playlist = [];
let startTime = null;
let currentTrackElement = null;

fileInput.addEventListener("change", handleFileInput);
audioPlayer.addEventListener("pause", recordTime);
audioPlayer.addEventListener("ended", recordTime);
audioPlayer.addEventListener("error", () => alert("Playback failed. Please try a different file."));

toggleWhiteNoise.addEventListener("click", toggleWhiteNoisePlayback);
window.addEventListener("beforeunload", handleUnload);
window.addEventListener("load", showStats);

function handleFileInput() {
  Array.from(fileInput.files).forEach(file => {
    if (!AUDIO_MIME_TYPES.has(file.type)) {
      alert(`Unsupported format: ${file.name}`);
      return;
    }

    playlist.push({
      name: file.name,
      url: URL.createObjectURL(file)
    });
  });

  renderSongs();
  showStats();
}

function renderSongs() {
  songList.innerHTML = "";

  playlist.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.setAttribute("tabindex", "0"); // for keyboard access
    li.addEventListener("click", () => playSong(song, li));
    li.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playSong(song, li);
      }
    });
    songList.appendChild(li);
  });
}

function playSong(song, liElement) {
  if (audioPlayer.src === song.url && !audioPlayer.paused) return;

  if (currentTrackElement) {
    currentTrackElement.classList.remove("active");
  }

  currentTrackElement = liElement;
  currentTrackElement.classList.add("active");

  stopPlayback(); // stop previous playback
  audioPlayer.src = song.url;

  audioPlayer.play().then(() => {
    startTime = Date.now();
  }).catch(err => {
    console.error("Playback error:", err);
    alert("Unable to play the file. Please try a different one.");
  });
}

function stopPlayback() {
  audioPlayer.pause();
  recordTime();
  audioPlayer.src = "";
}

function recordTime() {
  if (!startTime) return;

  const elapsedSeconds = (Date.now() - startTime) / 1000;
  startTime = null;

  let total = 0;
  try {
    total = parseFloat(localStorage.getItem(STORAGE_KEY) || "0");
    if (isNaN(total)) total = 0;
  } catch (e) {
    console.warn("localStorage access failed:", e);
  }

  total += elapsedSeconds;

  try {
    localStorage.setItem(STORAGE_KEY, total.toString());
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }

  showStats();
}

function showStats() {
  let total = 0;
  try {
    total = parseFloat(localStorage.getItem(STORAGE_KEY) || "0");
    if (isNaN(total)) total = 0;
  } catch (e) {
    console.warn("localStorage access failed:", e);
  }

  const mins = Math.floor(total / 60);
  const secs = Math.floor(total % 60);
  statsDiv.textContent = `You’ve listened: ${mins}m ${secs}s`;
}

function toggleWhiteNoisePlayback() {
  if (!whiteNoise.src) {
    alert("White noise source not loaded.");
    return;
  }

  if (whiteNoise.paused) {
    whiteNoise.play().catch(() => alert("White noise playback blocked by browser."));
  } else {
    whiteNoise.pause();
  }
}

function handleUnload(e) {
  if (!audioPlayer.paused) {
    e.preventDefault();
    e.returnValue = ""; // Required for Chrome
  }
  recordTime();
}

let audioCtx;
let subliminalSource, maskingSource, whiteNoiseSource;
let subliminalGain, maskingGain;
let isPlaying = false;

document.getElementById('play-subliminal').addEventListener('click', async () => {
  if (isPlaying) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Setup gain nodes
  subliminalGain = audioCtx.createGain();
  maskingGain = audioCtx.createGain();

  const subliminalVolume = parseFloat(document.getElementById('subliminal-volume').value);
  const maskingVolume = parseFloat(document.getElementById('masking-volume').value);

  subliminalGain.gain.value = subliminalVolume;
  maskingGain.gain.value = maskingVolume;

  // Load subliminal audio
  const subliminalFile = document.getElementById('subliminal-file').files[0];
  if (!subliminalFile) return alert("Please select a subliminal file.");

  const subliminalBuffer = await fileToAudioBuffer(subliminalFile);
  subliminalSource = audioCtx.createBufferSource();
  subliminalSource.buffer = subliminalBuffer;
  subliminalSource.loop = true;
  subliminalSource.connect(subliminalGain).connect(audioCtx.destination);
  subliminalSource.start(0);

  // Load masking file or white noise
  const maskingFile = document.getElementById('masking-file').files[0];
  const useWhiteNoise = document.getElementById('use-white-noise').checked;

  if (maskingFile) {
    const maskingBuffer = await fileToAudioBuffer(maskingFile);
    maskingSource = audioCtx.createBufferSource();
    maskingSource.buffer = maskingBuffer;
    maskingSource.loop = true;
    maskingSource.connect(maskingGain).connect(audioCtx.destination);
    maskingSource.start(0);
  } else if (useWhiteNoise) {
    const whiteNoiseBuffer = await fetch('white_noise.mp3')
      .then(res => res.arrayBuffer())
      .then(data => audioCtx.decodeAudioData(data));
    whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = whiteNoiseBuffer;
    whiteNoiseSource.loop = true;
    whiteNoiseSource.connect(maskingGain).connect(audioCtx.destination);
    whiteNoiseSource.start(0);
  }

  isPlaying = true;
});

document.getElementById('stop-subliminal').addEventListener('click', () => {
  if (subliminalSource) subliminalSource.stop();
  if (maskingSource) maskingSource.stop();
  if (whiteNoiseSource) whiteNoiseSource.stop();
  isPlaying = false;
});

async function fileToAudioBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  return audioCtx.decodeAudioData(arrayBuffer);
}

