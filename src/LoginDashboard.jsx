import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';


const LoginDashboard = () => {
    const navigate = useNavigate(); 
    const { theme, toggleTheme } = useTheme(); 
    return (
        <div className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : ''
        }`} style={{ 
            backgroundImage: theme === 'light' 
                ? "url('https://media.istockphoto.com/id/174870355/photo/visual-representation-of-transportation-modes.jpg?s=612x612&w=0&k=20&c=IjL0uThZwQHau2TKnBseS_lAFRxVObjmN7o_GRuUB0E=')" 
                : "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className={`absolute top-4 left-4 p-3 rounded-full transition-all duration-300 ${
                    theme === 'dark' 
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                        : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                } shadow-lg`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Dark overlay with theme-aware opacity */}
            <div className={`absolute inset-0 transition-all duration-300 ${
                theme === 'dark' ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-40'
            }`}></div>

            {/* Navigation Buttons */}
            <div className="absolute top-4 right-8 flex space-x-4 z-10">
                <button
                    onClick={() => navigate('/bookings')}
                    className={`px-6 py-3 font-semibold rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                        theme === 'dark' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800'
                    }`}
                >
                    List Bookings
                </button>
                
                <button
                    onClick={() => navigate('/user')}
                    className={`px-6 py-3 font-semibold rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${
                        theme === 'dark' 
                            ? 'bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900' 
                            : 'bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800'
                    }`}
                >
                    New Bookings
                </button>
            </div>

            {/* Optional: Add a welcome message or logo */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className={`text-center p-8 rounded-lg transition-all duration-300 ${
                    theme === 'dark' 
                        ? 'bg-gray-800 bg-opacity-90 border border-gray-700' 
                        : 'bg-white bg-opacity-90'
                } shadow-2xl`}>
                    <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                        Welcome to Dashboard
                    </h1>
                    <p className={`text-xl transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Manage your bookings and transportation needs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginDashboard;