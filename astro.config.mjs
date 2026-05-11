import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    clerk(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server', // Required for Clerk and dynamic features
});
