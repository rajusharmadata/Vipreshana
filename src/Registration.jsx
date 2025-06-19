import React, { useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { supabase, sendOTP, verifyOTP, signInWithGoogle } from './lib/supabase';
import { Eye, EyeOff, User, Mail, Phone, Shield, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        countryCode: '+91',
        role: 'user'
    });
    const [otpData, setOtpData] = useState({
        otp: '',
        isOtpSent: false,
        isOtpVerified: false,
        isLoading: false,
        method: 'both' // Always use both
    });

    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError('');
    };

    const handleOtpChange = (e) => {
        setOtpData({ ...otpData, otp: e.target.value });
    };

    const handleSendOTP = async () => {
        if (!formData.phone || formData.phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
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
            showNotification(`OTP sent successfully via ${otpData.method}! Check your phone.`, 'success');
        } else {
            setOtpData({ ...otpData, isLoading: false });
            setError(result.error || 'Failed to send OTP');
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpData.otp || otpData.otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setOtpData({ ...otpData, isLoading: true });
        const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
        
        const result = await verifyOTP(fullPhoneNumber, otpData.otp);
        
        if (result.success) {
            setOtpData({ 
                ...otpData, 
                isOtpVerified: true, 
                isLoading: false 
            });
            showNotification('Phone number verified successfully!', 'success');
            setError('');
        } else {
            setOtpData({ ...otpData, isLoading: false });
            setError(result.error || 'Invalid OTP');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await signInWithGoogle();
            
            if (error) throw error;
            
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Check if password matches confirm password
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        // Phone should be a 10-digit number
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            setIsLoading(false);
            return;
        }

        // Phone number should be verified
        if (!otpData.isOtpVerified) {
            setError('Please verify your phone number first');
            setIsLoading(false);
            return;
        }

        // If role is admin, email must be from the specific domain
        if (formData.role === 'admin' && !formData.email.endsWith('@svecw.edu.in')) {
            setError('Please enter a valid @svecw.edu.in email for admin registration.');
            setIsLoading(false);
            return;
        }

        try {
            // Sign up with Supabase
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                        phone: `${formData.countryCode}${formData.phone}`,
                        role: formData.role
                    }
                }
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            // Success! No need to call the backend API as well
            toast.success('Registration successful! Please check your email for verification.', {
                position: 'top-center',
                autoClose: 3000
            });
            
            console.log('Registration successful for:', formData.name);

            // Reset form
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                countryCode: '+91',
                role: 'user'
            });
            setOtpData({
                otp: '',
                isOtpSent: false,
                isOtpVerified: false,
                isLoading: false,
                method: 'both' // Always use both
            });

            // Redirect to login after successful registration
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Registration error:", err);
            setError('Registration failed: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'user': return <User className="w-4 h-4" />;
            case 'driver': return <span className="text-sm">🚗</span>;
            case 'admin': return <Shield className="w-4 h-4" />;
            default: return <User className="w-4 h-4" />;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'user': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'driver': return 'bg-green-100 text-green-800 border-green-200';
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
                    toast.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                </div>
            )}

            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            
            <div className="relative w-full max-w-6xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 lg:p-12">
                    
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-gray-600 text-sm mt-2">Join us and get started today</p>
                    </div>

                    
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-red-700 text-sm">{error}</span>
                        </div>
                    )}

                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <span className="text-lg">🔒</span>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <span className="text-lg">🔒</span>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </label>
                                <div className="flex">
                                    <select
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                        className="mr-2 p-3 border rounded-md w-20 bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="+91">+91</option>
                                        <option value="+1">+1</option>
                                        <option value="+44">+44</option>
                                        <option value="+86">+86</option>
                                        <option value="+81">+81</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        maxLength="10"
                                        className="flex-1 p-3 border rounded-md bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your phone number"
                                        disabled={otpData.isOtpVerified}
                                    />
                                </div>

                                {/* OTP Section */}
                                {formData.phone.length === 10 && !otpData.isOtpVerified && (
                                    <div className="mt-3 space-y-3">
                                        {!otpData.isOtpSent ? (
                                            <button
                                                type="button"
                                                onClick={handleSendOTP}
                                                disabled={otpData.isLoading}
                                                className={`w-full p-2 rounded-md text-sm ${
                                                    otpData.isLoading
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                                                }`}
                                            >
                                                {otpData.isLoading ? 'Sending OTP...' : 'Send OTP'}
                                            </button>
                                        ) : (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={otpData.otp}
                                                    onChange={handleOtpChange}
                                                    maxLength="6"
                                                    placeholder="Enter 6-digit OTP"
                                                    className="w-full p-2 border rounded-md text-center text-lg tracking-widest bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOTP}
                                                    disabled={otpData.otp.length !== 6 || otpData.isLoading}
                                                    className={`w-full p-2 rounded-md text-sm ${
                                                        otpData.otp.length !== 6 || otpData.isLoading
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-green-600 hover:bg-green-500 text-white'
                                                    }`}
                                                >
                                                    {otpData.isLoading ? 'Verifying...' : 'Verify OTP'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {otpData.isOtpVerified && (
                                    <div className="text-green-600 text-sm font-medium">
                                        ✅ Phone number verified successfully
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">⭐ Role</label>
                                    <div className="relative">
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
                                        >
                                            <option value="user">👤 Regular User</option>
                                            <option value="driver">🚗 Driver</option>
                                            <option value="admin">🛠️ Administrator</option>
                                        </select>
                                        <div className={`absolute right-12 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleBadgeColor(formData.role)}`}>
                                            {getRoleIcon(formData.role)}
                                            <span className="capitalize">{formData.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {formData.role === 'admin' && (
                            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
                                ⚠️ Admin registration requires a valid @svecw.edu.in email address
                            </div>
                        )}

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Create Account
                                </div>
                            )}
                        </button>
                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link 
                                    to="/login"
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;