const Details = require("./Booking/Booking.schema");
const Registration = require("./User/User.schema");
const OTPSchema = require("./OTP/OTP.schema");

const Models = {
    UserSchema: Registration,
    BookingSchema: Details,
    OTPSchema: OTPSchema
}

module.exports = Models;