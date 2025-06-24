import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  esbuild: {
    sourcemap: true,
  },
  server: {
    hmr: true,
  },
});