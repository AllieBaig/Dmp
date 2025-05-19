// Constants
const PLAYLIST_STORAGE_KEY = 'myApp_playlists';

// DOM References
let playlistSelect;
let currentPlaylist = [];

// Utility Functions
function getPlaylists() {
  try {
    return JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY)) || {};
  } catch (e) {
    console.error("Error reading playlists from localStorage:", e);
    return {};
  }
}

function savePlaylists(playlists) {
  try {
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
  } catch (e) {
    console.error("Error saving playlists to localStorage:", e);
  }
}

function savePlaylist(name, playlist) {
  const playlists = getPlaylists();
  playlists[name] = playlist;
  savePlaylists(playlists);
}

function updatePlaylistSelect() {
  const playlists = getPlaylists();
  playlistSelect.innerHTML = '';

  const sortedNames = Object.keys(playlists).sort();
  for (const name of sortedNames) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    playlistSelect.appendChild(option);
  }
}

function handleCreatePlaylist() {
  const name = prompt("Enter playlist name:");
  if (!name) return;

  const playlists = getPlaylists();
  if (playlists[name]) {
    const overwrite = confirm(`Playlist "${name}" already exists. Overwrite?`);
    if (!overwrite) return;
  }

  savePlaylist(name, currentPlaylist);
  updatePlaylistSelect();
  playlistSelect.value = name;
  alert(`Playlist "${name}" saved.`);
}

function handlePlaylistChange() {
  const playlists = getPlaylists();
  const selected = playlistSelect.value;
  currentPlaylist = playlists[selected] || [];

  updateSongList(); // Assuming this function exists in your app
}

document.addEventListener('DOMContentLoaded', () => {
  playlistSelect = document.getElementById('playlistSelect');
  const createBtn = document.getElementById('createPlaylist');

  if (!playlistSelect || !createBtn) {
    console.error("Required DOM elements not found.");
    return;
  }

  createBtn.addEventListener('click', handleCreatePlaylist);
  playlistSelect.addEventListener('change', handlePlaylistChange);

  updatePlaylistSelect();
});
