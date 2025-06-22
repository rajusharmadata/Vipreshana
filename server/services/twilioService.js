const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

/**
 * Send OTP via SMS using Twilio
 * @param {string} phoneNumber - The phone number to send OTP to
 * @param {string} otp - The OTP code to send
 * @returns {Promise<Object>} - Result object with success status and message
 */
const sendOTP = async (phoneNumber, otp) => {
    try {
        // Format phone number to E.164 format if not already
        let formattedPhone = phoneNumber;
        if (!phoneNumber.startsWith('+')) {
            // Assume Indian numbers if no country code
            if (phoneNumber.length === 10) {
                formattedPhone = `+91${phoneNumber}`;
            } else if (phoneNumber.startsWith('91') && phoneNumber.length === 12) {
                formattedPhone = `+${phoneNumber}`;
            }
        }

        const message = await client.messages.create({
            body: `Your Vipreshana verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`,
            from: TWILIO_PHONE_NUMBER,
            to: formattedPhone
        });

        console.log(`OTP sent successfully to ${formattedPhone}. SID: ${message.sid}`);
        
        return {
            success: true,
            message: 'OTP sent successfully',
            sid: message.sid
        };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return {
            success: false,
            message: 'Failed to send OTP',
            error: error.message
        };
    }
};

/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    sendOTP,
    generateOTP
}; 