import { AuthenticatedRequest } from '../types';
import { Response } from 'express';
import Playlist from '../models/Playlist';

export async function saveUserPlaylists(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const playlists = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    console.log('Received playlists for user', userId, playlists);  

    if (!Array.isArray(playlists)) {
      return res.status(400).json({ message: 'Expected an array of playlists' });
    }

    // Remove existing playlists for this user
    await Playlist.deleteMany({ userId });

    // Save new playlists
    const saved = await Playlist.insertMany(
      playlists.map((p: any) => ({
        ...p,
        userId,
      }))
    );

    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving playlists:', err);
    res.status(500).json({ message: 'Failed to save playlists' });
  }
}

export async function getUserPlaylists(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const playlists = await Playlist.find({ userId });

    res.status(200).json(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
}