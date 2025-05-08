var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import { searchSongs } from '../services/api';
import { addSongToPlaylist } from '../utils/playlistStorage';
const SongSearch = ({ searchResults }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [playlistName, setPlaylistName] = useState('');
    const [noResults, setNoResults] = useState(false);
    // If searchResults are passed in (for tests), use them instead
    useEffect(() => {
        if (searchResults) {
            setResults(searchResults);
        }
    }, [searchResults]);
    const runSearch = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Running search for:', query);
        try {
            const res = yield searchSongs(query);
            console.log('Raw search response:', res);
            const songs = Array.isArray(res.data) ? res.data : [];
            if (songs.length === 0) {
                console.error('No songs found.');
                setNoResults(true);
            }
            else {
                setNoResults(false);
            }
            setResults(songs);
        }
        catch (err) {
            console.error('Search failed:', err);
            setResults([]);
            setNoResults(true);
        }
    });
    const handleSave = (song) => {
        if (!playlistName)
            return alert('Enter a playlist name first');
        addSongToPlaylist(playlistName, song);
        alert(`Saved to "${playlistName}"`);
    };
    return (React.createElement("div", { className: "song-search-container" },
        React.createElement("div", { className: "search-bar" },
            React.createElement("input", { className: "search-input", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search by title or artist", onKeyUp: (e) => {
                    if (e.key === 'Enter')
                        runSearch();
                } }),
            React.createElement("button", { className: "search-button", onClick: runSearch }, "Search")),
        noResults && (React.createElement("p", { className: "no-results-message" }, "Song or Artist not found. Please enter another selection.")),
        Array.isArray(results) && results.length > 0 && (React.createElement("div", { className: "results-wrapper" },
            React.createElement("ul", null, results.map((song) => (React.createElement("li", { key: song._id },
                React.createElement("div", { className: "song-card" },
                    React.createElement("div", { className: "song-info" },
                        React.createElement("h1", null, song.title),
                        React.createElement("h2", null, song.artist),
                        React.createElement("p", null, song.songLyrics)),
                    React.createElement("div", { className: "playlist-actions" },
                        React.createElement("input", { className: "search-input", value: playlistName, onChange: (e) => setPlaylistName(e.target.value), placeholder: "Enter playlist name", onKeyUp: (e) => {
                                if (e.key === 'Enter')
                                    handleSave(song);
                            } }),
                        React.createElement("button", { className: "search-button", onClick: () => handleSave(song) }, "Save")))))))))));
};
export default SongSearch;
