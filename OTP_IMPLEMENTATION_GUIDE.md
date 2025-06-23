# OTP Verification Implementation Guide

This guide explains how to set up and use the OTP verification system for user registration.

## Features Implemented

1. **OTP Generation**: 6-digit random OTP codes
2. **SMS Delivery**: Using Twilio SMS API
3. **Rate Limiting**: Prevents abuse with configurable limits
4. **OTP Expiry**: 10-minute expiration with auto-cleanup
5. **Attempt Tracking**: Limits failed verification attempts
6. **Phone Verification**: Required before account creation

## Setup Instructions

### 1. Install Dependencies

In the server directory, install the required packages:

```bash
cd server
npm install express-rate-limit
```

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Database Configuration
MONGODB_URI=your_mongodb_connection_string
```

### 3. Twilio Setup

1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number for sending SMS
4. Add these credentials to your `.env` file

## API Endpoints

### Send OTP
- **POST** `/api/send-otp`
- **Body**: `{ "phone": "1234567890" }`
- **Rate Limit**: 3 requests per 10 minutes per IP

### Verify OTP
- **POST** `/api/verify-otp`
- **Body**: `{ "phone": "1234567890", "otp": "123456" }`
- **Rate Limit**: 5 attempts per 5 minutes per IP

### Register User
- **POST** `/api/register`
- **Body**: `{ "name": "...", "email": "...", "password": "...", "phone": "...", "role": "..." }`
- **Note**: Requires verified OTP

## Registration Flow

1. User fills out registration form
2. User clicks "Continue to Verification"
3. OTP is sent to user's phone number
4. User enters 6-digit OTP code
5. OTP is verified
6. User account is created
7. User is redirected to login

## Security Features

- **Rate Limiting**: Prevents OTP spam
- **OTP Expiry**: 10-minute expiration
- **Attempt Tracking**: Max 3 failed attempts per OTP
- **Auto-cleanup**: Expired OTPs are automatically deleted
- **Phone Validation**: Checks for existing users before sending OTP

## Database Schema

### OTP Collection
```javascript
{
  phone: String (required, indexed),
  otp: String (required),
  isVerified: Boolean (default: false),
  expiresAt: Date (required, TTL index),
  attempts: Number (default: 0),
  maxAttempts: Number (default: 3),
  createdAt: Date (default: now)
}
```

## Frontend Components

- `OTPVerification.jsx`: Handles OTP input and verification
- Updated `Registration.jsx`: Includes OTP verification flow

## Error Handling

The system handles various error scenarios:
- Invalid phone numbers
- Expired OTPs
- Too many attempts
- Rate limiting
- Network errors
- Twilio API errors

## Testing

To test the system:

1. Start the server: `npm run dev`
2. Navigate to the registration page
3. Fill out the form with a valid phone number
4. Check your phone for the OTP
5. Enter the OTP to complete registration

## Troubleshooting

### Common Issues

1. **OTP not received**: Check Twilio credentials and phone number format
2. **Rate limiting**: Wait for the cooldown period
3. **Database errors**: Ensure MongoDB is running and accessible
4. **CORS issues**: Check server CORS configuration

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Rate Limiting Configuration

The system includes two rate limiters:

1. **OTP Requests**: 3 requests per 10 minutes
2. **OTP Verification**: 5 attempts per 5 minutes

These can be adjusted in `server/middleware/rateLimiter.js`. 