import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,      // Enables listening on 0.0.0.0
    port: 5173,      // Ensures it binds to the correct port
    strictPort: true // Prevents port fallback if 5173 is taken
  }
})
