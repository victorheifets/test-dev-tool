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
    {
      name: 'mock-api',
      configureServer(server) {
        // Add provider ID middleware
        server.middlewares.use((req, res, next) => {
          const providerId = req.headers['x-provider-id'];
          if (!providerId) {
            console.log('Missing provider ID header');
            // Still allow the request to pass through for testing
          } else {
            console.log(`Provider ID: ${providerId}`);
          }
          next();
        });

        // API routes
        server.middlewares.use('/api/health', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', version: '1.0.0', uptime: '12h 30m' }));
        });

        server.middlewares.use('/api/activities', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(db.activities));
        });

        server.middlewares.use('/api/participants', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(db.participants));
        });

        server.middlewares.use('/api/enrollments', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(db.enrollments));
        });

        server.middlewares.use('/api/marketing', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(db.marketing));
        });

        server.middlewares.use('/api/providers', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(db.providers));
        });

        server.middlewares.use('/api/statistics', (req, res) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(db.statistics));
        });
      }
    }
  ],
  server: {
    proxy: {
      // Proxy API requests to the backend during development
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
      },
    },
  },
});
