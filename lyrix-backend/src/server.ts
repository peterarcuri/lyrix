import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';  
import authRoutes from './routes/authRoutes';
import songRoutes from './routes/songRoutes';
import playlistRoutes from './routes/playlistRoutes';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['https://lyrix-one.vercel.app'];

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ... rest of your code remains the same