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

export default Playlists;