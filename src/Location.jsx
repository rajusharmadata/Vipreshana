import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define custom location icon
const locationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', // You can use any location pin image here
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 30], // Position the icon relative to its size
    popupAnchor: [0, -30], // Position of the popup relative to the icon
});

const UserLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ latitude, longitude });
                        await fetchAddress(latitude, longitude);
                    },
                    (err) => {
                        console.error('Geolocation error:', err);
                        setError(err.message);
                    },
                    {
                        enableHighAccuracy: true,
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        const fetchAddress = async (latitude, longitude) => {
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                setAddress(response.data.display_name || 'Address not found');
            } catch (error) {
                console.error('Error fetching address:', error);
                setError('Could not fetch address');
            }
        };

        fetchLocation();
    }, []);

    if (error) return <div className="text-red-500 text-center mt-6">Error: {error}</div>;
    if (!location) return <div className="text-gray-500 text-center mt-6">Loading...</div>;

    return (
        <div
            style={{
                backgroundImage: 'url(https://t3.ftcdn.net/jpg/07/96/85/70/240_F_796857006_a8aZyOVtPFaEPbbqGugGq88kkDlSLO1B.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px', // Optional, to give some space around the container
            }}
        >
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 border-4 border-black">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">Driver Location</h1>
                    <div className="mt-4">
                        <p className="text-lg text-gray-700"><strong>Latitude:</strong> {location.latitude}</p>
                        <p className="text-lg text-gray-700"><strong>Longitude:</strong> {location.longitude}</p>
                        <p className="text-lg text-gray-700"><strong>Address:</strong> {address}</p>
                    </div>
                </div>

                <div className="rounded-lg shadow-md overflow-hidden">
                    <MapContainer 
                        center={[location.latitude, location.longitude]} 
                        zoom={13} 
                        style={{ height: '400px', width: '100%' }} 
                        className="rounded-lg">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker 
                            position={[location.latitude, location.longitude]} 
                            icon={locationIcon} // Use the custom icon
                        >
                            <Popup>
                                You are here! <br /> {address}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default UserLocation;
