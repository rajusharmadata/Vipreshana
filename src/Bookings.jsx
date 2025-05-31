import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBookings = async () => {
            const phone = localStorage.getItem('userPhone'); // Get phone number from localStorage

            if (!phone) {
                setError('Phone number not found in local storage');
                return;
            }

            try {
                const response = await fetch(`https://vipreshana-3.onrender.com/api/bookings/${phone}`); // Call backend API with phone number
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }

                const bookingsData = await response.json();
                setBookings(bookingsData); // Set fetched bookings data
            } catch (error) {
                console.error('Error fetching user bookings:', error);
            }
        };

        fetchUserBookings();
    }, []);

    const handleTrackDriver = (bookingId) => {
        localStorage.setItem('bookingId', bookingId); // Store booking ID in localStorage
        navigate('/location'); // Navigate to the Location component
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center"
            style={{
                backgroundImage: 'url(https://images.pexels.com/photos/258510/pexels-photo-258510.jpeg?auto=compress&cs=tinysrgb&w=600)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="backdrop-blur-sm bg-white bg-opacity-70 rounded-lg p-8 shadow-xl max-w-7xl w-full border-4 border-black overflow-x-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">Your Bookings</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {bookings.length === 0 ? (
                    <p className="text-center text-gray-700">No bookings found.</p>
                ) : (
                    <table className="w-full table-auto text-left border-separate border-spacing-y-2 border-2 border-black">
                        <thead>
                            <tr className="bg-gray-300 bg-opacity-80 text-gray-800">
                                <th className="px-6 py-4 border border-black">#</th>
                                <th className="px-6 py-4 border border-black">Name</th>
                                <th className="px-6 py-4 border border-black">Phone</th>
                                <th className="px-6 py-4 border border-black">Pickup Location</th>
                                <th className="px-6 py-4 border border-black">Drop-off Location</th>
                                <th className="px-6 py-4 border border-black">Vehicle Type</th>
                                <th className="px-6 py-4 border border-black">Cost</th>
                                <th className="px-6 py-4 border border-black">Created At</th>
                                <th className="px-6 py-4 border border-black">Status</th>
                                <th className="px-6 py-4 border border-black">Track</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr
                                    key={booking._id}  // Assuming MongoDB ObjectId is used
                                    className="bg-white bg-opacity-90 border-b shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 rounded-lg"
                                    style={{ borderBottom: '2px solid black' }}
                                >
                                    <td className="px-6 py-4 border border-black font-semibold">{index + 1}</td>
                                    <td className="px-6 py-4 border border-black">{booking.name}</td>
                                    <td className="px-6 py-4 border border-black">{booking.phone}</td>
                                    <td className="px-6 py-4 border border-black">{booking.pickupLocation}</td>
                                    <td className="px-6 py-4 border border-black">{booking.dropoffLocation}</td>
                                    <td className="px-6 py-4 border border-black">{booking.vehicleType}</td>
                                    <td className="px-6 py-4 border border-black font-semibold text-gray-800">
                                        {booking.estimatedCost.toFixed(2)} INR
                                    </td>
                                    <td className="px-6 py-4 border border-black">{new Date(booking.bookingDate).toLocaleString()}</td>
                                    <td className="px-6 py-4 border border-black">
                                        <span
                                            className={`font-bold ${booking.status === 'pending' ? 'text-red-500' : 'text-green-500'}`}
                                        >
                                            {booking.status === 'pending' ? 'Pending' : booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border border-black text-center">
                                        {booking.status === 'pending' ? (
                                            <span className="text-yellow-500 font-bold">Pending</span>
                                        ) : (
                                            <button
                                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                                                onClick={() => handleTrackDriver(booking._id)} // Call the new function to handle tracking
                                            >
                                                Track Driver
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserBookings;
