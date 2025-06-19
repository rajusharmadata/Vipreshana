import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const avatarButtonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For mobile menu
      if (menuOpen && !event.target.closest('.mobile-menu')) {
        setMenuOpen(false);
      }
      
      // For user dropdown
      if (showUserDropdown && 
          !userDropdownRef.current?.contains(event.target) && 
          !avatarButtonRef.current?.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, showUserDropdown]);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleUserDropdown = () => setShowUserDropdown(prev => !prev);

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    return words.map(word => word[0].toUpperCase()).slice(0, 2).join('');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Frosted Glass Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full h-[4.5rem] z-50 px-6 py-4 flex items-center justify-between
          border-b border-white/10 dark:border-white/20 shadow-md transition-all duration-300`}
        style={{
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.15)',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          className="no-underline font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:no-underline focus:no-underline visited:text-transparent focus:text-transparent"
          onClick={closeMenu}
        >
          Vipreshana
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-base font-medium">
          <Link to="/about" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>About</Link>
          <Link to="/how-it-works" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>How It Works</Link>
          <Link to="/contact" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 shadow
              ${isDark ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}`}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* User Avatar (only when logged in) */}
          {user && (
            <div className="relative">
              <button
                ref={avatarButtonRef}
                onClick={toggleUserDropdown}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200
                  ${isDark ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}`}
                aria-label="User menu"
              >
                {getInitials(user.name)}
              </button>
              
              {/* User Dropdown */}
              {showUserDropdown && (
                <div
                  ref={userDropdownRef}
                  className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-50
                    ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                      ${isDark ? 'text-white' : 'text-gray-700'}`}
                    onClick={() => setShowUserDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                      ${isDark ? 'text-white' : 'text-gray-700'}`}
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
              ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <span className="text-xl font-bold">&times;</span>
            ) : (
              <>
                <span className={`block w-6 h-0.5 mb-1 ${isDark ? 'bg-white' : 'bg-gray-900'}`}></span>
                <span className={`block w-6 h-0.5 mb-1 ${isDark ? 'bg-white' : 'bg-gray-900'}`}></span>
                <span className={`block w-6 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'}`}></span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu fixed top-0 right-0 h-full w-60 transform transition-transform duration-300 z-40
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden flex flex-col border-r border-white/10 dark:border-white/20`}
        style={{
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.15)',
        }}
      >
        <div className="flex justify-end p-4">
          <button
            className={`text-3xl font-bold hover:text-red-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        
        {/* User info in mobile menu */}
        {user && (
          <div className={`px-4 py-3 mb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm opacity-75">{user.email}</p>
          </div>
        )}
        
        <nav className="flex flex-col px-4 gap-2">
          <Link 
            to="/about" 
            onClick={closeMenu}
            className={`px-4 py-3 rounded-lg ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
          >
            About
          </Link>
          <Link 
            to="/how-it-works" 
            onClick={closeMenu}
            className={`px-4 py-3 rounded-lg ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
          >
            How It Works
          </Link>
          <Link 
            to="/contact" 
            onClick={closeMenu}
            className={`px-4 py-3 rounded-lg ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
          >
            Contact
          </Link>
          {user && (
            <>
              <Link 
                to="/profile" 
                onClick={closeMenu}
                className={`px-4 py-3 rounded-lg ${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className={`text-left px-4 py-3 rounded-lg ${isDark ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
              >
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