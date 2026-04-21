import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.DEPLOY_BASE ?? '/pokemon-grapper/',
  plugins: [react(), tailwindcss()],
})
