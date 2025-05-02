import { Playlist, Song } from '../types';

const STORAGE_KEY = 'lyrix_playlists';

export function getPlaylists(): Playlist[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function savePlaylists(playlists: Playlist[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

export function addSongToPlaylist(playlistName: string, song: Song) {
  const playlists = getPlaylists();
  let playlist = playlists.find((p) => p.name === playlistName);
  if (!playlist) {
    playlist = { name: playlistName, songs: [] };
    playlists.push(playlist);
  }
  if (!playlist.songs.find((s) => s._id === song._id)) {
    playlist.songs.push(song);
  }
  savePlaylists(playlists);
}

export function removeSongFromPlaylist(playlistName: string, songId: string) {
  const playlists = getPlaylists().map((p) =>
    p.name === playlistName
      ? { ...p, songs: p.songs.filter((song) => song._id !== songId) }
      : p
  );
  savePlaylists(playlists);
}

export function removePlaylist(playlistName: string) {
  const playlists = getPlaylists().filter((p) => p.name !== playlistName);
  savePlaylists(playlists);
}
