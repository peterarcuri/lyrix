import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    lyrics: { type: String, required: true },
  },
  { collection: 'songlyrics' }
);

export default mongoose.model('Song', songSchema);
