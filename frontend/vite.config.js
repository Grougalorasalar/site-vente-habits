import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     output: {
  //       assetFileNames: (assetInfo) => {
  //         let extType = assetInfo.name.split('.').at(1);
  //         if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
  //           extType = 'img';
  //         }
  //         return `assets/${extType}/[name]-[hash][extname]`;
  //       },
  //       chunkFileNames: 'assets/js/[name]-[hash].js',
  //       entryFileNames: 'assets/js/[name]-[hash].js',
  //     },
  //   },
  // },
  base: './',
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/assets': 'http://localhost:5173/assets'
    }
  },
  plugins: [react()]
});
