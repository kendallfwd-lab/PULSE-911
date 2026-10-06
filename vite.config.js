import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { demoDatabasePlugin } from './scripts/demoDatabasePlugin.js'

export default defineConfig({
  plugins: [react(), demoDatabasePlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
  server: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
    watch: {
      ignored: ['**/db.json'],
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
})
