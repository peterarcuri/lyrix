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

    const savedPlaylists = [];

    for (const playlist of playlists) {
      if (playlist._id) {
        // If playlist has an _id, update it
        const updatedPlaylist = await Playlist.findOneAndUpdate(
          { _id: playlist._id, userId },
          { ...playlist, userId },
          { new: true, upsert: true }
        );
        savedPlaylists.push(updatedPlaylist);
      } else {
        // If playlist doesn't have an _id, create a new one
        const newPlaylist = new Playlist({ ...playlist, userId });
        const savedPlaylist = await newPlaylist.save();
        savedPlaylists.push(savedPlaylist);
      }
    }

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

    const playlists = await Playlist.find({ userId });

    console.log('Found playlists:', playlists);

    res.status(200).json(playlists);
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
}