const Models = require("../../Models/index.models");

const getAllBookingController = async (req, res) => {
    try {
        const bookings = await Models.BookingSchema.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

module.exports = getAllBookingController;