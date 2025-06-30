import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: process.env.NODE_ENV === 'development' ? { host: 'localhost', port: 5173 } : undefined,
  preview: {
    allowedHosts: ['body-tracker-ocjq.onrender.com']
  }
});
