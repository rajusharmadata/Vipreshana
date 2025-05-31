const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
require('dotenv').config(); // Ensure that dotenv is loaded to access environment variables

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));
  

// Define Schema for User Registration
const registrationSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, required: true }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Define Schema for Booking Details
const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    pickupLocation: String,
    dropoffLocation: String,
    vehicleType: String,
    estimatedCost: Number,
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, default: 'pending' },
    accepted_booking: { type: String, default: 'not accepted' }
});

const Details = mongoose.model('Details', bookingSchema);

// Access Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// API Endpoints
app.delete('/api/details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Details.findByIdAndDelete(id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});

// Register User
app.post('/register', async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const existingUser = await Registration.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "Email or Phone already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newRegistration = new Registration({ name, email, password: hashedPassword, phone, role });
        await newRegistration.save();

        res.status(200).json({ message: "Registration successful!" });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Get Bookings by Phone
app.get('/api/bookings/:phone', async (req, res) => {
    const { phone } = req.params;

    try {
        const bookings = await Details.find({ phone });
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this phone number' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await Registration.findOne({ phone });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        let redirectUrl = '/logindashboard';
        if (user.role === 'admin') redirectUrl = '/admin';
        else if (user.role === 'driver') redirectUrl = '/driver';

        res.status(200).json({ message: "Login successful", redirectUrl });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: "Failed to log in" });
    }
});

// Booking Endpoints
app.post('/api/bookings', async (req, res) => {
    const { name, phone, pickupLocation, dropoffLocation, vehicleType, estimatedCost } = req.body;

    try {
        const newBooking = new Details({
            name,
            phone,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            estimatedCost,
        });

        await newBooking.save();
        res.status(200).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ error: 'Error saving booking' });
    }
});

// Get All Bookings
app.get('/api/details', async (req, res) => {
    try {
        const bookings = await Details.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Update Booking Status
app.put('/api/details/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const booking = await Details.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', booking });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Accept Booking
app.put('/api/details/:id/accept', async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Details.findByIdAndUpdate(id, { accepted_booking: 'accepted' }, { new: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking accepted successfully', booking });
    } catch (error) {
        console.error('Error accepting booking:', error);
        res.status(500).json({ error: 'Failed to accept booking' });
    }
});

// Helper function to format the phone number to E.164 format for Indian numbers
function formatPhoneNumber(phone) {
    if (phone.startsWith('+91')) return phone;
    return `+91${phone}`;
}

// Send SMS upon delivery and delete booking
app.post('/api/details/deliver', async (req, res) => {
    let { phone, message } = req.body;
    
    // Format the phone number to E.164
    phone = formatPhoneNumber(phone);
    
    try {
        await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phone,
        });
        res.status(200).json({ message: 'Delivery message sent.' });
    } catch (error) {
        console.error('Failed to send SMS:', error);
        res.status(500).json({ error: 'Failed to send delivery message.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});