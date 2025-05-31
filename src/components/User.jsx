import React, { useState, useEffect, useCallback } from 'react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

const cityCoordinates = {
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getBaseCost = (vehicleType) => {
  const costMap = {
    Car: 10,
    Van: 15,
    Bus: 20,
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

const User = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(Object.keys(cityCoordinates));
  }, []);

  // Debounced calculation function which accepts current inputs as arguments
  const calculateCost = useCallback((pickup, dropoff, vehicle) => {
    if (!pickup || !dropoff || !vehicle) {
      setEstimatedCost(null);
      return;
    }

    setCalculating(true);
    try {
      const pickupCoords = cityCoordinates[pickup];
      const dropoffCoords = cityCoordinates[dropoff];

      if (!pickupCoords || !dropoffCoords) {
        throw new Error("Invalid city locations");
      }

      const distance = haversineDistance(
        pickupCoords.lat,
        pickupCoords.lon,
        dropoffCoords.lat,
        dropoffCoords.lon
      );

      const cost = Math.round(getBaseCost(vehicle) * distance);
      setEstimatedCost(cost);
    } catch (error) {
      setEstimatedCost(null);
      showToast("Failed to estimate cost. Check locations.", "error");
    } finally {
      setCalculating(false);
    }
  }, []);

  // Create debounced version of calculateCost, stable across renders
  const debouncedCalculateCost = useCallback(
    debounce((pickup, dropoff, vehicle) => {
      calculateCost(pickup, dropoff, vehicle);
    }, 700),
    [calculateCost]
  );

  // Call debounced calculate on changes
  useEffect(() => {
    debouncedCalculateCost(pickupLocation, dropoffLocation, vehicleType);
  }, [pickupLocation, dropoffLocation, vehicleType, debouncedCalculateCost]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setPickupLocation('');
    setDropoffLocation('');
    setVehicleType('');
    setEstimatedCost(null);
  };
const handleBooking = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (estimatedCost !== null) {
      const response = await fetch('https://vipreshana-3.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          pickupLocation,
          dropoffLocation,
          vehicleType,
          estimatedCost,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save booking');
      }

      showToast(`Thanks for booking! 💛`, 'success');
      resetForm();
    } else {
      showToast('Error: Please select valid locations and vehicle type.', 'error');
    }
  } catch (error) {
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-5"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/681335/pexels-photo-681335.jpeg?auto=compress&cs=tinysrgb&w=600')`,
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pickupLocation" className="block text-gray-700">Pickup Location</label>
            <select
              id="pickupLocation"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Pickup Location</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="dropoffLocation" className="block text-gray-700">Dropoff Location</label>
            <select
              id="dropoffLocation"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select Dropoff Location</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-gray-700">Vehicle Type</label>
            <select
              id="vehicleType"
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
            {calculating ? (
              <div className="text-center text-blue-500">Calculating Cost...</div>
            ) : (
              <div className="text-center font-semibold text-xl text-green-600">
                Estimated Cost: ₹{estimatedCost !== null ? estimatedCost : 0}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
              disabled={loading || calculating}
            >
              {loading ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default User;
