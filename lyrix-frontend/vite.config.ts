import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://lyrix.onrender.com//api/v1',
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});