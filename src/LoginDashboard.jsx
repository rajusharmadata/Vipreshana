import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { Package, Plus, User, Truck, MapPin, Clock } from 'lucide-react';

const LoginDashboard = () => {
    const navigate = useNavigate(); 
    
    const [fallbackTheme, setFallbackTheme] = useState('light');
    
    let theme, toggleTheme;
    try {
        const themeContext = useTheme();
        theme = themeContext.theme;
        toggleTheme = themeContext.toggleTheme;
    } catch (error) {
        console.warn('ThemeContext not available, using fallback:', error);
        theme = fallbackTheme;
        toggleTheme = () => {
            setFallbackTheme(prev => prev === 'light' ? 'dark' : 'light');
        };
    }

    const handleBookingsClick = () => {
        console.log('Navigating to bookings...');
        try {
            navigate('/bookings');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleNewBookingsClick = () => {
        console.log('Navigating to user...');
        try {
            navigate('/user');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleThemeToggle = () => {
        console.log('Theme toggle clicked, current theme:', theme);
        toggleTheme();
    };

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-all duration-300 ${
            isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            <button
                onClick={handleThemeToggle}
                className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 z-20 shadow-lg ${
                    isDark 
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                        : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                } hover:shadow-xl hover:scale-110`}
                aria-label="Toggle theme"
            >
                {isDark ? '☀️' : '🌙'}
            </button>

            <div 
                className="relative h-80 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhbnNwb3J0YXRpb24lMjBsb2dpc3RpY3N8ZW58MHx8MHx8fDA%3D)'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
                <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-6">
                    <div>
                        <h1 className="text-5xl font-bold mb-4">Transportation Hub</h1>
                        <p className="text-xl opacity-90">Your complete logistics management solution</p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-6 rounded-full" />
                    </div>
                </div>
            </div>

            <div className="p-6 -mt-20 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className={`p-6 rounded-2xl shadow-xl border-2 transform hover:scale-105 transition-all duration-300 ${
                            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-blue-100 text-gray-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Quick Access
                                    </p>
                                    <p className="text-lg font-bold mt-2">Dashboard</p>
                                </div>
                                <div className="p-3 bg-blue-500 rounded-full">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-6 rounded-2xl shadow-xl border-2 transform hover:scale-105 transition-all duration-300 ${
                            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-green-100 text-gray-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Manage
                                    </p>
                                    <p className="text-lg font-bold mt-2">Bookings</p>
                                </div>
                                <div className="p-3 bg-green-500 rounded-full">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-6 rounded-2xl shadow-xl border-2 transform hover:scale-105 transition-all duration-300 ${
                            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-purple-100 text-gray-800'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Create New
                                    </p>
                                    <p className="text-lg font-bold mt-2">Request</p>
                                </div>
                                <div className="p-3 bg-purple-500 rounded-full">
                                    <Plus className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className={`rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700 text-white' 
                                : 'bg-white border-gray-200 text-gray-800'
                        }`}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">View All Bookings</h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Access and manage all your transportation requests
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm">Track delivery status</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">View pickup & delivery locations</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm">Monitor vehicle assignments</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleBookingsClick}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center gap-2"
                                >
                                    <Package className="w-5 h-5" />
                                    View All Bookings
                                </button>
                            </div>
                        </div>

                        <div className={`rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700 text-white' 
                                : 'bg-white border-gray-200 text-gray-800'
                        }`}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Create New Booking</h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Schedule a new transportation request quickly
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                                        <Plus className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">Set pickup & delivery points</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm">Choose vehicle type</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm">Get instant cost estimates</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleNewBookingsClick}
                                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create New Booking
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`mt-12 p-8 rounded-2xl shadow-xl border-2 ${
                        isDark 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-200 text-gray-800'
                    }`}>
                        <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Our Platform?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Clock className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-semibold mb-2">Real-time Tracking</h4>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Monitor your deliveries in real-time with live updates
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Truck className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-semibold mb-2">Flexible Fleet</h4>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Choose from various vehicle types for any delivery size
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="font-semibold mb-2">Wide Coverage</h4>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Extensive delivery network covering all major areas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginDashboard;