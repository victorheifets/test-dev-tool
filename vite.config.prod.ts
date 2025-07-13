import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          refine: ['@refinedev/core', '@refinedev/mui']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.VITE_API_URL': '"https://im7swzql6i.execute-api.eu-west-1.amazonaws.com/prod"'
  },
  base: '/',
  server: {
    port: 3000
  }
});