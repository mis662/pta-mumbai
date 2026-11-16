import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // "/" for ptamumbai.com; "/pta-mumbai/" while the site lives at mis662.github.io/pta-mumbai/
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
});
