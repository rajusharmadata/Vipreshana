const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  googleLogin, 
  logoutUser, 
  resetPassword, 
  getCurrentUser 
} = require('../controllers/authController');

// Middleware to log all auth requests
router.use((req, res, next) => {
  console.log(`Auth Route: ${req.method} ${req.path}`, {
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});

// Register user
router.post('/register', (req, res, next) => {
  console.log('Hit register route');
  registerUser(req, res).catch(next);
});

// Login user
router.post('/login', (req, res, next) => {
  console.log('Hit login route');
  loginUser(req, res).catch(next);
});

// Google OAuth login
router.get('/google', (req, res, next) => {
  console.log('Hit Google login route');
  googleLogin(req, res).catch(next);
});

// Logout user
router.post('/logout', (req, res, next) => {
  console.log('Hit logout route');
  logoutUser(req, res).catch(next);
});

// Reset password
router.post('/reset-password', (req, res, next) => {
  console.log('Hit reset password route');
  resetPassword(req, res).catch(next);
});

// Get current user
router.get('/me', (req, res, next) => {
  console.log('Hit get current user route');
  getCurrentUser(req, res).catch(next);
});

// Test route for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working',
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/google',
      'POST /api/auth/logout',
      'POST /api/auth/reset-password',
      'GET /api/auth/me'
    ]
  });
});

// Handle unknown routes within /api/auth
router.use('/', (req, res, next) => {
  // Only handle 404s after other routes have been tried
  if (!res.headersSent) {
    console.log(`Unknown Auth route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      success: false,
      message: `Auth route not found: ${req.method} ${req.originalUrl}`,
      availableRoutes: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/google',
        'POST /api/auth/logout',
        'POST /api/auth/reset-password',
        'GET /api/auth/me',
        'GET /api/auth/test'
      ]
    });
  }
});

console.log('Auth routes module loaded successfully');

module.exports = router; 