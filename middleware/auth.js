// middleware/auth.js - Authentication middleware

const { AuthenticationError } = require('../utils/errors');

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  if (!apiKey) {
    throw new AuthenticationError('API key is required. Please provide it in the x-api-key header or Authorization header.');
  }
  
  // Simple API key validation (in production, this would be more sophisticated)
  const validApiKey = process.env.API_KEY || 'your-secret-api-key-123';
  
  // Handle both "Bearer token" and direct key formats
  const key = apiKey.startsWith('Bearer ') ? apiKey.slice(7) : apiKey;
  
  if (key !== validApiKey) {
    throw new AuthenticationError('Invalid API key provided.');
  }
  
  // Add user info to request if needed
  req.authenticated = true;
  next();
};

module.exports = { authMiddleware };
