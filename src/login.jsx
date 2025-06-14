import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from react-icons

const Login = () => {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://vipreshana-3.onrender.com/login', formData);
            const { redirectUrl, message } = response.data;

            // Store phone number in local storage
            localStorage.setItem('userPhone', formData.phone);

            // Display success toast message
            toast.success(`🎉 ${message}`, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                icon: "✅",
                style: {
                    backgroundColor: '#28a745',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    padding: '16px',
                },
                progressStyle: {
                    backgroundColor: '#fff'
                }
            });

            // Redirect after a delay based on user role
            setTimeout(() => {
                navigate(redirectUrl);
            }, 3000);
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('❌ Login failed! Please try again.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                style: {
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    padding: '16px',
                },
                progressStyle: {
                    backgroundColor: '#fff'
                }
            });
        }
    };

    const isDark = theme === 'dark';

    return (
        <div
            className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
                isDark ? 'brightness-75' : 'brightness-100'
            }`}
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
        >
            <div className={`absolute inset-0 ${isDark ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-60'} flex items-center justify-center transition-all duration-300`}>
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ${
                        isDark
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                            : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    }`}
                    aria-label="Toggle theme"
                >
                    {isDark ? '☀️' : '🌙'}
                </button>

                <div className={`p-10 rounded-lg shadow-lg w-96 transition-all duration-300 ${
                    isDark
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'bg-white text-gray-900'
                }`}>
                    <h1 className={`text-4xl font-bold text-center mb-2 transition-colors duration-300 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>Welcome Back!</h1>
                    <p className={`text-md text-center mb-6 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Please enter your credentials to login.</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="phone" className={`block text-sm font-medium transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>📞 Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                onChange={handleChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 transition-all duration-300 ${
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-30'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                                }`}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className={`block text-sm font-medium transition-colors duration-300 ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>🔒 Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                required
                                onChange={handleChange}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 transition-all duration-300 ${
                                    isDark
                                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-30'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                                }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-10 text-lg ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className={`w-full font-semibold py-2 rounded-lg transition-all duration-300 ${
                                isDark
                                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                        >
                            Login
                        </button>
                    </form>
                    <p className={`text-center text-sm mt-4 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Don't you have an account?{' '}
                        <Link to="/register" className={`font-semibold hover:underline transition-colors duration-300 ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                            Register
                        </Link>
                    </p>
                    <p className={`text-center text-sm mt-2 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        <Link to="/forgot-password" className={`font-semibold hover:underline transition-colors duration-300 ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
