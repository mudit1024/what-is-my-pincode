import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 127.0.0.1 (not localhost): sign-in redirect URLs must use the IP for local development (OAuth 2.1)
    host: '127.0.0.1',
    // 5175: 5173 is SplitMate, 5174 CodeQuror, 5170 AuthReflector's dev UI
    port: 5175,
    strictPort: true,
  },
})
