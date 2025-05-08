import React, { useState } from 'react';
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
        const updatedPlaylist = Object.assign(Object.assign({}, selectedPlaylist), { songs: updatedSongs });
        const updatedPlaylists = playlists.map((p) => p.name === selectedPlaylist.name ? updatedPlaylist : p);
        savePlaylists(updatedPlaylists);
        setPlaylists(updatedPlaylists);
        setSelectedPlaylist(updatedPlaylist);
    };
    if (selectedPlaylist) {
        return (React.createElement("div", { className: "playlist-container" },
            React.createElement("button", { onClick: () => setSelectedPlaylist(null), className: "back-button" }, "\u2190 Back to Playlists"),
            React.createElement("div", { className: "playlist-detail" },
                React.createElement("div", { className: "playlist-header" },
                    React.createElement("h3", { className: "playlist-name" }, selectedPlaylist.name),
                    React.createElement("button", { onClick: () => handleRemovePlaylist(selectedPlaylist.name), className: "remove-playlist-button" }, "Remove Playlist")),
                React.createElement("ul", { className: "song-list" }, selectedPlaylist.songs.map((song, index) => (React.createElement("li", { key: song._id, className: "song-item" },
                    React.createElement("div", { className: "song-controls" },
                        React.createElement("h4", { className: "playlist-songtitle-artist" },
                            song.title,
                            " - ",
                            song.artist),
                        React.createElement("div", { className: "song-buttons" },
                            React.createElement("button", { onClick: () => moveSong(index, 'up'), disabled: index === 0 }, "\u2191"),
                            React.createElement("button", { onClick: () => moveSong(index, 'down'), disabled: index === selectedPlaylist.songs.length - 1 }, "\u2193"),
                            React.createElement("button", { onClick: () => handleRemove(selectedPlaylist.name, song._id) }, "Remove"))),
                    React.createElement("pre", { className: "song-lyrics" }, song.songLyrics))))))));
    }
    return (React.createElement("div", { className: "playlist-container" },
        React.createElement("h2", { className: "playlist-title" }, "Your Playlists"),
        React.createElement("ul", { className: "playlist-list" }, playlists.map((p) => (React.createElement("li", { key: p.name },
            React.createElement("button", { onClick: () => setSelectedPlaylist(p), className: "playlist-button" }, p.name)))))));
};
export default Playlists;
