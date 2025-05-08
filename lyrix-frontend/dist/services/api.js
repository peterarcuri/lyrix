import axios from 'axios';
const isDev = import.meta.env.DEV;
const API = axios.create({
    baseURL: isDev
        ? '/api/v1' // Will be proxied to localhost:5000 by Vite dev server
        : 'https://lyrix.onrender.com/api/v1', // Direct link in production
});
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const searchSongs = (query) => API.get(`/songs/lyrics?query=${query}`);
