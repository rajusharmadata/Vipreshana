const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const figlet = require('figlet');
require('dotenv').config();
const Configs = require('./configs/Configs');
const connectMongoDB = require('./Databases/ConnectDB');
const Controllers = require('./Controllers/index.controllers');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001', 'http://localhost:5173', 'https://vipreshana-2.vercel.app', 'https://vipreshana-3.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
app.use(cors());
// 404 Handler 
// app.use((req, res, next) => {
//   res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist.' });
// });
// MongoDB Connection
connectMongoDB(Configs.DB_URI);

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✨ MongoDB connected successfully ✨'))
    .catch(err => console.error(' MongoDB connection failed:', err));
}

// Import routes
const authRoutes = require('./routes/authRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
console.log('Auth routes are at /api/auth');

// Basic routes
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
// User Profile Endpoints
app.get('/api/user/profile', Controllers.GetUserProfileController);
app.put('/api/user/profile', Controllers.UpdateUserProfileController);
app.put('/api/user/password', Controllers.UpdateUserPasswordController);

//Forgot password
app.post('/api/forgot-password', Controllers.ForgotPasswordController);

// Booking Endpoints
app.post('/api/bookings', Controllers.BookingController);

// Get All Bookings
app.get('/api/details', Controllers.GetAllBookingController);

// Add a test route to verify the server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running', status: 'ok', timestamp: new Date().toISOString() });
});

// Add a fallback route handler for 404 errors
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Start the server
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