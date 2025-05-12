import { Request, Response } from 'express';
import Playlist from '../models/Playlist';

// GET /api/playlists
export async function getUserPlaylists(req: Request, res: Response) {
  const playlists = await Playlist.find({ userId: req.userId });
  res.json(playlists);
}

// POST /api/playlists
export async function saveUserPlaylists(req: Request, res: Response) {
  const userId = req.userId;
  const playlists = req.body;

  // Remove old playlists for the user
  await Playlist.deleteMany({ userId });

  // Save new ones
  const saved = await Playlist.insertMany(
    playlists.map((p: any) => ({
      ...p,
      userId,
    }))
  );

  res.status(201).json(saved);
}
