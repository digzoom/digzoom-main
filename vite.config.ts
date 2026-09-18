import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('@trpc') || id.includes('@tanstack')) return 'vendor-data';
          if (id.includes('react')) return 'vendor-react';
          if (id.includes('recharts')) return 'vendor-charts';
          if (id.includes('@radix-ui') || id.includes('lucide-react')) return 'vendor-ui';
          return;
        },
      },
    },
  },
});
