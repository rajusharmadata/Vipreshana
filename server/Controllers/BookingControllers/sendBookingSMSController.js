const Configs = require("../../configs/Configs");
const twilio = require('twilio');

// Access Twilio credentials from environment variables
const accountSid = Configs.TWILIO_SID;
const authToken = Configs.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = Configs.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMSController = async (req, res) => {
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
}

// Helper function to format the phone number to E.164 format for Indian numbers
function formatPhoneNumber(phone) {
    if (phone.startsWith('+91')) return phone;
    return `+91${phone}`;
}

module.exports = sendSMSController;