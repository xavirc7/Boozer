import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = process.env.API_PROXY_TARGET || 'http://127.0.0.1:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: process.env.BOOZER_DOCKER_POLLING === 'true',
    },
    // Match the routes provided by Nginx in the production container.
    proxy: {
      '/api/': {
        target: apiTarget,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/docs': apiTarget,
      '/openapi.json': apiTarget,
    },
  },
})
