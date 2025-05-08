import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { searchSongs } from '../services/api';
import { addSongToPlaylist } from '../utils/playlistStorage';
export const SongSearch = ({ searchResults }) => {
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
    const runSearch = async () => {
        console.log('Running search for:', query);
        try {
            const res = await searchSongs(query);
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
    };
    const handleSave = (song) => {
        if (!playlistName)
            return alert('Enter a playlist name first');
        addSongToPlaylist(playlistName, song);
        alert(`Saved to "${playlistName}"`);
    };
    return (_jsxs("div", { className: "song-search-container", children: [_jsxs("div", { className: "search-bar", children: [_jsx("input", { className: "search-input", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search by title or artist", onKeyUp: (e) => {
                            if (e.key === 'Enter')
                                runSearch();
                        } }), _jsx("button", { className: "search-button", onClick: runSearch, children: "Search" })] }), noResults && (_jsx("p", { className: "no-results-message", children: "Song or Artist not found. Please enter another selection." })), Array.isArray(results) && results.length > 0 && (_jsx("div", { className: "results-wrapper", children: _jsx("ul", { children: results.map((song) => (_jsx("li", { children: _jsxs("div", { className: "song-card", children: [_jsxs("div", { className: "song-info", children: [_jsx("h1", { children: song.title }), _jsx("h2", { children: song.artist }), _jsx("p", { children: song.songLyrics })] }), _jsxs("div", { className: "playlist-actions", children: [_jsx("input", { className: "search-input", value: playlistName, onChange: (e) => setPlaylistName(e.target.value), placeholder: "Enter playlist name", onKeyUp: (e) => {
                                                if (e.key === 'Enter')
                                                    handleSave(song);
                                            } }), _jsx("button", { className: "search-button", onClick: () => handleSave(song), children: "Save" })] })] }) }, song._id))) }) }))] }));
};
