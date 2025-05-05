"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const playlistStorage_1 = require("../utils/playlistStorage");
const Playlists = () => {
    const [playlists, setPlaylists] = (0, react_1.useState)((0, playlistStorage_1.getPlaylists)());
    const [selectedPlaylist, setSelectedPlaylist] = (0, react_1.useState)(null);
    const handleRemove = (playlistName, songId) => {
        (0, playlistStorage_1.removeSongFromPlaylist)(playlistName, songId);
        const updated = (0, playlistStorage_1.getPlaylists)();
        setPlaylists(updated);
        if (selectedPlaylist) {
            const selected = updated.find((p) => p.name === playlistName) || null;
            setSelectedPlaylist(selected);
        }
    };
    const handleRemovePlaylist = (playlistName) => {
        (0, playlistStorage_1.removePlaylist)(playlistName);
        const updated = (0, playlistStorage_1.getPlaylists)();
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
        (0, playlistStorage_1.savePlaylists)(updatedPlaylists);
        setPlaylists(updatedPlaylists);
        setSelectedPlaylist(updatedPlaylist);
    };
    if (selectedPlaylist) {
        return (react_1.default.createElement("div", { className: "playlist-container" },
            react_1.default.createElement("button", { onClick: () => setSelectedPlaylist(null), className: "back-button" }, "\u2190 Back to Playlists"),
            react_1.default.createElement("div", { className: "playlist-detail" },
                react_1.default.createElement("div", { className: "playlist-header" },
                    react_1.default.createElement("h3", { className: "playlist-name" }, selectedPlaylist.name),
                    react_1.default.createElement("button", { onClick: () => handleRemovePlaylist(selectedPlaylist.name), className: "remove-playlist-button" }, "Remove Playlist")),
                react_1.default.createElement("ul", { className: "song-list" }, selectedPlaylist.songs.map((song, index) => (react_1.default.createElement("li", { key: song._id, className: "song-item" },
                    react_1.default.createElement("div", { className: "song-controls" },
                        react_1.default.createElement("h4", { className: "playlist-songtitle-artist" },
                            song.title,
                            " - ",
                            song.artist),
                        react_1.default.createElement("div", { className: "song-buttons" },
                            react_1.default.createElement("button", { onClick: () => moveSong(index, 'up'), disabled: index === 0 }, "\u2191"),
                            react_1.default.createElement("button", { onClick: () => moveSong(index, 'down'), disabled: index === selectedPlaylist.songs.length - 1 }, "\u2193"),
                            react_1.default.createElement("button", { onClick: () => handleRemove(selectedPlaylist.name, song._id) }, "Remove"))),
                    react_1.default.createElement("pre", { className: "song-lyrics" }, song.songLyrics))))))));
    }
    return (react_1.default.createElement("div", { className: "playlist-container" },
        react_1.default.createElement("h2", { className: "playlist-title" }, "Your Playlists"),
        react_1.default.createElement("ul", { className: "playlist-list" }, playlists.map((p) => (react_1.default.createElement("li", { key: p.name },
            react_1.default.createElement("button", { onClick: () => setSelectedPlaylist(p), className: "playlist-button" }, p.name)))))));
};
exports.default = Playlists;
