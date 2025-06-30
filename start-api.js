// Simple script to start JSON Server with the correct configuration
import jsonServer from 'json-server';
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add body parsing middleware to ensure JSON is properly parsed
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
server.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', uptime: '12h 30m' });
});

// Add header middleware to check provider ID and debug request data
server.use((req, res, next) => {
  const providerId = req.headers['x-provider-id'];
  
  // Debug logging for enrollment requests
  if (req.method === 'POST' && req.url.includes('/enrollments')) {
    console.log('\n=== ENROLLMENT CREATE DEBUG ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Raw Body:', JSON.stringify(req.body, null, 2));
    console.log('================================\n');
  }
  
  if (!providerId) {
    console.log('Missing provider ID header');
    // Still allow the request to pass through for testing
  } else {
    console.log(`Provider ID: ${providerId}`);
  }
  next();
});

// Remove the rewriter - it's causing issues with the API endpoints
// The router is mounted on /api so rewriting is not needed

server.use('/api/statistics', (req, res) => {
  res.json({
    provider_id: "12345678-1234-5678-1234-567812345678",
    total_activities: 2,
    total_participants: 2,
    total_enrollments: 2,
    total_leads: 2
  });
});

// Use default router
server.use('/api', router);

const port = 8083;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api`);
}); 