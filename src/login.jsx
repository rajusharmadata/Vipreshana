// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
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

    return (
        <div
            className="relative h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <div className="bg-white p-10 rounded-lg shadow-lg w-96">
                    <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">Welcome Back!</h1>
                    <p className="text-md text-gray-600 text-center mb-6">Please enter your credentials to login.</p>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">📞 Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">🔒 Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        Don't you have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Register
                        </Link>
                    </p>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">
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
