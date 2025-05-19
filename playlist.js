document.getElementById('createPlaylist').addEventListener('click', () => {
  const name = prompt("Enter playlist name:");
  if (!name) return;

  let playlists = JSON.parse(localStorage.getItem('playlists') || '{}');
  playlists[name] = currentPlaylist;
  localStorage.setItem('playlists', JSON.stringify(playlists));
  updatePlaylistSelect();
});

function updatePlaylistSelect() {
  let playlists = JSON.parse(localStorage.getItem('playlists') || '{}');
  playlistSelect.innerHTML = '';
  Object.keys(playlists).forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    playlistSelect.appendChild(option);
  });
}

playlistSelect.addEventListener('change', () => {
  let playlists = JSON.parse(localStorage.getItem('playlists') || '{}');
  const selected = playlistSelect.value;
  currentPlaylist = playlists[selected] || [];
  updateSongList();
});

window.onload = updatePlaylistSelect;
