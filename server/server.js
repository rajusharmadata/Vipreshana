const express = require('express');
const cors = require('cors');
const figlet = require('figlet');
const Configs = require('./configs/Configs');
const connectMongoDB = require('./Databases/ConnectDB');
const Controllers = require('./Controllers/index.controllers');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// 404 Handler 
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource does not exist.' });
});
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

// User Profile Endpoints
app.get('/api/user/profile', Controllers.GetUserProfileController);
app.put('/api/user/profile', Controllers.UpdateUserProfileController);
app.put('/api/user/password', Controllers.UpdateUserPasswordController);

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
    if (err) {
        // console.log(`Server connection error.`);
        console.log(err);
        figlet(`S e r v e r  c o n n e c t i o n  e r r o r`, (err, data) => {
            if (err) {
                console.log("Figlet Error.");
            } else {
                console.log(data);
            }
        });
    } else {
        // console.log(`Server running on port ${PORT}`);
        figlet(`S e r v e r  r u n n i n g  o n  p o r t :  ${PORT}`, (err, data) => {
            if (err) {
                console.log("Figlet Error.");
            } else {
                console.log(data);
            }
        });
    }
});