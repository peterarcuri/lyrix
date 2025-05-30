import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getPlaylists,
  removeSongFromPlaylist,
  removePlaylist,
  savePlaylists,
} from '../../src/utils/playlistStorage';

interface Song {
  _id: string;
  title: string;
  artist: string;
  songLyrics: string;
}

interface Playlist {
  name: string;
  songs: Song[];
}

const Playlists: React.FC = () => {
  const { playlists, setPlaylists } = useAuth();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // If playlists is null, use an empty array
  const playlistsData = playlists || [];

  const handleRemove = (playlistName: string, songId: string) => {
    if (!playlistsData) return;
    
    const updatedPlaylists = playlistsData.map(p => 
      p.name === playlistName 
        ? { ...p, songs: p.songs.filter(s => s._id !== songId) }
        : p
    );

    setPlaylists(updatedPlaylists);
    if (selectedPlaylist) {
      const selected = updatedPlaylists.find((p) => p.name === playlistName) || null;
      setSelectedPlaylist(selected);
    }
  };

  const handleRemovePlaylist = (playlistName: string) => {
    if (!playlistsData) return;
    
    const updatedPlaylists = playlistsData.filter(p => p.name !== playlistName);
    setPlaylists(updatedPlaylists);
    setSelectedPlaylist(null);
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    if (!selectedPlaylist || !playlistsData) return;

    const updatedSongs = [...selectedPlaylist.songs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= updatedSongs.length) return;

    const temp = updatedSongs[index];
    updatedSongs[index] = updatedSongs[targetIndex];
    updatedSongs[targetIndex] = temp;

    const updatedPlaylist = { ...selectedPlaylist, songs: updatedSongs };
    const updatedPlaylists = playlistsData.map((p) =>
      p.name === selectedPlaylist.name ? updatedPlaylist : p
    );

    setPlaylists(updatedPlaylists);
    setSelectedPlaylist(updatedPlaylist);
  };

  if (!playlists) {
    return (
      <div className="playlist-container">
        <h2 className="playlist-title">No Playlists Available</h2>
      </div>
    );
  }

  if (selectedPlaylist) {
    return (
      <div className="playlist-container">
        <div className="playlist-header">
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="back-button"
          >
            Back to Playlists
          </button>
          <h2>{selectedPlaylist.name}</h2>
          <button
            onClick={() => handleRemovePlaylist(selectedPlaylist.name)}
            className="remove-playlist-button"
          >
            Remove Playlist
          </button>
        </div>

        <div className="playlist-songs">
          <h3>Songs</h3>
          <ul className="song-list">
            {selectedPlaylist.songs.length > 0 ? (
              selectedPlaylist.songs.map((song) => (
                <li key={song._id} className="song-item">
                  <div className="song-header">
                    <h4>{song.title}</h4>
                    <p className="artist">{song.artist}</p>
                    <button
                      onClick={() =>
                        handleRemove(selectedPlaylist.name, song._id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <pre className="song-lyrics">{song.songLyrics}</pre>
                </li>
              ))
            ) : (
              <li>No songs in this playlist</li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-container">
      <h2 className="playlist-title">Your Playlists</h2>
      <ul className="playlist-list">
        {playlistsData.map((p) => (
          <li key={p.name}>
            <button
              onClick={() => setSelectedPlaylist(p)}
              className="playlist-button"
            >
              {p.name}
            </button>
            <button
              onClick={() => handleRemovePlaylist(p.name)}
              className="remove-playlist-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {selectedPlaylist && (
        <div className="selected-playlist">
          <h3>{selectedPlaylist.name}</h3>
          <ul>
            {selectedPlaylist.songs.map((song, index) => (
              <li key={song._id}>
                <div className="song-info">
                  <span>{song.title} - {song.artist}</span>
                  <div className="song-controls">
                    <button onClick={() => moveSong(index, 'up')} disabled={index === 0}>
                      ↑
                    </button>
                    <button 
                      onClick={() => moveSong(index, 'down')} 
                      disabled={index === selectedPlaylist.songs.length - 1}
                    >
                      ↓
                    </button>
                    <button onClick={() => handleRemove(selectedPlaylist.name, song._id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <pre className="song-lyrics">{song.songLyrics}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Playlists;