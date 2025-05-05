"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylists = getPlaylists;
exports.savePlaylists = savePlaylists;
exports.addSongToPlaylist = addSongToPlaylist;
exports.removeSongFromPlaylist = removeSongFromPlaylist;
exports.removePlaylist = removePlaylist;
const STORAGE_KEY = 'lyrix_playlists';
function getPlaylists() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
function savePlaylists(playlists) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}
function addSongToPlaylist(playlistName, song) {
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
function removeSongFromPlaylist(playlistName, songId) {
    const playlists = getPlaylists().map((p) => p.name === playlistName
        ? Object.assign(Object.assign({}, p), { songs: p.songs.filter((song) => song._id !== songId) }) : p);
    savePlaylists(playlists);
}
function removePlaylist(playlistName) {
    const playlists = getPlaylists().filter((p) => p.name !== playlistName);
    savePlaylists(playlists);
}
