import express from 'express';
import { protect } from '../middleware/auth';
import {
  getUserPlaylists,
  saveUserPlaylists
} from '../controllers/playlistController';

const router = express.Router();

router.get('/', protect, getUserPlaylists);
router.post('/', protect, saveUserPlaylists);

export default router;