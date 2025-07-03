import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import * as fs from 'fs';
import * as path from 'path';

// Read the mock data from db.json
const dbPath = path.resolve(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

export default defineConfig({
  plugins: [
    react(),
    // Disabled mock API - now using real backend
    // {
    //   name: 'mock-api',
    //   configureServer(server) {
    //     // Mock API routes disabled - using real backend at localhost:8082
    //   }
    // }
  ],
  server: {
    proxy: {
      // Proxy API requests to the backend during development
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url, '-> http://localhost:8082');
          });
        },
      },
    },
  },
});
