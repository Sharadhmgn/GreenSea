const http = require('http');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', message: 'Test server is running!' }));
});

// Listen on port 3333 and all interfaces
server.listen(3333, '0.0.0.0', () => {
  console.log('Test server running on http://localhost:3333');
});

// Log any errors
server.on('error', (err) => {
  console.error('Server error:', err);
}); 