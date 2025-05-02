import express from 'express';
import { getLyrics } from '../controllers/songController';

const router = express.Router();

// Just use the controller to handle the GET request
router.get('/lyrics', getLyrics);

export default router;
