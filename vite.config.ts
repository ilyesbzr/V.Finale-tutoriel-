import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['fsevents']
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'charts': ['recharts', 'react-circular-progressbar'],
          'ui': ['@headlessui/react', '@heroicons/react'],
          'utils': ['date-fns', 'i18next', 'react-i18next']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    fs: {
      strict: false
    },
    hmr: {
      overlay: false
    }
  },
  preview: {
    port: 3000,
    host: true
  }
})