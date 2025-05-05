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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const api_1 = require("../services/api");
const playlistStorage_1 = require("../utils/playlistStorage");
const SongSearch = ({ searchResults }) => {
    const [query, setQuery] = (0, react_1.useState)('');
    const [results, setResults] = (0, react_1.useState)([]);
    const [playlistName, setPlaylistName] = (0, react_1.useState)('');
    const [noResults, setNoResults] = (0, react_1.useState)(false);
    // If searchResults are passed in (for tests), use them instead
    (0, react_1.useEffect)(() => {
        if (searchResults) {
            setResults(searchResults);
        }
    }, [searchResults]);
    const runSearch = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Running search for:', query);
        try {
            const res = yield (0, api_1.searchSongs)(query);
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
        (0, playlistStorage_1.addSongToPlaylist)(playlistName, song);
        alert(`Saved to "${playlistName}"`);
    };
    return (react_1.default.createElement("div", { className: "song-search-container" },
        react_1.default.createElement("div", { className: "search-bar" },
            react_1.default.createElement("input", { className: "search-input", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search by title or artist", onKeyUp: (e) => {
                    if (e.key === 'Enter')
                        runSearch();
                } }),
            react_1.default.createElement("button", { className: "search-button", onClick: runSearch }, "Search")),
        noResults && (react_1.default.createElement("p", { className: "no-results-message" }, "Song or Artist not found. Please enter another selection.")),
        Array.isArray(results) && results.length > 0 && (react_1.default.createElement("div", { className: "results-wrapper" },
            react_1.default.createElement("ul", null, results.map((song) => (react_1.default.createElement("li", { key: song._id },
                react_1.default.createElement("div", { className: "song-card" },
                    react_1.default.createElement("div", { className: "song-info" },
                        react_1.default.createElement("h1", null, song.title),
                        react_1.default.createElement("h2", null, song.artist),
                        react_1.default.createElement("p", null, song.songLyrics)),
                    react_1.default.createElement("div", { className: "playlist-actions" },
                        react_1.default.createElement("input", { className: "search-input", value: playlistName, onChange: (e) => setPlaylistName(e.target.value), placeholder: "Enter playlist name", onKeyUp: (e) => {
                                if (e.key === 'Enter')
                                    handleSave(song);
                            } }),
                        react_1.default.createElement("button", { className: "search-button", onClick: () => handleSave(song) }, "Save")))))))))));
};
exports.default = SongSearch;
