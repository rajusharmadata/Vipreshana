import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase, signInWithGoogle } from './lib/supabase';
import { Phone, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ 
    phone: '', 
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For testing purposes
      if (formData.phone === '123456' && formData.password === '123456') {
        // Test user login
        localStorage.setItem('currentUser', JSON.stringify({
          id: 'test-user',
          name: 'Test User',
          phone: '123456',
          role: 'user'
        }));
        
        toast.success('Login successful!', {
          position: 'top-center',
          autoClose: 1500
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return;
      }
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching phone
      const user = users.find(u => u.phone === formData.phone);
      
      if (!user) {
        setError('No account found with this phone number');
        setIsLoading(false);
        return;
      }
      
      // Check password
      if (user.password !== formData.password) {
        setError('Invalid password');
        setIsLoading(false);
        return;
      }
      
      // Login successful
      const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      };
      
      // Store user in localStorage (but not the password)
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 1500
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { success, data, error } = await signInWithGoogle();
      
      if (!success) throw new Error(error);
      
      toast.success('Signing in with Google...', {
        position: 'top-center',
        autoClose: 1500
      });
      
      // OAuth will handle the redirect to dashboard now
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(`Google sign-in failed: ${error.message || 'Please try again'}`, {
        position: 'top-center'
      });
      setIsLoading(false);
    }
  };

  const isDisabled = !formData.phone || !formData.password;

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sign in to your account
          </h2>
          <p className={`mt-2 text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link to="/register" className={`font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
              Register here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`p-3 rounded-md ${isDark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                    isDark
                      ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                      : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Phone number"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                    isDark
                      ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500'
                      : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className={isDark ? 'text-gray-300' : 'text-gray-500'} />
                  ) : (
                    <FaEye className={isDark ? 'text-gray-300' : 'text-gray-500'} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isDisabled || isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDark
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className={`w-full flex items-center justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${
                isDark
                  ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.54-7.752 9.71-11.666l-9.71 0.001z"
                  fill="#FFC107"
                />
                <path
                  d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.54-7.752 9.71-11.666l-9.71 0.001z"
                  fill="#FF3D00"
                />
                <path
                  d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.54-7.752 9.71-11.666l-9.71 0.001z"
                  fill="#4CAF50"
                />
                <path
                  d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.54-7.752 9.71-11.666l-9.71 0.001z"
                  fill="#1976D2"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Login;