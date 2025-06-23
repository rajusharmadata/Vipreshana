import React, { useState, useEffect } from 'react';
import { Phone, ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const API_BASE_URL = 'https://vipreshana-3.onrender.com';

const OTPVerification = ({ phone, onVerificationSuccess, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Send OTP on component mount
  useEffect(() => {
    sendOTP();
  }, []);

  const sendOTP = async () => {
    setIsResending(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/send-otp`, { phone });
      
      if (response.data.success) {
        toast.success('OTP sent successfully!');
        setTimeLeft(600); // 10 minutes
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(response.data.error || 'Failed to send OTP');
        toast.error(response.data.error || 'Failed to send OTP');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send OTP';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }

    setError('');
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-otp`, {
        phone,
        otp: otpString
      });

      if (response.data.success) {
        setIsVerified(true);
        toast.success('Phone number verified successfully!');
        setTimeout(() => {
          onVerificationSuccess();
        }, 1000);
      } else {
        setError(response.data.error || 'Invalid OTP');
        toast.error(response.data.error || 'Invalid OTP');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to verify OTP';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full max-w-md mx-auto transition-all duration-300 ${
      isDark ? 'text-white' : 'text-gray-900'
    }`}>
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Verify Your Phone</h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-2`}>
          We've sent a verification code to
        </p>
        <p className="font-semibold text-lg">{phone}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-300 mt-0.5" />
          <span className="text-red-700 dark:text-red-200 text-sm">{error}</span>
        </div>
      )}

      {isVerified && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300 mt-0.5" />
          <span className="text-green-700 dark:text-green-200 text-sm">Phone number verified successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className={`block mb-3 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Enter 6-digit verification code
          </label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                disabled={isVerified}
                className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } ${isVerified ? 'border-green-500 bg-green-50 dark:bg-green-900' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Timer and Resend */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Resend code in {formatTime(timeLeft)}
            </p>
          ) : (
            <button
              onClick={sendOTP}
              disabled={isResending}
              className={`text-sm font-medium transition-colors duration-200 ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              } ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isResending ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Resend verification code'
              )}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={verifyOTP}
            disabled={isLoading || isVerified || otp.join('').length !== 6}
            className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 ${
              isLoading || isVerified || otp.join('').length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : isDark
                ? 'bg-green-500 hover:bg-green-400 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : isVerified ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Verified
              </div>
            ) : (
              'Verify Phone Number'
            )}
          </button>

          <button
            onClick={onBack}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold border transition-all duration-200 ${
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Registration
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 