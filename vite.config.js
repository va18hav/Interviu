import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('microsoft-cognitiveservices') || id.includes('azure')) {
              return 'azure-sdk';
            }
            if (id.includes('pdfjs-dist')) {
              return 'pdfjs';
            }
            if (id.includes('three') || id.includes('fiber')) {
              return 'threejs';
            }
            return 'vendor'; // everything else into a generic vendor chunk
          }
        }
      }
    }
  }
})
