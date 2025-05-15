import { Playlist } from '../types';
import { v4 as uuidv4 } from "uuid";

/**
 * Get playlists from localStorage
 */
export const getPlaylists = (): Playlist[] => {
  try {
    const playlists = localStorage.getItem('lyrix_playlists');
    if (!playlists) return [];
    return JSON.parse(playlists);
  } catch (error) {
    console.error('Error getting playlists from localStorage:', error);
    return [];
  }
};

/**
 * Save playlists to localStorage
 */
export const savePlaylists = (playlists: Playlist[]): void => {
  try {
    localStorage.setItem('lyrix_playlists', JSON.stringify(playlists));
    console.log('✅ Playlists saved to localStorage:', playlists);
  } catch (error) {
    console.error('Error saving playlists to localStorage:', error);
  }
};

/**
 * Add a new playlist
 */
export const addPlaylist = (name: string): Playlist[] => {
  const playlists = getPlaylists();
  
  // Check if playlist with this name already exists
  if (playlists.some(p => p.name === name)) {
    console.warn(`Playlist "${name}" already exists`);
    return playlists;
  }
  
  const newPlaylist: Playlist = {
    name,
    songs: [],
  };
  
  const updatedPlaylists = [...playlists, newPlaylist];
  savePlaylists(updatedPlaylists);
  return updatedPlaylists;
};

/**
 * Add a song to a playlist
 */
export const addSongToPlaylist = (
  playlistName: string,
  song: { _id: string; title: string; artist: string; songLyrics: string; }
): Playlist[] => {
  const playlists = getPlaylists();
  const playlistIndex = playlists.findIndex(p => p.name === playlistName);
  
  if (playlistIndex === -1) {
    console.error(`Playlist "${playlistName}" not found`);
    return playlists;
  }
  
  // Check if song already exists in playlist
  const songExists = playlists[playlistIndex].songs.some(s => s._id === song._id);
  
  if (songExists) {
    console.warn(`Song "${song.title}" already exists in playlist "${playlistName}"`);
    return playlists;
  }
  
  // Ensure song has a valid _id (use _id consistently, not id)
  const songWithId = {
    ...song,
    _id: song._id || uuidv4(),  // Use _id consistently
  };
  
  const updatedPlaylist = {
    ...playlists[playlistIndex],
    songs: [...playlists[playlistIndex].songs, songWithId],
  };
  
  const updatedPlaylists = [
    ...playlists.slice(0, playlistIndex),
    updatedPlaylist,
    ...playlists.slice(playlistIndex + 1),
  ];
  
  savePlaylists(updatedPlaylists);
  return updatedPlaylists;
};

/**
 * Remove a song from a playlist
 */
export const removeSongFromPlaylist = (playlistName: string, songId: string): Playlist[] => {
  const playlists = getPlaylists();
  const playlistIndex = playlists.findIndex(p => p.name === playlistName);
  
  if (playlistIndex === -1) {
    console.warn(`Playlist "${playlistName}" not found`);
    return playlists;
  }
  
  const updatedPlaylist = {
    ...playlists[playlistIndex],
    songs: playlists[playlistIndex].songs.filter(s => s._id !== songId),
  };
  
  const updatedPlaylists = [
    ...playlists.slice(0, playlistIndex),
    updatedPlaylist,
    ...playlists.slice(playlistIndex + 1),
  ];
  
  savePlaylists(updatedPlaylists);
  return updatedPlaylists;
};

/**
 * Remove an entire playlist
 */
export const removePlaylist = (playlistName: string): Playlist[] => {
  const playlists = getPlaylists();
  const updatedPlaylists = playlists.filter(p => p.name !== playlistName);
  savePlaylists(updatedPlaylists);
  return updatedPlaylists;
};
