import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Zentro-logo.png'],
      manifest: {
        name: 'Zentro',
        short_name: 'Zentro',
        description: 'AI-Powered Blog Platform',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/feed',
        scope: '/',
        orientation: 'portrait-primary',
        categories: ['social', 'news'],
        icons: [
          {
            src: 'Zentro-logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'Zentro-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: '/offline',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/feed'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-feed-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/posts'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-posts-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'zentro-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true
      }
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          core: ['@reduxjs/toolkit', 'react-redux', 'axios'],
          form: ['react-hook-form', 'zod', '@hookform/resolvers'],
          socket: ['socket.io-client'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-avatar', 'lucide-react', 'framer-motion'],
          editor: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-link']
        }
      }
    }
  }
})
