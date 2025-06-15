const mongoose = require('mongoose');

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

module.exports = Details;