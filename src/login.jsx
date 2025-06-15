import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('https://vipreshana-3.onrender.com/login', formData);
      const { redirectUrl, message } = response.data;

      localStorage.setItem('userPhone', formData.phone);

      toast.success(`🎉 ${message}`, {
        toastId: 'login-success',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        style: {
          backgroundColor: '#28a745',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      });

      setTimeout(() => {
        setIsLoading(false);
        navigate(redirectUrl);
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      if (!toast.isActive('login-error')) {
        toast.error('⚠️ Login failed! Please try again.', {
          toastId: 'login-error',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          style: {
            backgroundColor: '#e60023',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '12px',
            textAlign: 'center',
          },
        });
      }
    }
  };

  const isDisabled = !formData.phone || !formData.password;

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">
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
                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3"
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
                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={isDisabled || isLoading}
              className={`w-full text-white font-semibold py-3 rounded-xl transition duration-300 ${isDisabled || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
                }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
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
