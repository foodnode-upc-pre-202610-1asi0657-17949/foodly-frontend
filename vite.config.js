import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['frontend', 'localhost'],
    proxy: {
      '/identity-api': {
        target: 'http://10.0.2.3:8080',
        changeOrigin: true
      },
      '/business-api': {
        target: 'http://10.0.2.3:8080',
        changeOrigin: true
      },
      '/community-api': {
        target: 'http://10.0.2.3:8080',
        changeOrigin: true
      },
      '/radar-api': {
        target: 'http://10.0.2.3:8080',
        changeOrigin: true
      }
    }
  }
})
