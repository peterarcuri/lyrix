import React, { useState } from 'react';
import {
  getPlaylists,
  removeSongFromPlaylist,
  removePlaylist,
  savePlaylists,
} from '../utils/playlistStorage';
import { Playlist } from '../types';

export const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(getPlaylists());
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );

  const handleRemove = (playlistName: string, songId: string) => {
    removeSongFromPlaylist(playlistName, songId);
    const updated = getPlaylists();
    setPlaylists(updated);
    if (selectedPlaylist) {
      const selected = updated.find((p) => p.name === playlistName) || null;
      setSelectedPlaylist(selected);
    }
  };

  const handleRemovePlaylist = (playlistName: string) => {
    removePlaylist(playlistName);
    const updated = getPlaylists();
    setPlaylists(updated);
    setSelectedPlaylist(null);
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    if (!selectedPlaylist) return;

    const updatedSongs = [...selectedPlaylist.songs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= updatedSongs.length) return;

    [updatedSongs[index], updatedSongs[targetIndex]] = [
      updatedSongs[targetIndex],
      updatedSongs[index],
    ];

    const updatedPlaylist: Playlist = {
      ...selectedPlaylist,
      songs: updatedSongs,
    };

    const updatedPlaylists = playlists.map((p) =>
      p.name === selectedPlaylist.name ? updatedPlaylist : p
    );

    savePlaylists(updatedPlaylists);
    setPlaylists(updatedPlaylists);
    setSelectedPlaylist(updatedPlaylist);
  };

  if (selectedPlaylist) {
    return (
      <div className="playlist-container">
        <button
          onClick={() => setSelectedPlaylist(null)}
          className="back-button"
        >
          ← Back to Playlists
        </button>

        <div className="playlist-detail">
          <div className="playlist-header">
            <h3 className="playlist-name">{selectedPlaylist.name}</h3>
            <button
              onClick={() => handleRemovePlaylist(selectedPlaylist.name)}
              className="remove-playlist-button"
            >
              Remove Playlist
            </button>
          </div>
          <ul className="song-list">
            {selectedPlaylist.songs.map((song, index) => (
              <li key={song._id} className="song-item">
                <div className="song-controls">
                  <h4 className="playlist-songtitle-artist">
                    {song.title} - {song.artist}
                  </h4>
                  <div className="song-buttons">
                    <button
                      onClick={() => moveSong(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSong(index, 'down')}
                      disabled={index === selectedPlaylist.songs.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() =>
                        handleRemove(selectedPlaylist.name, song._id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <pre className="song-lyrics">{song.songLyrics}</pre>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-container">
      <h2 className="playlist-title">Your Playlists</h2>
      <ul className="playlist-list">
        {playlists.map((p) => (
          <li key={p.name}>
            <button
              onClick={() => setSelectedPlaylist(p)}
              className="playlist-button"
            >
              {p.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


