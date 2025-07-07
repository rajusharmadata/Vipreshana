import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FiInfo, FiMap, FiPhone, FiUser, FiLogOut } from "react-icons/fi";
import { Sun, Moon } from "lucide-react";


const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  useEffect(() => {
    // Check if user is logged in via localStorage
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For mobile menu
      if (menuOpen && !event.target.closest(".mobile-menu")) {
        setMenuOpen(false);
      }

      // For user dropdown
      if (
        showUserDropdown &&
        !userDropdownRef.current?.contains(event.target) &&
        !avatarButtonRef.current?.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, showUserDropdown]);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleUserDropdown = () => setShowUserDropdown((prev) => !prev);

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(/\s+/);
    return words
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const handleLogout = async () => {
    try {
      // If using Supabase auth
      if (signOut) {
        await signOut();
      }

      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');

      // Update state
      setUser(null);

      // Close mobile menu if open
      closeMenu();

      // Redirect to home page
      navigate('/', { replace: true });

      // Optional: Show toast notification
      if (window.toast) {
        window.toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Check if user is logged in (using both isAuthenticated from context and user from localStorage)
  const isLoggedIn = isAuthenticated || !!user;

  // Force UI update on auth state changes
  // Log auth state changes
  useEffect(() => {
    console.log('Navbar - Auth state updated:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  // Set up auth change listeners
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('Auth change event received in Navbar');
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else if (!isAuthenticated) {
          setUser(null);
        }
      } catch (e) {
        console.error('Error handling auth change in Navbar:', e);
      }
    };

    // Listen for both storage and custom auth events
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [isAuthenticated]);

  return (
    <>
      {/* Frosted Glass Navbar */}
      <nav
        className={` fixed top-0 left-0 w-full h-[4.5rem] z-50 px-4 py-2 flex items-center justify-between
          border-b border-white/10 dark:border-white/20 shadow-md z-80 transition-all duration-300`}
        style={{
          WebkitBackdropFilter: "blur(24px)",
          backdropFilter: "blur(24px)",
          backgroundColor: isDark
            ? "rgba(0,0,0,0.3)"
            : "rgba(255,255,255,0.15)",
        }}
      >
        <div className="flex w-full items-center justify-between">
          {/* Left: Logo */}
          <Link
            to="/"
            className="no-underline font-extrabold text-2xl tracking-tight bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent hover:no-underline focus:no-underline visited:text-transparent focus:text-transparent"
            onClick={closeMenu}
          >
            <img
              src="/logo.png"
              alt="Vipreshana Logo"
              className="h-12 w-8 inline-block mr-1"
            />
            Vipreshana
          </Link>

          {/* Center: Spacer (optional) */}
          <div className="flex-1"></div>

          {/* Right: Desktop Navigation + Controls */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-base font-medium">
              <Link
                to="/about"
                className={`flex items-center gap-2 no-underline hover:text-blue-400 transition ${isDark ? "text-white" : "text-gray-900"
                  }`}
              >
                <FiInfo className="text-lg" />
                About
              </Link>
              <Link
                to="/how-it-works"
                className={`flex items-center gap-2 no-underline hover:text-blue-400 transition ${isDark ? "text-white" : "text-gray-900"
                  }`}
              >
                <FiMap className="text-lg" />
                How It Works
              </Link>
              <Link
                to="/contact"
                className={`flex items-center gap-2 no-underline hover:text-blue-400 transition ${isDark ? "text-white" : "text-gray-900"
                  }`}
              >
                <FiPhone className="text-lg" />
                Contact
              </Link>

              {/* Only show Dashboard if logged in */}
              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 no-underline hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  <FiUser className="text-lg" />
                  Dashboard
                </Link>
              )}
            </div>

            {/* Theme Toggle + User Avatar + Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2
    ${isDark
                    ? " text-yellow-300"
                    : "text-blue-400"
                  }`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>


              {/* Removed login button as requested */}

              {user && (
                <div className="relative">
                  <button
                    ref={avatarButtonRef}
                    onClick={toggleUserDropdown}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200
                      ${isDark
                        ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                        : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                      }`}
                    aria-label="User menu"
                  >
                    {getInitials(user.name)}
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div
                      ref={userDropdownRef}
                      className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-50
                        ${isDark
                          ? "bg-gray-800 border border-gray-700"
                          : "bg-white border border-gray-200"
                        }`}
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                          ${isDark ? "text-white" : "text-gray-700"}`}
                        onClick={() => setShowUserDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                          ${isDark ? "text-white" : "text-gray-700"}`}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger Menu Button */}
              <button
                className={`md:hidden p-2 focus:outline-none rounded transition-colors duration-200
                  ${isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <span className="text-xl font-bold">&times;</span>
                ) : (
                  <>
                    <span
                      className={`block w-6 h-0.5 mb-1 ${isDark ? "bg-white" : "bg-gray-900"
                        }`}
                    ></span>
                    <span
                      className={`block w-6 h-0.5 mb-1 ${isDark ? "bg-white" : "bg-gray-900"
                        }`}
                    ></span>
                    <span
                      className={`block w-6 h-0.5 ${isDark ? "bg-white" : "bg-gray-900"
                        }`}
                    ></span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu fixed top-0 right-0 h-full w-60 transform transition-transform duration-300 z-50
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
          md:hidden flex flex-col border-r border-white/10 dark:border-white/20`}
        style={{
          WebkitBackdropFilter: "blur(24px)",
          backdropFilter: "blur(24px)",
          backgroundColor: isDark
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.15)",
        }}
      >
        <div className="flex justify-end p-4">
          <button
            className={`text-3xl font-bold hover:text-red-400 ${isDark ? "text-white" : "text-gray-900"
              }`}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        {/* User info in mobile menu */}
        {user && (
          <div
            className={`px-4 py-3 mb-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"
              }`}
          >
            <p className="font-medium">{user.name}</p>
            <p className="text-sm opacity-75">{user.email}</p>
          </div>
        )}

        <nav className="flex flex-col px-4 gap-2">
          <Link
            to="/about"
            onClick={closeMenu}
            className={`flex items-center gap-2 no-underline px-4 py-3 rounded-lg transition ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-500"
              }`}
          >
            <FiInfo className="text-lg" />
            About
          </Link>

          <Link
            to="/how-it-works"
            onClick={closeMenu}
            className={`flex items-center gap-2 no-underline px-4 py-3 rounded-lg transition ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-500"
              }`}
          >
            <FiMap className="text-lg" />
            How It Works
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
            className={`flex items-center gap-2 no-underline px-4 py-3 rounded-lg transition ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-500"
              }`}
          >
            <FiPhone className="text-lg" />
            Contact
          </Link>

          {/* Only show user navigation when logged in */}
          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={`flex items-center gap-2 no-underline px-4 py-3 rounded-lg transition ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-500"
                  }`}
              >
                <FiUser className="text-lg" />
                Dashboard
              </Link>

              <Link
                to="/profile"
                onClick={closeMenu}
                className={`flex items-center gap-2 no-underline px-4 py-3 rounded-lg transition ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-500"
                  }`}
              >
                <FiUser className="text-lg" />
                My Profile
              </Link>

              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className={`flex items-center gap-2 text-left no-underline px-4 py-3 rounded-lg transition ${isDark ? "text-red-400 hover:text-red-500" : "text-red-600 hover:text-red-700"
                  }`}
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
