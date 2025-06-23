const Models = require("../../Models/index.models");
const { sendOTP, generateOTP } = require("../../services/twilioService");

const sendOTPController = async (req, res) => {
    const { phone } = req.body;

    try {
        // Validate phone number
        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                error: "Phone number is required" 
            });
        }

        // Check if phone number is already registered
        const existingUser = await Models.UserSchema.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: "Phone number already registered" 
            });
        }

        // Check for existing unexpired OTP
        const existingOTP = await Models.OTPSchema.findOne({
            phone,
            expiresAt: { $gt: new Date() },
            isVerified: false
        });

        if (existingOTP) {
            const timeDiff = Math.ceil((existingOTP.expiresAt - new Date()) / 1000 / 60);
            return res.status(429).json({
                success: false,
                error: `Please wait ${timeDiff} minutes before requesting another OTP`
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database
        const newOTP = new Models.OTPSchema({
            phone,
            otp,
            expiresAt
        });
        await newOTP.save();

        // Send OTP via SMS
        const smsResult = await sendOTP(phone, otp);

        if (!smsResult.success) {
            // Delete the saved OTP if SMS failed
            await Models.OTPSchema.findByIdAndDelete(newOTP._id);
            return res.status(500).json({
                success: false,
                error: "Failed to send OTP. Please try again."
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            expiresIn: "10 minutes"
        });

    } catch (error) {
        console.error('Error in sendOTPController:', error);
        res.status(500).json({
            success: false,
            error: "Failed to send OTP"
        });
    }
};

module.exports = sendOTPController; 