const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const figlet = require('figlet');
require('dotenv').config();
const Configs = require('./configs/Configs');
const connectMongoDB = require('./Databases/ConnectDB');
const Controllers = require('./Controllers/index.controllers');
const { otpRateLimiter, otpVerificationRateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Allowed frontend origins
const allowedOrigins = ['https://vipreshana-2.vercel.app'];

// ✅ Secure CORS middleware setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB connection
connectMongoDB(Configs.DB_URI);

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✨ MongoDB connected successfully ✨'))
    .catch(err => console.error('❌ MongoDB connection failed:', err));
}

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
console.log('Auth routes are at /api/auth');

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vipreshana Server is running!',
    availableEndpoints: [
      'GET /health - Server health check',
      'GET /api/auth/test - Authentication endpoints'
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      supabase: process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY ? 'configured' : 'not_configured',
      mongodb: process.env.MONGODB_URI ? 'configured' : 'not_configured'
    },
    endpoints: {
      auth: '/api/auth'
    }
  });
});

// User Profile Routes
app.get('/api/user/profile', Controllers.GetUserProfileController);
app.put('/api/user/profile', Controllers.UpdateUserProfileController);
app.put('/api/user/password', Controllers.UpdateUserPasswordController);

// OTP Routes
app.post('/api/send-otp', otpRateLimiter, Controllers.SendOTPController);
app.post('/api/verify-otp', otpVerificationRateLimiter, Controllers.VerifyOTPController);

// Auth/Registration Routes
app.post('/api/register', Controllers.UserRegisterController);
app.post('/api/forgot-password', Controllers.ForgotPasswordController);

// Booking Routes
app.post('/api/bookings', Controllers.BookingController);
app.get('/api/details', Controllers.GetAllBookingController);

// Server Test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running', status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Fallback Route
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requested: req.originalUrl,
    available_api_base_paths: [
      '/api/auth',
      '/api/test',
      '/health'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Server Start
app.listen(PORT, () => {
  figlet('Vipreshana Server', (err, data) => {
    if (err) {
      console.log(`Server started on port ${PORT}`);
    } else {
      console.log(data);
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check at: http://localhost:${PORT}/health`);
      console.log(`Auth endpoints at: http://localhost:${PORT}/api/auth/`);
    }
  });
});
