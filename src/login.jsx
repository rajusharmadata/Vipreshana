import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTheme } from './context/ThemeContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { signInWithGoogle } from './lib/supabase'
import Navbar from './components/Navbar'
import PageMeta from './components/Pagemeta'
import AuthRequired from './components/AuthRequired'
import LiveBackgroundDark from './components/livebackground/LiveBackgroundDark'
import LiveBackgroundLight from './components/livebackground/LiveBackgroundLight'
import { FcGoogle } from 'react-icons/fc'

const API_BASE_URL = 'https://vipreshana-3.onrender.com'

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const cleanUrlOfTokens = () => {
    const currentUrl = window.location.toString()
    const hasSensitiveData =
      currentUrl.includes('access_token') ||
      currentUrl.includes('refresh_token') ||
      currentUrl.includes('id_token') ||
      currentUrl.includes('token=') ||
      currentUrl.includes('authorization=') ||
      currentUrl.includes('auth=')

    if (window.location.pathname.includes('/auth/')) {
      window.history.replaceState(null, document.title, '/logindashboard')
      return
    }

    if (hasSensitiveData || window.location.hash || window.location.search) {
      window.history.replaceState(null, document.title, window.location.pathname)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    cleanUrlOfTokens()

    const validIndianNumber = /^[6-9]\d{9}$/
    const allowedTestPhones = [
      '4444444444',
      '1212122121',
      '1234567890',
      '0987654321',
    ]

    if (
      !validIndianNumber.test(formData.phone) &&
      !allowedTestPhones.includes(formData.phone)
    ) {
      toast.error('⚠️ Enter a valid phone number')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, formData, {
        withCredentials: true,
      })

      const { user, message } = response.data

      if (user) {
        const safeUserData = {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
        }

        localStorage.removeItem('user')
        localStorage.setItem('user', JSON.stringify(safeUserData))
        window.dispatchEvent(new Event('storage'))
        window.dispatchEvent(
          new CustomEvent('authChange', {
            detail: { isAuthenticated: true, user: safeUserData },
          })
        )
        window.dispatchEvent(new Event('login'))

        toast.success(`🎉 ${message}`, {
          toastId: 'login-success',
          position: 'top-center',
          autoClose: 1500,
          style: {
            backgroundColor: '#28a745',
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '12px',
            textAlign: 'center',
          },
        })

        setTimeout(() => {
          setIsLoading(false)
          cleanUrlOfTokens()

          // 👇 Route based on credentials
          let redirectPath = '/logindashboard'
          if (formData.phone === '1234567890' && formData.password === '1212') {
            redirectPath = '/driver'
          } else if (
            formData.phone === '0987654321' &&
            formData.password === '1212'
          ) {
            redirectPath = '/admin'
          } else {
            redirectPath = location.state?.from || '/logindashboard'
          }

          navigate(redirectPath, { replace: true })
        }, 1500)
      }
    } catch (error) {
      setIsLoading(false)
      toast.error('⚠️ Login failed! Please try again.', {
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
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      cleanUrlOfTokens()

      toast.success('Redirecting to Google sign-in...', {
        position: 'top-center',
        autoClose: 1500,
        style: {
          backgroundColor: '#28a745',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      })

      const redirectPath = location.state?.from || '/logindashboard'
      sessionStorage.setItem('auth_redirect', redirectPath)

      const { success, error } = await signInWithGoogle()
      if (!success) throw new Error(error)
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error(`Google sign-in failed: ${error.message || 'Please try again'}`, {
        position: 'top-center',
        style: {
          backgroundColor: '#e60023',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '12px',
          textAlign: 'center',
        },
      })
      setIsLoading(false)
    }
  }

  const isDisabled = !formData.phone || !formData.password
  const redirectFrom = location.state?.from

  return (
    <>
      <PageMeta />
      <Navbar />
      {redirectFrom && <AuthRequired redirectPath={redirectFrom} />}

      <div
        className={`relative min-h-screen bg-cover bg-center transition-all duration-300 ${
          isDark ? 'brightness-75' : 'brightness-100'
        }`}
      >
        <div className="absolute inset-0 w-full h-full z-0">
          {isDark ? <LiveBackgroundDark /> : <LiveBackgroundLight />}
        </div>

        <div className="relative z-20 min-h-screen flex flex-col lg:flex-row">
          {/* Left Section */}
          <div className="flex flex-col justify-center items-center lg:items-start w-full lg:w-1/2 px-8 py-16 lg:pl-24">
            <img
              src="/logo.png"
              alt="Vipreshana Logo"
              className="w-32 h-32 mb-6 drop-shadow-lg animate-bounce-slow"
            />
            <h2
              className={`text-4xl font-extrabold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Welcome to Vipreshana
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your trusted logistics partner.
              <br />
              Sign in to continue!
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-1 flex-col items-center justify-center w-full lg:w-1/2 px-4 py-16 lg:mt-24 mt-8">
            <div
              className={`max-w-xl w-full p-12 shadow-2xl shadow-white/30 backdrop-blur-lg bg-white/20 ${
                isDark ? 'text-white' : 'text-gray-900'
              } mb-12 relative`}
            >
              {/* Corners */}
              <span
                className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${
                  isDark ? 'border-white' : 'border-gray-800'
                }`}
              />
              <span
                className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${
                  isDark ? 'border-white' : 'border-gray-800'
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${
                  isDark ? 'border-white' : 'border-gray-800'
                }`}
              />
              <span
                className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${
                  isDark ? 'border-white' : 'border-gray-800'
                }`}
              />

              <h1
                className={`text-4xl font-bold text-center mb-6 ${
                  isDark ? 'text-white' : 'text-black'
                }`}
              >
                Sign In
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="phone"
                    className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    📞 Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    onChange={handleChange}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      color: isDark ? '#fff' : '#1a202c',
                    }}
                    className="mt-1 block w-full border rounded-xl shadow-sm p-3 backdrop-blur-sm border-white/40"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    🔒 Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      onChange={handleChange}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        color: isDark ? '#fff' : '#1a202c',
                      }}
                      className="block w-full border rounded-xl shadow-sm p-3 backdrop-blur-sm border-white/40"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={` border-none focus:outline-none absolute right-5 top-1/2 transform -translate-y-1/2 text-xl ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
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
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </button>

                <div className="relative my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  <span className="px-4 text-base text-gray-500 dark:text-gray-400 font-semibold">
                    OR
                  </span>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    color: isDark ? '#fff' : '#1a202c',
                  }}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-sm font-medium backdrop-blur-sm border-white/40 hover:bg-white/40"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 533.5 544.3">
                    <g>
                      <path d="M533.5..." fill="#4285F4" />
                    </g>
                  </svg>
                  <span className="pr-1.5">
                    <FcGoogle size={24} />
                  </span>
                  Continue with Google
                </button>
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
      </div>
    </>
  )
}

export default Login
