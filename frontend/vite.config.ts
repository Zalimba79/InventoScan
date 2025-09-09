import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // https: true, // Temporarily disabled - use Cloudflare tunnel instead
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: 'inventoscan.mindbit.net'
    }
  }
})