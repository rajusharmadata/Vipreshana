const Details = require("./Booking/Booking.schema");
const Registration = require("./User/User.schema");

const Models = {
    UserSchema: Registration,
    BookingSchema: Details
}

module.exports = Models;