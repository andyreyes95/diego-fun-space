import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/diego-fun-space/',
  plugins: [react()],
})
