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
         
        </div>

        <div className="playlist-songs">
        <h2>{selectedPlaylist.name}</h2>
          <ul className="song-list">
            {selectedPlaylist.songs.length > 0 ? (
              selectedPlaylist.songs.map((song, index) => (
                <li key={song._id} className="song-item">
                  <div className="song-header">
                    <h4>{song.title}</h4>
                    <p className="artist">{song.artist}</p>
                    <div className="song-controls">
                      {index > 0 && (
                        <button onClick={() => moveSong(index, 'up')}>&uarr;</button>
                      )}
                      {index < selectedPlaylist.songs.length - 1 && (
                        <button onClick={() => moveSong(index, 'down')}>&darr;</button>
                      )}
                      <button
                        onClick={() => handleRemove(selectedPlaylist.name, song._id)}
                        className="remove-song-button"
                      >
                        Remove
                      </button>
                    </div>
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

  if (selectedPlaylist) {
    return (
      <div className="playlist-container">
        <div className="playlist-header">
          <h2>{selectedPlaylist.name}</h2>
          <button onClick={() => setSelectedPlaylist(null)}>Back to Playlists</button>
          <button onClick={() => handleRemovePlaylist(selectedPlaylist.name)}>Delete Playlist</button>
        </div>
        <ul>
          {selectedPlaylist.songs.map((song, index) => (
            <li key={song._id} className="song-item">
              <div className="song-header">
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
                <div className="song-controls">
                  {index > 0 && (
                    <button onClick={() => moveSong(index, 'up')}>&uarr;</button>
                  )}
                  {index < selectedPlaylist.songs.length - 1 && (
                    <button onClick={() => moveSong(index, 'down')}>&darr;</button>
                  )}
                  <button onClick={() => handleRemove(selectedPlaylist.name, song._id)}>Remove</button>
                </div>
              </div>
              <div className="song-lyrics">{song.songLyrics}</div>
            </li>
          ))}
        </ul>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlists;