const Models = require("../../Models/index.models");

const acceptBookingController = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Models.BookingSchema.findByIdAndUpdate(id, { accepted_booking: 'accepted' }, { new: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking accepted successfully', booking });
    } catch (error) {
        console.error('Error accepting booking:', error);
        res.status(500).json({ error: 'Failed to accept booking' });
    }
}

module.exports = acceptBookingController;