const acceptBookingController = require("./BookingControllers/acceptBookingController");
const createBookingController = require("./BookingControllers/createBookingController");
const deleteBooking = require("./BookingControllers/deleteBookingController");
const getAllBookingController = require("./BookingControllers/getAllBookingsController");
const getBookingByPhoneController = require("./BookingControllers/getBookingByPhController");
const sendSMSController = require("./BookingControllers/sendBookingSMSController");
const updateBookingController = require("./BookingControllers/updateBookingController");
const userLoginController = require("./UserControllers/userLoginController");
const userRegisterController = require("./UserControllers/userRegisterController");
const forgotPasswordController = require('./UserControllers/userForgotPasswordController'); // Forgot Password


const Controllers = {
    DeleteBookingController: deleteBooking,
    UserRegisterController: userRegisterController,
    UserLoginController: userLoginController,
    GetBookingByPhoneController: getBookingByPhoneController,
    BookingController: createBookingController,
    GetAllBookingController: getAllBookingController,
    UpdateBookingController: updateBookingController,
    AcceptBookingController: acceptBookingController,
    SendBookingSMSController: sendSMSController,
    ForgotPasswordController: forgotPasswordController
}

module.exports = Controllers;