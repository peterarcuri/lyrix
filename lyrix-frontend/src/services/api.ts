import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const signup = (data: { email: string; password: string }) =>
  API.post('/auth/signup', data);
export const login = (data: { email: string; password: string }) =>
  API.post('/auth/login', data);

export const searchSongs = (query: string) =>
  API.get<{ data: Song[] }>(`/songs/lyrics?query=${query}`);

export interface Song {
  _id: string;
  title: string;
  artist: string;
  songLyrics: string;
}

export interface Playlist {
  name: string;
  songs: Song[];
}
