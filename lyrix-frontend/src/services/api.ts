import axios from 'axios';

const isDev = import.meta.env.DEV;

const API = axios.create({
  baseURL: isDev
    ? '/api/v1' // Will be proxied to localhost:5000 by Vite dev server
    : 'https://lyrix.onrender.com/api/v1', // Direct link in production
    withCredentials: true,
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