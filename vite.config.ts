import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: process.env.NODE_ENV === 'development' ? { port: 5173 } : undefined
});
