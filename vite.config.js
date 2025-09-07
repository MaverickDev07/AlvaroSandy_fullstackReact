import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AlvaroSandy_fullstackReact/',
  build: {
    outDir: 'docs', // importante para usar main/docs en GitHub Pages
  },
})
