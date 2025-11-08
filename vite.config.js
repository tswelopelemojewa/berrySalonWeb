import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
  },
  server: {
    historyApiFallback: true
  },
  // This helps with routing
  preview: {
    port: 4173,
    strictPort: true,
  }
}

)
