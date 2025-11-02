import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      // Enable Sass modern compiler API to silence legacy warnings
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
})
