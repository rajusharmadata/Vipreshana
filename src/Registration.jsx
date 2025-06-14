import React, { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons from react-icons

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user'
    });

    const [error, setError] = useState('');
    const [notification, setNotification] = useState(null);
    const { theme, toggleTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Name should not be empty and must only contain letters and spaces
        if (!formData.name.trim() || !/^[a-zA-Z\s]+$/.test(formData.name)) {
            setError('Please enter a valid name (letters and spaces only)');
            return;
        }

        // Email should be in valid format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password should be at least 6 characters
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Confirm password should match password
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Phone should be a 10-digit number
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        // If role is admin, email must be from the specific domain
        if (formData.role === 'admin' && !formData.email.endsWith('@svecw.edu.in')) {
            showNotification('Please enter a valid email for admin registration.', 'error');
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showNotification('Registration successful! Please login.', 'success');
            console.log('Registration successful for:', formData.name);

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                role: 'user'
            });
        } catch (err) {
            setError('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    const isDark = theme === 'dark';

    return (
        <div
            className={`flex items-center justify-center min-h-screen bg-cover bg-center transition-all duration-300 ${
                isDark ? 'brightness-75' : 'brightness-100'
            }`}
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?size=626&ext=jpg')" }}
        >
            {/* Notification */}
            {notification && (
                <div
                    className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
                        notification.type === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                    }`}
                >
                    {notification.message}
                </div>
            )}

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

            <div className={`rounded-lg shadow-lg p-10 max-w-md w-full transition-all duration-300 ${
                isDark
                    ? 'bg-gray-800 text-white border border-gray-700'
                    : 'bg-white text-gray-900'
            }`}>
                <h1 className={`text-3xl font-bold text-center mb-5 transition-colors duration-300 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>Create an Account</h1>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>👤 Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>📧 Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="relative">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>🔒 Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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

                    <div className="relative">
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>🔒 Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Confirm your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute right-3 top-10 text-lg ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`}
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>📞 Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>⭐ Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className={`block w-full p-3 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="user">👤 User</option>
                            <option value="driver">🚗 Driver</option>
                            <option value="admin">🛠️ Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className={`w-full p-3 rounded-md ${isDark ? 'bg-blue-500 hover:bg-blue-400 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                    >
                        Register
                    </button>

                    <p className={`text-center text-sm mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Already have an account?{' '}
                        <Link to="/login" className={`font-semibold hover:underline bg-transparent border-none cursor-pointer ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
