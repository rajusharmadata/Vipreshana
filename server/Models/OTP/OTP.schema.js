const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // Auto-delete expired documents
    },
    attempts: {
        type: Number,
        default: 0
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
otpSchema.index({ phone: 1, createdAt: -1 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP; 