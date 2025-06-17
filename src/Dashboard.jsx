import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext'; 

const Dashboard = () => {
    const navigate = useNavigate(); 
    const { theme, toggleTheme } = useTheme(); 

    const handleBookingsClick = () => {
        navigate('/bookings');
    };


    const handleNewBookingsClick = () => {
        navigate('/user');
    };

                  {/* How It Works Button */}
                  <a
                    href="/how-it-works"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-500 hover:to-blue-500 "
                    style={{textDecoration: 'none'}}
                  >
                    How It Works
                  </a>

                  {/* Contact Button  */}
                  <a
                    href="/contact"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-500 hover:to-blue-500 "
                    style={{textDecoration: 'none'}}
                  >
                    Contact
                  </a>


    const handleThemeToggle = () => {
        toggleTheme();
    };

    return (
        <div className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
            theme === 'dark' ? 'bg-gray-900' : ''
        }`} style={{ 
            backgroundImage: theme === 'light' 
                ? "url('https://media.istockphoto.com/id/174870355/photo/visual-representation-of-transportation-modes.jpg')" 
                : "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80')"
        }}>
            <button onClick={handleThemeToggle}
                className={`absolute top-4 left-4 p-3 rounded-full z-30 border-2 ${
                    theme === 'dark' 
                        ? 'bg-yellow-400 text-gray-900 border-yellow-300' 
                        : 'bg-gray-800 text-yellow-400 border-gray-600'
                }`}>
                {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <div className={`absolute inset-0 ${
                theme === 'dark' ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-40'
            }`}></div>

            <div className="absolute top-4 right-8 flex gap-4 z-20">
                <button onClick={handleBookingsClick}
                    className={`px-8 py-4 rounded-lg ${
                        theme === 'dark' 
                            ? 'bg-blue-800 text-white' 
                            : 'bg-blue-500 text-white'
                    }`}>
                    📋 View All Bookings
                </button>

                <button onClick={handleNewBookingsClick}
                    className={`px-8 py-4 rounded-lg ${
                        theme === 'dark' 
                            ? 'bg-green-800 text-white' 
                            : 'bg-green-500 text-white'
                    }`}>
                    ➕ Create New Booking
                </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className={`text-center p-8 rounded-lg ${
                    theme === 'dark' 
                        ? 'bg-gray-800 bg-opacity-90' 
                        : 'bg-white bg-opacity-90'
                }`}>
                    <h1 className={`text-5xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                        Welcome to Dashboard
                    </h1>
                    <p className={`text-xl ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Manage your bookings and transportation needs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
