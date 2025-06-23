const rateLimit = require('express-rate-limit');

// Rate limiter for OTP requests
const otpRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: {
        success: false,
        error: 'Too many OTP requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for OTP verification
const otpVerificationRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 verification attempts per windowMs
    message: {
        success: false,
        error: 'Too many verification attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    otpRateLimiter,
    otpVerificationRateLimiter
}; 