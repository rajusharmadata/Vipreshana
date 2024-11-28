import React, { useState, useEffect } from 'react';
import Toastify from 'toastify-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "toastify-js/src/toastify.css"; // Import Toastify CSS

const User = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [estimatedCost, setEstimatedCost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false); // New state for spinner

    const API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const calculateCost = async () => {
            if (pickupLocation && dropoffLocation && vehicleType) {
                setCalculating(true); // Start showing spinner
                try {
                    const distance = await calculateDistance(pickupLocation, dropoffLocation);
                    const cost = getBaseCost(vehicleType) * distance;
                    setEstimatedCost(cost);
                } catch (error) {
                    setEstimatedCost(null);
                } finally {
                    setCalculating(false); // Stop showing spinner
                }
            } else {
                setEstimatedCost(null);
            }
        };

        calculateCost();
    }, [pickupLocation, dropoffLocation, vehicleType]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (estimatedCost !== null) {
                const response = await axios.post('http://localhost:5000/api/bookings', {
                    name,
                    phone,
                    pickupLocation,
                    dropoffLocation,
                    vehicleType,
                    estimatedCost,
                });

                if (response.status === 200) {
                    showToast(`Thanks for booking! 💛`, 'success');
                    resetForm();
                    navigate('/LoginDashboard'); // Redirect to LoginDashboard
                } else {
                    showToast('Error: Unable to save booking.', 'error');
                }
            } else {
                showToast('Error: Please select valid locations and vehicle type.', 'error');
            }
        } catch (error) {
            showToast(`Error: ${error.response ? error.response.data.message : error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const calculateDistance = async (origin, destination) => {
        const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=`;
        const originEncoded = encodeURIComponent(origin);
        const destinationEncoded = encodeURIComponent(destination);

        const originResponse = await axios.get(`${geocodeUrl}${originEncoded}&key=${API_KEY}`);
        const destinationResponse = await axios.get(`${geocodeUrl}${destinationEncoded}&key=${API_KEY}`);

        if (originResponse.data.results.length > 0 && destinationResponse.data.results.length > 0) {
            const originCoords = originResponse.data.results[0].geometry;
            const destinationCoords = destinationResponse.data.results[0].geometry;

            const distance = haversineDistance(
                originCoords.lat, originCoords.lng,
                destinationCoords.lat, destinationCoords.lng
            );
            return distance;
        } else {
            throw new Error("Could not calculate distance, please check your inputs.");
        }
    };

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const getBaseCost = (vehicleType) => {
        const costMap = {
            Car: 10,
            Van: 15,
            Bus: 20
        };
        return costMap[vehicleType] || 10;
    };

    const showToast = (message, type) => {
        const bgColor = type === 'success' ? "#4caf50" : "#f44336"; 
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: 'right',
            style: {
                background: bgColor,
            },
        }).showToast();
    };

    const resetForm = () => {
        setName('');
        setPhone('');
        setPickupLocation('');
        setDropoffLocation('');
        setVehicleType('');
        setEstimatedCost(null);
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center flex items-center justify-center p-5"
            style={{ 
                backgroundImage: `url('https://images.pexels.com/photos/681335/pexels-photo-681335.jpeg?auto=compress&cs=tinysrgb&w=600')`
            }}
        >
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-10 w-full max-w-lg">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">Book Your Vehicle</h1>
                <form onSubmit={handleBooking}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="pickupLocation" className="block text-gray-700">Pickup Location</label>
                        <input
                            type="text"
                            id="pickupLocation"
                            name="pickupLocation"
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dropoffLocation" className="block text-gray-700">Dropoff Location</label>
                        <input
                            type="text"
                            id="dropoffLocation"
                            name="dropoffLocation"
                            value={dropoffLocation}
                            onChange={(e) => setDropoffLocation(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="vehicleType" className="block text-gray-700">Vehicle Type</label>
                        <select
                            id="vehicleType"
                            name="vehicleType"
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="">Select Vehicle Type</option>
                            <option value="Car">Car</option>
                            <option value="Van">Van</option>
                            <option value="Bus">Bus</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="estimatedCost" className="block text-gray-700">Estimated Cost (₹)</label>
                        <input
                            type="text"
                            id="estimatedCost"
                            name="estimatedCost"
                            value={estimatedCost !== null ? estimatedCost : ''}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || calculating}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        {loading ? 'Booking...' : 'Book Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default User;
