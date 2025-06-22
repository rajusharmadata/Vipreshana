const Models = require("../../Models/index.models");

const verifyOTPController = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        // Validate input
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                error: "Phone number and OTP are required"
            });
        }

        // Find the OTP record
        const otpRecord = await Models.OTPSchema.findOne({
            phone,
            otp,
            expiresAt: { $gt: new Date() },
            isVerified: false
        });

        if (!otpRecord) {
            // Check if OTP exists but is expired
            const expiredOTP = await Models.OTPSchema.findOne({
                phone,
                otp,
                expiresAt: { $lte: new Date() }
            });

            if (expiredOTP) {
                return res.status(400).json({
                    success: false,
                    error: "OTP has expired. Please request a new one."
                });
            }

            // Check if OTP exists but is already verified
            const verifiedOTP = await Models.OTPSchema.findOne({
                phone,
                otp,
                isVerified: true
            });

            if (verifiedOTP) {
                return res.status(400).json({
                    success: false,
                    error: "OTP has already been used."
                });
            }

            // Increment attempts
            const existingOTP = await Models.OTPSchema.findOne({ phone, isVerified: false });
            if (existingOTP) {
                existingOTP.attempts += 1;
                await existingOTP.save();

                if (existingOTP.attempts >= existingOTP.maxAttempts) {
                    return res.status(400).json({
                        success: false,
                        error: "Too many failed attempts. Please request a new OTP."
                    });
                }
            }

            return res.status(400).json({
                success: false,
                error: "Invalid OTP. Please check and try again."
            });
        }

        // Mark OTP as verified
        otpRecord.isVerified = true;
        await otpRecord.save();

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error('Error in verifyOTPController:', error);
        res.status(500).json({
            success: false,
            error: "Failed to verify OTP"
        });
    }
};

module.exports = verifyOTPController; 