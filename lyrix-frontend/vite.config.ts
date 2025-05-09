import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ Serve assets relative to site root
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
