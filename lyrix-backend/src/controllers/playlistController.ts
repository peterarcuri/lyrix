import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import Playlist from '../models/Playlist';

export async function getUserPlaylists(req: AuthenticatedRequest, res: Response) {
  try {
    console.log('Fetching playlists for user:', req.userId);
    const playlists = await Playlist.find({ userId: req.userId });
    res.json(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
}

export async function saveUserPlaylists(req: AuthenticatedRequest, res: Response) {

  const userId = req.userId;
  const playlists = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  console.log('Received playlists for user', userId, playlists);  

  if (!Array.isArray(playlists)) {
    return res.status(400).json({ message: 'Expected an array of playlists' });
  }

  try {

    // Remove existing playlists for this user
    await Playlist.deleteMany({ userId });

    // Add userId to each playlist
    const playlistsToSave = playlists.map((p) => ({
      userId,
      name: p.name,
      songs: p.songs,    
    }));

    await Playlist.insertMany(playlistsToSave);

    return res.status(200).json({ message: 'Playlists saved successfully'  });

  } catch (err) {
    console.error('Error saving playlists:', err);
    res.status(500).json({ message: 'Failed to save playlists' });
  }
}