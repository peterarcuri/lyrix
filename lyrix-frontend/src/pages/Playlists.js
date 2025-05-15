import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Update path if needed
const Playlists = () => {
    const { playlists, setPlaylists } = useAuth();
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    // Debug log when component mounts or playlists change
    useEffect(() => {
        console.log('🎵 Playlists component - current playlists:', playlists);
    }, [playlists]);
    // If playlists is null, use an empty array
    const playlistsData = playlists || [];
    const handleRemove = (playlistName, songId) => {
        if (!playlistsData)
            return;
        console.log(`🗑️ Removing song ${songId} from playlist ${playlistName}`);
        // Find the playlist
        const playlist = playlistsData.find(p => p.name === playlistName);
        if (!playlist)
            return;
        // Remove the song
        const updatedPlaylist = Object.assign(Object.assign({}, playlist), { songs: playlist.songs.filter(song => song._id !== songId) });
        // Update playlists
        const updatedPlaylists = playlistsData.map(p => p.name === playlistName ? updatedPlaylist : p);
        console.log('📝 Updated playlists after song removal:', updatedPlaylists);
        // Update context (and localStorage)
        setPlaylists(updatedPlaylists);
        // Update selected playlist if needed
        if (selectedPlaylist && selectedPlaylist.name === playlistName) {
            setSelectedPlaylist(updatedPlaylist);
        }
    };
    const handleRemovePlaylist = (playlistName) => {
        if (!playlistsData)
            return;
        console.log(`🗑️ Removing entire playlist: ${playlistName}`);
        // Filter out the playlist
        const updatedPlaylists = playlistsData.filter(p => p.name !== playlistName);
        console.log('📝 Updated playlists after playlist removal:', updatedPlaylists);
        // Update context (and localStorage)
        setPlaylists(updatedPlaylists);
        setSelectedPlaylist(null);
    };
    const moveSong = (index, direction) => {
        if (!selectedPlaylist || !playlistsData)
            return;
        console.log(`🔄 Moving song at index ${index} ${direction}`);
        const updatedSongs = [...selectedPlaylist.songs];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= updatedSongs.length)
            return;
        // Swap songs
        [updatedSongs[index], updatedSongs[targetIndex]] = [
            updatedSongs[targetIndex],
            updatedSongs[index],
        ];
        const updatedPlaylist = Object.assign(Object.assign({}, selectedPlaylist), { songs: updatedSongs });
        const updatedPlaylists = playlistsData.map((p) => p.name === selectedPlaylist.name ? updatedPlaylist : p);
        console.log('📝 Updated playlists after song reordering:', updatedPlaylists);
        // Update context (and localStorage)
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
                React.createElement("ul", { className: "song-list" }, selectedPlaylist.songs.length > 0 ? (selectedPlaylist.songs.map((song, index) => (React.createElement("li", { key: song._id, className: "song-item" },
                    React.createElement("div", { className: "song-controls" },
                        React.createElement("h4", { className: "playlist-songtitle-artist" },
                            song.title,
                            " - ",
                            song.artist),
                        React.createElement("div", { className: "song-buttons" },
                            React.createElement("button", { onClick: () => moveSong(index, 'up'), disabled: index === 0 }, "\u2191"),
                            React.createElement("button", { onClick: () => moveSong(index, 'down'), disabled: index === selectedPlaylist.songs.length - 1 }, "\u2193"),
                            React.createElement("button", { onClick: () => handleRemove(selectedPlaylist.name, song._id) }, "Remove"))),
                    React.createElement("pre", { className: "song-lyrics" }, song.songLyrics))))) : (React.createElement("li", null, "No songs in this playlist"))))));
    }
    return (React.createElement("div", { className: "playlist-container" },
        React.createElement("h2", { className: "playlist-title" }, "Your Playlists"),
        React.createElement("ul", { className: "playlist-list" }, playlistsData.length > 0 ? (playlistsData.map((p) => {
            var _a;
            return (React.createElement("li", { key: p.name },
                React.createElement("button", { onClick: () => setSelectedPlaylist(p), className: "playlist-button" },
                    p.name,
                    " (",
                    ((_a = p.songs) === null || _a === void 0 ? void 0 : _a.length) || 0,
                    " songs)")));
        })) : (React.createElement("li", null, "No playlists found"))),
        React.createElement("div", { style: { marginTop: '20px', fontSize: '12px', color: '#666' } },
            React.createElement("p", null, "Debug info:"),
            React.createElement("pre", null, JSON.stringify({
                hasPlaylists: !!playlists,
                playlistCount: playlistsData.length
            }, null, 2)))));
};
export default Playlists;
