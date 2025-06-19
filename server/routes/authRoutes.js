const express = require('express');
const router = express.Router();

// Middleware to log all auth requests
router.use((req, res, next) => {
  console.log(`Auth Route: ${req.method} ${req.path}`);
  next();
});

// Test route for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working'
  });
});

// Google OAuth login
router.get('/google', (req, res) => {
  res.json({
    success: true,
    message: 'Google authentication is available through the frontend Supabase client'
  });
});

// Default route
router.use('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth endpoint reached. Authentication is handled through the frontend Supabase client.'
  });
});

console.log('Auth routes module loaded successfully');

module.exports = router; 