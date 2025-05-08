import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';  
import authRoutes from './routes/authRoutes';
import songRoutes from './routes/songRoutes';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI is not defined');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Lyrix backend says hello! 😁');
})

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/songs', songRoutes);



mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;
