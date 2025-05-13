import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  _id: String,
  title: String,
  artist: String,
  songLyrics: String,
});

const playlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  songs: [songSchema],
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;
