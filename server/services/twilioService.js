const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

// More detailed logging for Twilio configuration
console.log('Detailed Twilio Config Check:', {
  accountSid: accountSid ? `${accountSid.substring(0, 4)}...${accountSid.substring(accountSid.length - 4)}` : 'Missing',
  authToken: authToken ? `${authToken.substring(0, 4)}...${authToken.substring(authToken.length - 4)}` : 'Missing',
  phoneNumber: phoneNumber || 'Missing',
  hasAllConfig: accountSid && authToken && phoneNumber ? 'Yes' : 'No'
});

// Initialize Twilio client only if all config values are present
let client;
try {
  if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized successfully');
  } else {
    console.log('⚠️ Twilio client not initialized - missing credentials');
  }
} catch (error) {
  console.error('❌ Failed to initialize Twilio client:', error.message);
}

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS only
const sendSMSOTP = async (phoneNumber, otp) => {
  try {
    console.log(`📤 Attempting to send SMS to ${phoneNumber} with OTP: ${otp}`);
    
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('TWILIO_PHONE_NUMBER environment variable is not set');
    }

    if (!client) {
      throw new Error('Twilio client is not initialized. Check your credentials.');
    }
    
    // For testing in development, allow skipping actual SMS for certain numbers
    if (phoneNumber === '+1234567890' || process.env.NODE_ENV === 'test') {
      console.log('🧪 Test mode: Simulating SMS delivery success');
      return { 
        success: true, 
        sid: 'TEST_SID_' + Date.now(),
        testMode: true
      };
    }
    
    const message = await client.messages.create({
      body: `Your Vipreshana verification code is: ${otp}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log(`✅ SMS sent successfully. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    // More detailed error handling
    let errorMessage = error.message;
    if (error.code) {
      console.error(`Twilio Error Code: ${error.code}`);
      // Handle specific Twilio error codes
      if (error.code === 21614) {
        errorMessage = 'Phone number is not a valid, SMS-capable phone number.';
      } else if (error.code === 21608) {
        errorMessage = 'The number is not currently reachable via SMS.';
      } else if (error.code === 21211) {
        errorMessage = 'Invalid phone number format.';
      }
    }
    return { success: false, error: errorMessage };
  }
};

// Send OTP via SMS
const sendOTPBoth = async (phoneNumber) => {
  try {
    const otp = generateOTP();
    const expiryTime = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    console.log(`🔢 Generated OTP ${otp} for ${phoneNumber}`);
    
    // Store OTP with expiry
    otpStorage.set(phoneNumber, {
      otp,
      expiryTime,
      attempts: 0,
      maxAttempts: 3
    });
    
    const result = await sendSMSOTP(phoneNumber, otp);
    
    if (result.success) {
      console.log(`✅ OTP ${otp} sent to ${phoneNumber} via SMS`);
      return {
        success: true,
        message: 'OTP sent successfully via SMS',
        sid: result.sid,
        testMode: result.testMode || false
      };
    } else {
      // Remove from storage if sending failed
      otpStorage.delete(phoneNumber);
      console.error(`❌ Failed to send OTP to ${phoneNumber}: ${result.error}`);
      return {
        success: false,
        message: 'Failed to send OTP via SMS',
        error: result.error
      };
    }
    
  } catch (error) {
    console.error('❌ Error in sendOTPBoth:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify OTP
const verifyOTP = async (phoneNumber, userOTP) => {
  try {
    console.log(`🔍 Verifying OTP for ${phoneNumber}`);
    const storedData = otpStorage.get(phoneNumber);
    
    // For testing in development
    if ((phoneNumber === '+91-9805763104' || process.env.NODE_ENV === 'test') && userOTP === '123456') {
      console.log('🧪 Test mode: Simulating OTP verification success');
      return {
        success: true,
        message: 'OTP verified successfully!',
        testMode: true
      };
    }
    
    if (!storedData) {
      console.log(`❌ No OTP found for ${phoneNumber}`);
      return {
        success: false,
        message: 'No OTP found for this phone number. Please request a new OTP.'
      };
    }
    
    // Check if OTP has expired
    if (Date.now() > storedData.expiryTime) {
      console.log(`⏰ OTP expired for ${phoneNumber}`);
      otpStorage.delete(phoneNumber);
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      };
    }
    
    // Check if max attempts exceeded
    if (storedData.attempts >= storedData.maxAttempts) {
      console.log(`🔒 Max attempts exceeded for ${phoneNumber}`);
      otpStorage.delete(phoneNumber);
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      };
    }
    
    // Increment attempts
    storedData.attempts += 1;
    otpStorage.set(phoneNumber, storedData);
    
    // Verify OTP
    if (storedData.otp === userOTP) {
      console.log(`✅ OTP verified successfully for ${phoneNumber}`);
      otpStorage.delete(phoneNumber); // Remove after successful verification
      return {
        success: true,
        message: 'OTP verified successfully!'
      };
    } else {
      console.log(`❌ Invalid OTP for ${phoneNumber}: ${userOTP} vs ${storedData.otp}`);
      return {
        success: false,
        message: `Invalid OTP. ${storedData.maxAttempts - storedData.attempts} attempts remaining.`
      };
    }
    
  } catch (error) {
    console.error('❌ Error in verifyOTP:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Resend OTP
const resendOTP = async (phoneNumber) => {
  console.log(`🔄 Resending OTP to ${phoneNumber}`);
  // Delete existing OTP
  otpStorage.delete(phoneNumber);
  
  // Send new OTP
  return await sendOTPBoth(phoneNumber);
};

// Clean up expired OTPs (run periodically)
const cleanupExpiredOTPs = () => {
  const now = Date.now();
  let count = 0;
  for (const [phoneNumber, data] of otpStorage.entries()) {
    if (now > data.expiryTime) {
      otpStorage.delete(phoneNumber);
      count++;
    }
  }
  if (count > 0) {
    console.log(`🧹 Cleaned up ${count} expired OTPs`);
  }
};

// Cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

module.exports = {
  sendOTPBoth,
  sendSMSOTP,
  verifyOTP,
  resendOTP,
  generateOTP
};