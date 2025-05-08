import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { getPlaylists, removeSongFromPlaylist, removePlaylist, savePlaylists, } from '../../src/utils/playlistStorage';
const Playlists = () => {
    const [playlists, setPlaylists] = useState(getPlaylists());
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const handleRemove = (playlistName, songId) => {
        removeSongFromPlaylist(playlistName, songId);
        const updated = getPlaylists();
        setPlaylists(updated);
        if (selectedPlaylist) {
            const selected = updated.find((p) => p.name === playlistName) || null;
            setSelectedPlaylist(selected);
        }
    };
    const handleRemovePlaylist = (playlistName) => {
        removePlaylist(playlistName);
        const updated = getPlaylists();
        setPlaylists(updated);
        setSelectedPlaylist(null);
    };
    const moveSong = (index, direction) => {
        if (!selectedPlaylist)
            return;
        const updatedSongs = [...selectedPlaylist.songs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= updatedSongs.length)
            return;
        [updatedSongs[index], updatedSongs[targetIndex]] = [
            updatedSongs[targetIndex],
            updatedSongs[index],
        ];
        const updatedPlaylist = {
            ...selectedPlaylist,
            songs: updatedSongs,
        };
        const updatedPlaylists = playlists.map((p) => p.name === selectedPlaylist.name ? updatedPlaylist : p);
        savePlaylists(updatedPlaylists);
        setPlaylists(updatedPlaylists);
        setSelectedPlaylist(updatedPlaylist);
    };
    if (selectedPlaylist) {
        return (_jsxs("div", { className: "playlist-container", children: [_jsx("button", { onClick: () => setSelectedPlaylist(null), className: "back-button", children: "\u2190 Back to Playlists" }), _jsxs("div", { className: "playlist-detail", children: [_jsxs("div", { className: "playlist-header", children: [_jsx("h3", { className: "playlist-name", children: selectedPlaylist.name }), _jsx("button", { onClick: () => handleRemovePlaylist(selectedPlaylist.name), className: "remove-playlist-button", children: "Remove Playlist" })] }), _jsx("ul", { className: "song-list", children: selectedPlaylist.songs.map((song, index) => (_jsxs("li", { className: "song-item", children: [_jsxs("div", { className: "song-controls", children: [_jsxs("h4", { className: "playlist-songtitle-artist", children: [song.title, " - ", song.artist] }), _jsxs("div", { className: "song-buttons", children: [_jsx("button", { onClick: () => moveSong(index, 'up'), disabled: index === 0, children: "\u2191" }), _jsx("button", { onClick: () => moveSong(index, 'down'), disabled: index === selectedPlaylist.songs.length - 1, children: "\u2193" }), _jsx("button", { onClick: () => handleRemove(selectedPlaylist.name, song._id), children: "Remove" })] })] }), _jsx("pre", { className: "song-lyrics", children: song.songLyrics })] }, song._id))) })] })] }));
    }
    return (_jsxs("div", { className: "playlist-container", children: [_jsx("h2", { className: "playlist-title", children: "Your Playlists" }), _jsx("ul", { className: "playlist-list", children: playlists.map((p) => (_jsx("li", { children: _jsx("button", { onClick: () => setSelectedPlaylist(p), className: "playlist-button", children: p.name }) }, p.name))) })] }));
};
export default Playlists;
