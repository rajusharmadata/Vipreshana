import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase, sendOTP, verifyOTP, signInWithGoogle, signInWithEmail } from './lib/supabase';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({ 
    email: '', 
    phone: '', 
    countryCode: '+91',
    password: '' 
  });  
  const [otpData, setOtpData] = useState({
    otp: '',
    isOtpSent: false,
    isLoading: false,
    method: 'both' // Always use both
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => {
    setOtpData({ ...otpData, otp: e.target.value });
  };
  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setOtpData({ ...otpData, isLoading: true });
    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    
    const result = await sendOTP(fullPhoneNumber, otpData.method);
    
    if (result.success) {
      setOtpData({ 
        ...otpData, 
        isOtpSent: true, 
        isLoading: false 
      });
      toast.success(`OTP sent successfully via ${otpData.method}! Check your phone.`);
    } else {
      setOtpData({ ...otpData, isLoading: false });
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpData.otp || otpData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    
    const result = await verifyOTP(fullPhoneNumber, otpData.otp);
    
    if (result.success) {
      toast.success('Login successful!');
      localStorage.setItem('userPhone', formData.phone);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 2000);
    } else {
      setIsLoading(false);
      toast.error(result.error || 'Invalid OTP');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Starting Google OAuth flow...");
      const { success, data, error } = await signInWithGoogle();
      
      if (!success) {
        throw new Error(error);
      }
      
      toast.info("Redirecting to Google for login...", {
        position: "top-center",
        autoClose: 2000
      });
      
      // No need to redirect here, Supabase handles it
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(`Google login failed: ${error.message}`, {
        position: "top-center"
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (loginMethod === 'email') {        
        // Email/Password login using our new direct function
        console.log("Attempting login with email:", formData.email);
        const { success, user, error } = await signInWithEmail(
          formData.email,
          formData.password
        );

        if (!success) {
          throw new Error(error || "Login failed");
        }

        toast.success('🎉 Login successful!', {
          toastId: 'login-success',
          position: 'top-center',
          autoClose: 3000,
          style: {
            backgroundColor: '#28a745',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '12px',
            textAlign: 'center',
          },
        });

        console.log("Login successful - redirecting to dashboard");
        localStorage.setItem('userEmail', formData.email);
        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 3000);
      } else {
        // Phone login - just send OTP, actual login happens in handleVerifyOTP
        if (!otpData.isOtpSent) {
          await handleSendOTP();
        } else {
          await handleVerifyOTP();
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);  // Add detailed error logging
      if (!toast.isActive('login-error')) {
        toast.error(`⚠️ Login failed: ${error.message || 'Please try again'}`, {
          toastId: 'login-error',
          position: 'top-center',
          autoClose: 3000,
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

  const isDisabled = loginMethod === 'email' 
    ? (!formData.email || !formData.password) 
    : (!formData.phone);

  return (
    <div
      className={`relative h-screen bg-cover bg-center transition-all duration-300 ${
        isDark ? 'brightness-75' : 'brightness-100'
      }`}
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/background-realistic-abstract-technology-particle_23-2148431735.jpg')",
      }}
    >
      <div
        className={`absolute inset-0 ${
          isDark ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-60'
        } flex items-center justify-center`}
      >
        <button
          onClick={toggleTheme}
          className={`absolute top-6 right-6 p-3 rounded-full ${
            isDark
              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        <div
          className={`p-10 rounded-2xl shadow-2xl w-96 ${
            isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900'
          }`}
        >          <h1
            className={`text-4xl font-bold text-center mb-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            Welcome Back!
          </h1>
          <p
            className={`text-md text-center mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Please enter your credentials to login.
          </p>

          {/* Login Method Toggle */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'email'
                  ? isDark
                    ? 'bg-indigo-600 text-white'
                    : 'bg-blue-600 text-white'
                  : isDark
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📧 Email Login
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'phone'
                  ? isDark
                    ? 'bg-indigo-600 text-white'
                    : 'bg-blue-600 text-white'
                  : isDark
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📱 Phone Login
            </button>
          </div>          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'email' ? (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    � Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-xl shadow-sm p-3 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    🔒 Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    onChange={handleChange}
                    className={`mt-1 block w-full border rounded-xl shadow-sm p-3 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-10 text-lg ${
                      isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'
                    }`}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="phone"
                    className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    📞 Phone
                  </label>
                  <div className="flex mt-1">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className={`mr-2 p-3 border rounded-xl w-20 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                      }`}
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+86">+86</option>
                      <option value="+81">+81</option>
                    </select>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      onChange={handleChange}
                      maxLength="10"
                      className={`flex-1 border rounded-xl shadow-sm p-3 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                      }`}
                      placeholder="Enter your phone number"
                    />                  </div>
                </div>

                {/* OTP Section for Phone Login */}
                {formData.phone.length === 10 && otpData.isOtpSent && (
                  <div>
                    <label
                      htmlFor="otp"
                      className={`block text-sm font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      🔢 OTP Code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otpData.otp}
                      onChange={handleOtpChange}
                      maxLength="6"
                      className={`mt-1 block w-full border rounded-xl shadow-sm p-3 text-center text-lg tracking-widest ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring focus:ring-blue-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring focus:ring-blue-200'
                      }`}
                    />
                  </div>
                )}
              </>
            )}            <button
              type="submit"
              disabled={isDisabled || isLoading}
              className={`w-full font-semibold py-3 rounded-xl ${
                isDisabled || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isDark
                  ? 'bg-blue-500 hover:bg-blue-400 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isLoading 
                ? 'Please wait...' 
                : loginMethod === 'phone' 
                  ? (otpData.isOtpSent ? 'Verify OTP' : 'Send OTP')
                  : 'Login'
              }
            </button>

            <div className="flex items-center my-4">
              <div className={`flex-1 border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
              <span className={`px-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>or continue with</span>
              <div className={`flex-1 border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                  isDark
                    ? 'bg-white text-gray-800 hover:bg-gray-100'
                    : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                } shadow-md hover:shadow-lg`}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
          </form>

          <p
            className={`text-center text-sm mt-4 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              className={`font-semibold hover:underline ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              Register
            </Link>
          </p>
          <p
            className={`text-center text-sm mt-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <Link
              to="/forgot-password"
              className={`font-semibold hover:underline ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
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