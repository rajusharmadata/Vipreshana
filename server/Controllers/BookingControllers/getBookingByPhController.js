const Models = require("../../Models/index.models");

const getBookingByPhoneController = async (req, res) => {
    const { phone } = req.params;

    try {
        const bookings = await Models.BookingSchema.find({ phone });
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this phone number' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
}

module.exports = getBookingByPhoneController;