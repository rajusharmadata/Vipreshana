const express = require('express');
const cors = require('cors');
const Configs = require('./configs/Configs');
const connectMongoDB = require('./Databases/ConnectDB');
const Controllers = require('./Controllers/index.controllers');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectMongoDB(Configs.DB_URI);

// API Endpoints
app.delete('/api/details/:id', Controllers.DeleteBookingController);

// Register User
app.post('/register', Controllers.UserRegisterController);

// Get Bookings by Phone
app.get('/api/bookings/:phone', Controllers.GetBookingByPhoneController);

// Login
app.post('/login', Controllers.UserLoginController);

// Booking Endpoints
app.post('/api/bookings', Controllers.BookingController);

// Get All Bookings
app.get('/api/details', Controllers.GetAllBookingController);

// Update Booking Status
app.put('/api/details/:id/status', Controllers.UpdateBookingController);

// Accept Booking
app.put('/api/details/:id/accept', Controllers.AcceptBookingController);

// Send SMS upon delivery and delete booking
app.post('/api/details/deliver', Controllers.SendBookingSMSController);

// Start the server
const PORT = Configs.PORT || 5000;
app.listen(PORT, (err) => {
    if(err) {
        console.log(`Server connection error.`);
    }else {
        console.log(`Server running on port ${PORT}`);
    }
});