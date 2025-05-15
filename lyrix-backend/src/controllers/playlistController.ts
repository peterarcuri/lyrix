import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import Playlist from '../models/Playlist';
import mongoose from 'mongoose';

export async function getUserPlaylists(req: AuthenticatedRequest, res: Response) {
  try {
    console.log('🔍 Fetching playlists for user:', req.userId);
    const playlists = await Playlist.find({ userId: req.userId });
    console.log('📋 Found playlists:', playlists);
    res.json(playlists);
  } catch (err) {
    console.error('❌ Error fetching playlists:', err);
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
}

export async function saveUserPlaylists(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const playlists = req.body;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    
    console.log('📥 Received playlists for user', userId);
    console.log('📦 Playlists count:', Array.isArray(playlists) ? playlists.length : 'not an array');
    
    if (!Array.isArray(playlists)) {
      console.error('❌ Expected an array but got:', typeof playlists);
      return res.status(400).json({ message: 'Expected an array of playlists' });
    }
    
    // Remove existing playlists for this user
    const deleteResult = await Playlist.deleteMany({ userId });
    console.log('🗑️ Deleted existing playlists:', deleteResult);
    
    // If array is empty, just return success without inserting
    if (playlists.length === 0) {
      console.log('⚠️ No playlists to save for user', userId);
      return res.status(200).json({ message: 'No playlists to save' });
    }
    
    // Ensure each playlist has a valid MongoDB ObjectId
    const playlistsWithUserId = playlists.map((p: any) => {
      // Remove any existing _id to let MongoDB generate new ones to avoid conflicts
      const { _id, ...playlistWithoutId } = p;
      
      return {
        ...playlistWithoutId,
        userId,
        // Ensure songs have valid IDs too if they exist
        songs: Array.isArray(p.songs) 
          ? p.songs.map((song: any) => {
              // If song has an _id that's not a valid ObjectId, generate a new one
              const songId = song._id && mongoose.isValidObjectId(song._id) 
                ? song._id 
                : new mongoose.Types.ObjectId().toString();
              
              return { ...song, _id: songId };
            })
          : []
      };
    });
    
    console.log('💾 Saving playlists for user', userId);
    const saved = await Playlist.insertMany(playlistsWithUserId);
    console.log('✅ Saved playlists count:', saved.length);
    
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error saving playlists:', err);
    res.status(500).json({ message: 'Failed to save playlists' });
  }
}
