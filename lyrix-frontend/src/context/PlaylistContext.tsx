import React, { createContext, useContext, useState, useEffect } from 'react';
import { Playlist } from '../types';
import { getPlaylists, savePlaylists } from '../utils/playlistStorage';

interface PlaylistContextType {
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylistsState] = useState<Playlist[]>(getPlaylists());

  const setPlaylists = (newPlaylists: Playlist[]) => {
    savePlaylists(newPlaylists);
    setPlaylistsState(newPlaylists);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, setPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error('usePlaylist must be used within a PlaylistProvider');
  return ctx;
};
