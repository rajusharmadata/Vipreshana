const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: val => /^[0-9]{10}$/.test(val),
            message: 'Phone must be a 10-digit number'
        }
    },
    pickupLocation: {
        type: String,
        required: true,
        trim: true
    },
    dropoffLocation: {
        type: String,
        required: true,
        trim: true
    },
    vehicleType: {
        type: String
    },
    estimatedCost: {
        type: Number,
        min: [0, 'Estimated cost must be a positive number']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'cancelled', 'completed']
    },
    accepted_booking: {
        type: String,
        default: 'not accepted',
        enum: ['not accepted', 'accepted']
    }
});

bookingSchema.index({ phone: 1, pickupLocation: 1, dropoffLocation: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
