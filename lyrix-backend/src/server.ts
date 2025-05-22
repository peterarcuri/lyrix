
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

const allowedOrigins = ['https://lyrix-one.vercel.app'];

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




app.get('/', (req, res) => {
  res.send('Lyrix backend says hello! 😁');
})

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/songs', songRoutes);
app.use('/api/v1/playlists', playlistRoutes);




mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;
