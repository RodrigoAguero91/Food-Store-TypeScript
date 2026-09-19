import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: './index.html', 
        authRegistro: './src/pages/auth/registro/index.html',
        authLogin: './src/pages/auth/login/index.html',
        clientHome: './src/pages/client/home/home.html',
        clientCart: './src/pages/client/cart/cart.html',
      },
    },
  },
  base: './',
});