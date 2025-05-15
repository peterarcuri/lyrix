import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Update path if needed
import { Playlist } from '../types';

const Playlists: React.FC = () => {
  const { playlists, setPlaylists } = useAuth();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Debug log when component mounts or playlists change
  useEffect(() => {
    console.log('🎵 Playlists component - current playlists:', playlists);
  }, [playlists]);

  // If playlists is null, use an empty array
  const playlistsData = playlists || [];

  const handleRemove = (playlistName: string, songId: string) => {
    if (!playlistsData) return;
    console.log(`🗑️ Removing song ${songId} from playlist ${playlistName}`);
    
    // Find the playlist
    const playlist = playlistsData.find(p => p.name === playlistName);
    if (!playlist) return;
    
    // Remove the song
    const updatedPlaylist = {
      ...playlist,
      songs: playlist.songs.filter(song => song._id !== songId)
    };
    
    // Update playlists
    const updatedPlaylists = playlistsData.map(p => 
      p.name === playlistName ? updatedPlaylist : p
    );
    
    console.log('📝 Updated playlists after song removal:', updatedPlaylists);
    
    // Update context (and localStorage)
    setPlaylists(updatedPlaylists);
    
    // Update selected playlist if needed
    if (selectedPlaylist && selectedPlaylist.name === playlistName) {
      setSelectedPlaylist(updatedPlaylist);
    }
  };

  const handleRemovePlaylist = (playlistName: string) => {
    if (!playlistsData) return;
    console.log(`🗑️ Removing entire playlist: ${playlistName}`);
    
    // Filter out the playlist
    const updatedPlaylists = playlistsData.filter(p => p.name !== playlistName);
    
    console.log('📝 Updated playlists after playlist removal:', updatedPlaylists);
    
    // Update context (and localStorage)
    setPlaylists(updatedPlaylists);
    setSelectedPlaylist(null);
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    if (!selectedPlaylist || !playlistsData) return;
    console.log(`🔄 Moving song at index ${index} ${direction}`);

    const updatedSongs = [...selectedPlaylist.songs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= updatedSongs.length) return;

    // Swap songs
    [updatedSongs[index], updatedSongs[targetIndex]] = [
      updatedSongs[targetIndex],
      updatedSongs[index],
    ];

    const updatedPlaylist: Playlist = {
      ...selectedPlaylist,
      songs: updatedSongs,
    };

    const updatedPlaylists = playlistsData.map((p) =>
      p.name === selectedPlaylist.name ? updatedPlaylist : p
    );

    console.log('📝 Updated playlists after song reordering:', updatedPlaylists);
    
    // Update context (and localStorage)
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
            {selectedPlaylist.songs.length > 0 ? (
              selectedPlaylist.songs.map((song, index) => (
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
        {playlistsData.length > 0 ? (
          playlistsData.map((p) => (
            <li key={p.name}>
              <button
                onClick={() => setSelectedPlaylist(p)}
                className="playlist-button"
              >
                {p.name} ({p.songs?.length || 0} songs)
              </button>
            </li>
          ))
        ) : (
          <li>No playlists found</li>
        )}
      </ul>

    </div>
  );
};

export default Playlists;