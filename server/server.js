const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const twilio = require('twilio');
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

// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
console.log('Twilio Config:', {
  accountSid: process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Not Set',
  authToken: process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Not Set',
  phoneNumber: process.env.TWILIO_PHONE_NUMBER
});

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✨ MongoDB connected successfully ✨'))
    .catch(err => console.error(' MongoDB connection failed:', err));
}

// Import routes
const otpRoutes = require('./routes/otpRoutes');
const authRoutes = require('./routes/authRoutes');

// Mount routes
app.use('/api/otp', otpRoutes);
app.use('/api/auth', authRoutes);
console.log('OTP routes are at /api/otp');
console.log('Auth routes are at /api/auth');

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vipreshana Server is running!',
    availableEndpoints: [
      'GET /health - Server health check',
      'GET /api/auth/test - Authentication endpoints',
      'GET /api/otp/test - OTP endpoints',
      'POST /send-sms - Send SMS message (Twilio)'
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      twilio: process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN ? 'configured' : 'not_configured',
      supabase: process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY ? 'configured' : 'not_configured',
      mongodb: process.env.MONGODB_URI ? 'configured' : 'not_configured'
    },
    endpoints: {
      auth: '/api/auth',
      otp: '/api/otp'
    }
  });
});

// SMS endpoint
app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    res.json({ success: true, messageSid: result.sid });
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
});

// API routes with proper parameter syntax
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ userId, message: 'User endpoint' });
});

app.get('/api/data/:dataId', (req, res) => {
  const { dataId } = req.params;
  res.json({ dataId, message: 'Data endpoint' });
});

// Add a route to handle CORS preflight requests
app.options('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5001', 'http://localhost:5173', 'https://vipreshana-2.vercel.app', 'https://vipreshana-3.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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
      '/api/users',
      '/api/auth',
      '/api/otp',
      '/api/rides',
      '/api/admin'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Function to start server with port fallback
const startServer = (port) => {
  const server = app.listen(port)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is already in use, trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
      }
    })
    .on('listening', () => {
      const actualPort = server.address().port;
      figlet('Vipreshana Server', (err, data) => {
        if (err) {
          console.log(`Server started on port ${actualPort}`);
        } else {
          console.log(data);
          console.log(`Server is running on port ${actualPort}`);
          console.log(`Health check at: http://localhost:${actualPort}/health`);
          console.log(`OTP endpoints at: http://localhost:${actualPort}/api/otp/`);
          console.log(`Auth endpoints at: http://localhost:${actualPort}/api/auth/`);
          
          // If we're using a different port than the configured one, log a warning
          if (actualPort !== parseInt(PORT)) {
            console.warn(`⚠️ NOTE: Using port ${actualPort} instead of configured port ${PORT}`);
            console.warn(`⚠️ Make sure your frontend is configured to use: http://localhost:${actualPort}/api`);
          }
        }
      });
    });
};

// Start the server
startServer(PORT);