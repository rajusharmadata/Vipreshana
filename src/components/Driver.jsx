import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
const Driver = () => {
    const [bookings, setBookings] = useState([]);
    const [acceptedBooking, setAcceptedBooking] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [jobStatus, setJobStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('https://vipreshana-3.onrender.com/api/details');
                setBookings(response.data); 
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Failed to load bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleAcceptBooking = async (booking) => {
        const confirmAccept = window.confirm("Are you sure you want to accept this booking?");
        if (!confirmAccept) {
            toast.info('Booking acceptance canceled.');
            return;
        }
        try {
            await axios.put(`https://vipreshana-3.onrender.com/api/details/${booking._id}/accept`, {
                accepted_booking: 'accepted'
            });
            setAcceptedBooking(booking);
            setShowDetails(true);
            setJobStatus(booking.status);
            toast.success('Booking accepted successfully!');
            setBookings(prevBookings =>
                prevBookings.map(b =>
                    b._id === booking._id ? { ...b, accepted_booking: 'accepted' } : b
                )
            );
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast.error('Failed to accept booking.');
        }
    };

    const toggleDetails = (booking) => {
        if (acceptedBooking && acceptedBooking._id === booking._id) {
            setShowDetails(!showDetails);
        } else {
            setAcceptedBooking(booking);
            setShowDetails(true);
            setJobStatus(booking.status);
        }
    };

    const handleUpdateStatus = async (status) => {
        setJobStatus(status);
        try {
            await axios.put(`https://vipreshana-3.onrender.com/api/details/${acceptedBooking._id}/status`, { status });
            setAcceptedBooking(prevBooking => ({ ...prevBooking, status }));
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === acceptedBooking._id ? { ...booking, status } : booking
                )
            );
            toast.success('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status.');
        }
    };

    const handleDelivery = async () => {
        const confirmDelivery = window.confirm("Are you sure you want to mark this booking as delivered?");
        if (!confirmDelivery) return;
    
        try {
            // Mark as delivered
            await axios.put(`https://vipreshana-3.onrender.com/api/details/${acceptedBooking._id}/status`, { status: 'Delivered' });
            
            // Send delivery message
            await axios.post('https://vipreshana-3.onrender.com/api/details/deliver', {
                phone: acceptedBooking.phone,
                message: `Dear ${acceptedBooking.name}, Your goods have been delivered from ${acceptedBooking.pickupLocation} to ${acceptedBooking.dropoffLocation} safely.`
            });
    
            // Delete the booking from the database
            await axios.delete(`https://vipreshana-3.onrender.com/api/details/${acceptedBooking._id}`);
    
            // Update state to remove the delivered booking
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== acceptedBooking._id));
            setAcceptedBooking(null);
            setShowDetails(false);
            toast.success('Delivery message sent and booking removed from database.');
        } catch (error) {
            console.error('Error delivering booking:', error);
            toast.error('Failed to send delivery message or delete booking.');
        }
    };

    const isDark = theme === 'dark';
    
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${
                isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
                <p className="text-xl">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div 
            className={`p-4 min-h-screen transition-all duration-300 ${
                isDark ? 'brightness-75' : 'brightness-100'
            }`} 
            style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1547628641-ec2098bb5812?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8fA%3D%3D)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                backgroundRepeat: 'no-repeat' 
            }}
        >
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 z-10 ${
                    isDark 
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                        : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                }`}
                aria-label="Toggle theme"
            >
                {isDark ? '☀️' : '🌙'}
            </button>

            <div className={`p-6 rounded-lg shadow-lg max-w-4xl mx-auto transition-all duration-300 ${
                isDark 
                    ? 'bg-gray-800 bg-opacity-90 text-white border border-gray-700' 
                    : 'bg-white bg-opacity-80 text-gray-900'
            }`}>
                <h1 className={`text-3xl font-bold mb-4 text-center transition-colors duration-300 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>Driver Dashboard</h1>
                
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div 
                            key={booking._id} 
                            className={`mb-4 p-4 border rounded-lg shadow-md transition-all duration-300 ${
                                isDark 
                                    ? 'border-gray-600 bg-gray-700 text-white' 
                                    : 'border-gray-300 bg-white text-gray-900'
                            }`}
                        >
                            <h2 className={`text-xl font-semibold transition-colors duration-300 ${
                                isDark ? 'text-gray-200' : 'text-gray-800'
                            }`}>Booking Details</h2>
                            <p className={`text-lg transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>📍 Pickup Location: {booking.pickupLocation}</p>
                            <p className={`text-lg transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>🚖 Drop-off Location: {booking.dropoffLocation}</p>
                            <p className={`text-lg transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>💲 Estimated Cost: {booking.estimatedCost}</p>
                            <p className={`text-lg transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>🚗 Vehicle Type: {booking.vehicleType}</p>
                            <p className={`text-lg transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>✅ Status: {booking.status}</p>

                            <div className="mt-4">
                                {booking.accepted_booking === 'accepted' ? (
                                    <button
                                        className={`font-bold py-2 px-4 rounded mr-2 transition-all duration-300 ${
                                            isDark
                                                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                                                : 'bg-gray-500 hover:bg-gray-700 text-white'
                                        }`}
                                        onClick={() => toggleDetails(booking)}
                                    >
                                        {showDetails && acceptedBooking && acceptedBooking._id === booking._id ? "Hide Details" : "View Details"}
                                    </button>
                                ) : (
                                    <button
                                        className={`font-bold py-2 px-4 rounded mr-2 transition-all duration-300 ${
                                            isDark
                                                ? 'bg-blue-500 hover:bg-blue-400 text-white'
                                                : 'bg-blue-500 hover:bg-blue-700 text-white'
                                        }`}
                                        onClick={() => handleAcceptBooking(booking)}
                                    >
                                        Accept
                                    </button>
                                )}
                            </div>

                            {acceptedBooking && acceptedBooking._id === booking._id && showDetails && (
                                <div className={`mt-4 p-2 border rounded-lg shadow-inner transition-all duration-300 ${
                                    isDark 
                                        ? 'border-gray-600 bg-gray-800' 
                                        : 'border-gray-200 bg-gray-50'
                                }`}>
                                    <h2 className={`text-lg font-semibold transition-colors duration-300 ${
                                        isDark ? 'text-gray-200' : 'text-gray-800'
                                    }`}>Job Assignment:</h2>
                                    <p className={`transition-colors duration-300 ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>👤 Name: {acceptedBooking.name}</p>
                                    <p className={`transition-colors duration-300 ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>📞 Phone number: {acceptedBooking.phone}</p>
                                    <div className="mt-4 space-y-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 transition-all duration-300"
                                            onClick={() => handleUpdateStatus('Enroute to Pick up')}
                                        >
                                            Enroute to Pick up
                                        </button>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 transition-all duration-300"
                                            onClick={() => handleUpdateStatus('Picked Goods')}
                                        >
                                            Picked Goods
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
                                            onClick={handleDelivery}
                                        >
                                            Delivered
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={`text-center text-lg transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>No bookings available</p>
                )}
            </div>
        </div>
    );
};

export default Driver;