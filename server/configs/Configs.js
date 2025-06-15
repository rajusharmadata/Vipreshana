require('dotenv').config();

const Configs = {
    PORT: process.env.PORT,
    DB_URI: process.env.MONGO_CONNECTION_STRING,
    TWILIO_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
}

module.exports = Configs;