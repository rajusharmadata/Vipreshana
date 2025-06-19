const express = require('express');
const router = express.Router();

// Import controller functions
const { sendOTP, verifyOTP, resendOTP } = require('../controllers/otpController');

// Middleware to log all OTP requests
router.use((req, res, next) => {
  console.log(`OTP Route: ${req.method} ${req.path}`, {
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});

// Send OTP
router.post('/send-otp', (req, res, next) => {
  console.log('Hit send-otp route');
  sendOTP(req, res).catch(next);
});

// Verify OTP
router.post('/verify-otp', (req, res, next) => {
  console.log('Hit verify-otp route');
  verifyOTP(req, res).catch(next);
});

// Resend OTP
router.post('/resend-otp', (req, res, next) => {
  console.log('Hit resend-otp route');
  resendOTP(req, res).catch(next);
});

// Test route for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'OTP routes are working',
    availableRoutes: [
      'POST /api/otp/send-otp',
      'POST /api/otp/verify-otp',
      'POST /api/otp/resend-otp'
    ]
  });
});

// Handle unknown routes within /api/otp - FIX: changed from '*' to '/' with a 404 middleware
router.use('/', (req, res, next) => {
  // Only handle 404s after other routes have been tried
  if (!res.headersSent) {
    console.log(`Unknown OTP route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      success: false,
      message: `OTP route not found: ${req.method} ${req.originalUrl}`,
      availableRoutes: [
        'POST /api/otp/send-otp',
        'POST /api/otp/verify-otp',
        'POST /api/otp/resend-otp',
        'GET /api/otp/test'
      ]
    });
  }
});

console.log('OTP routes module loaded successfully');

module.exports = router;