import React, { useEffect, useState } from 'react';
import { searchSongs } from '../../src/services/api';
import { addSongToPlaylist } from '../../src/utils/playlistStorage';
import { Song } from '../../src/types';

interface SongSearchProps {
  handleSearch?: (query: string) => void;
  searchResults?: Song[];
}

  const SongSearch: React.FC<SongSearchProps> = ({ searchResults }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Song[]>([]);
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
      } else {
        setNoResults(false);
      }
  
      setResults(songs);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
      setNoResults(true);
    }
  };
  
  const handleSave = (song: Song) => {
    if (!playlistName) return alert('Enter a playlist name first');
    addSongToPlaylist(playlistName, song);
    alert(`Saved to "${playlistName}"`);
  };

  return (
    <div className="song-search-container">
      <div className="search-bar">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or artist"
          onKeyUp={(e) => {
            if (e.key === 'Enter') runSearch();
          }}
        />
        <button className="search-button" onClick={runSearch}>
          Search
        </button>
      </div>

      {noResults && (
        <p className="no-results-message">
          Song or Artist not found. Please enter another selection.
        </p>
      )}

      {Array.isArray(results) && results.length > 0 && (
        <div className="results-wrapper">
          <ul>
            {results.map((song) => (
              <li key={song._id}>
                <div className="song-card">
                  <div className="song-info">
                    <h1>{song.title}</h1>
                    <h2>{song.artist}</h2>
                    <p>{song.songLyrics}</p>
                  </div>

                  <div className="playlist-actions">
                    <input
                      className="search-input"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder="Enter playlist name"
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') handleSave(song);
                      }}
                    />
                    <button
                      className="search-button"
                      onClick={() => handleSave(song)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SongSearch;
