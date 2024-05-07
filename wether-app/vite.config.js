import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/accuweather': {
        target: 'http://dataservice.accuweather.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/accuweather/, '')
      }
    }
  }
})

