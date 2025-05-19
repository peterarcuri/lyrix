import { AuthenticatedRequest } from '../types';
import { Response } from 'express';
import Playlist from '../models/Playlist';

export async function saveUserPlaylists(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const playlists = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    console.log('Saving playlists for user', userId);
    console.log('Received playlists:', JSON.stringify(playlists, null, 2));

    if (!Array.isArray(playlists)) {
      return res.status(400).json({ message: 'Expected an array of playlists' });
    }

    // Remove all existing playlists for this user
    await Playlist.deleteMany({ userId });

    // Sanitize and bulk-insert new playlists
    const sanitizedPlaylists = playlists.map(({ _id, ...rest }) => ({
      ...rest,
      userId,
    }));

    const savedPlaylists = await Playlist.insertMany(sanitizedPlaylists);

    console.log('Saved playlists:', JSON.stringify(savedPlaylists, null, 2));

    res.status(201).json(savedPlaylists);
  } catch (err) {
    console.error('Error saving playlists:', err);
    res.status(500).json({ message: 'Failed to save playlists' });
  }
}


export async function getUserPlaylists(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    console.log('Fetching playlists for userId:', userId);

    const playlists = await Playlist.find({ userId }).lean();

    console.log('Found playlists:', JSON.stringify(playlists, null, 2));

    res.status(200).json(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
}