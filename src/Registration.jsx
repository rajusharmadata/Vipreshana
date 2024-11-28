import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user' // Default role
    });

    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if password matches confirm password
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Check if the user is registering as an admin
        if (formData.role === 'admin' && !formData.email.endsWith('@atlan.com')) {
            toast.error('Please enter a valid email for admin registration.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: formData.role // Send role data to backend
            });
            toast.success(response.data.message); // Show success toast
            navigate('/login'); // Redirect to login page
        } catch (err) {
            setError('Registration failed: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
        >
            <div className="bg-white rounded-lg shadow-lg p-10 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-5">Create an Account</h1>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">👤 Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">📧 Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">🔒 Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">🔒 Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Confirm your password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">📞 Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Enter your phone number"
                        />
                    </div>
                    {/* Role dropdown with icons */}
                    <div>
                        <label className="block text-sm font-medium">⭐ Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            <option value="user">👤 User</option>
                            <option value="driver">🚗 Driver</option>
                            <option value="admin">🛠️ Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-500 transition duration-300"
                    >
                        Register
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer /> {/* Add ToastContainer for toast notifications */}
        </div>
    );
};

export default RegistrationForm;
