import express from 'express';
import { protect } from '../middleware/auth';
import {
  getUserPlaylists,
  saveUserPlaylists,
  clearUserPlaylists
} from '../controllers/playlistController';

const router = express.Router();

router.get('/', protect, getUserPlaylists);
router.post('/', protect, saveUserPlaylists);
router.post('/clear', protect, clearUserPlaylists);

export default router;