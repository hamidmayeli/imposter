import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import yaml2 from 'vite-plugin-yaml2';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    yaml2(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'imposter',
        short_name: 'Imposter',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        description: 'A spy party game for friends.',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
