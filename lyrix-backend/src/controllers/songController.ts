// songController.ts
import { Request, Response } from 'express';
import Song from '../models/song';

export const getLyrics = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    let songs;
    if (query) {
      // Case-insensitive search for title or artist
      songs = await Song.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { artist: { $regex: query, $options: 'i' } },
        ],
      });
    } else {
      songs = await Song.find();
    }

    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching songs' });
  }
};