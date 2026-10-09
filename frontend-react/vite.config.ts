import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./cert/localhost-key.pem'),
      cert: fs.readFileSync('./cert/localhost.pem'),
    },
    host: true,
  },
})