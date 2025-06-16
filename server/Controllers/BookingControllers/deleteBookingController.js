const Models = require("../../Models/index.models");

const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        await Models.BookingSchema.findByIdAndDelete(id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
}

module.exports = deleteBooking;