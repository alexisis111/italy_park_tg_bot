import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Установите порт Vite
  },
  proxy: {
    '/api': {
      target: 'http://localhost:3001', // Перенаправление запросов к вашему Express серверу
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
});
