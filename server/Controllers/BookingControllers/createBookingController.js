const Models = require("../../Models/index.models");

const createBookingController = async (req, res) => {
    const { name, phone, pickupLocation, dropoffLocation, vehicleType, estimatedCost } = req.body;

    try {
        const newBooking = new Models.BookingSchema({
            name,
            phone,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            estimatedCost,
        });

        await newBooking.save();
        res.status(200).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ error: 'Error saving booking' });
    }
}

module.exports = createBookingController;