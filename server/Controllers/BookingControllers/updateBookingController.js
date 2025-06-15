const Models = require("../../Models/index.models");

const updateBookingController = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const booking = await Models.BookingSchema.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Status updated successfully', booking });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
}

module.exports = updateBookingController;