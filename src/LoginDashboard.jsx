import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginDashboard = () => {
    const navigate = useNavigate(); // Hook to handle navigation

    return (
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://media.istockphoto.com/id/174870355/photo/visual-representation-of-transportation-modes.jpg?s=612x612&w=0&k=20&c=IjL0uThZwQHau2TKnBseS_lAFRxVObjmN7o_GRuUB0E=')" }}>
            <div className="absolute top-4 right-8 flex space-x-4">
                {/* Add the onClick handler for List Bookings */}
                <button
                    onClick={() => navigate('/bookings')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-md shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    List Bookings
                </button>
                
                <button
                    onClick={() => navigate('/user')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-md shadow-md hover:from-green-600 hover:to-green-800 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                    New Bookings
                </button>
            </div>
        </div>
    );
};

export default LoginDashboard;
