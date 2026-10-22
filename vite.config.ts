import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative paths so the build works at any sub-path, e.g. GitHub Pages' /screenScope/
  base: './',
  plugins: [react(), tailwindcss()],
})
