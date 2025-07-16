 const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');
dotenv.config();
// Using node-fetch v2 which supports CommonJS require()
const fetchPkg = require('node-fetch');
const fetch = fetchPkg.default || fetchPkg; // works for both node-fetch v2 (function) and v3 (ESM default)
const path = require('path');
const app = express();
const port = 3000;

// Enable gzip compression
app.use(compression());

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files like CSS, JS, images with proper headers
app.use(express.static(path.join(__dirname, '.'), {
  maxAge: '1y', // Cache static files for 1 year
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.gif') || path.endsWith('.svg')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy endpoint for /api/chat
app.post('/api/chat', async (req, res) => {
  const xaiApiKey = process.env.XAI_API_KEY || 'YOUR_FALLBACK_KEY';
  const xaiUrl = 'https://api.x.ai/v1/chat/completions';

  try {
    const response = await fetch(xaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${xaiApiKey}`
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      console.log(`xAI API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.log(errorBody);
      throw new Error(`xAI API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export the app for Vercel's serverless environment
module.exports = app; 