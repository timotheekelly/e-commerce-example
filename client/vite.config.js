import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Spring Boot backend does not configure CORS, so in dev we proxy /api to it.
// Override the target with: BACKEND_URL=http://host:port npm run dev
const backend = process.env.BACKEND_URL || 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': { target: backend, changeOrigin: true } },
  },
})
