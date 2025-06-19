import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
    // Close the mobile menu if open
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 shadow-md flex items-center justify-between
        border-b ${isDark ? 'border-white/20' : 'border-gray-200'} transition-all duration-300`}
      style={{
        WebkitBackdropFilter: 'blur(24px)',
        backdropFilter: 'blur(24px)',
        backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.15)',
      }}
    >
      {/* Brand */}
      <Link
        to="/"
        className="no-underline font-extrabold text-2xl tracking-tight bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-transparent hover:no-underline focus:no-underline visited:text-transparent focus:text-transparent"
        onClick={closeMenu}
      >
        <img src="/logo.png" alt="Vipreshana Logo" className="h-12 w-8 inline-block mr-1" />Vipreshana
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-6 text-base font-medium">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</Link>
            <Link to="/bookings" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>Bookings</Link>
            <Link to="/user" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>User</Link>
          </>
        ) : (
          <>
            <Link to="/login" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>Login</Link>
            <Link to="/register" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>Register</Link>
          </>
        )}
        <Link to="/how-it-works" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>How It Works</Link>
        <Link to="/contact" className={`hover:text-blue-400 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</Link>
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-1 hover:text-red-500 text-red-400 transition-colors ${isDark ? 'text-red-400' : 'text-red-500'}`}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Theme Toggle Button & Hamburger Icon */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-300 shadow ${isDark ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}`}
          aria-label="Toggle theme"
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        
        {/* Hamburger menu for mobile */}
        <button
          className={`md:hidden p-2 focus:outline-none rounded transition-colors duration-200 ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <span className={`block w-6 h-0.5 mb-1 ${isDark ? 'bg-yellow-400' : 'bg-gray-900'}`}></span>
          <span className={`block w-6 h-0.5 mb-1 ${isDark ? 'bg-yellow-400' : 'bg-gray-900'}`}></span>
          <span className={`block w-6 h-0.5 ${isDark ? 'bg-yellow-400' : 'bg-gray-900'}`}></span>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`fixed top-0 right-0 h-full w-60 shadow-lg transform transition-transform duration-200 z-50 ${menuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col
        ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
        border-l ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <button
          className={`self-end m-4 text-2xl ${isDark ? 'text-yellow-400' : 'text-gray-900'}`}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >&times;</button>
        <nav className="flex flex-col px-8 gap-6 mt-8 text-lg">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:underline">Dashboard</Link>
              <Link to="/bookings" onClick={() => setMenuOpen(false)} className="hover:underline">Bookings</Link>
              <Link to="/user" onClick={() => setMenuOpen(false)} className="hover:underline">User</Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:underline">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:underline">Register</Link>
            </>
          )}
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className="hover:underline">How It Works</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:underline">Contact</Link>
          
          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-1 hover:underline text-red-500 hover:text-red-600 transition-colors`}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
          
          <button
            onClick={toggleTheme}
            className={`mt-8 self-center p-2 rounded-full shadow transition-all duration-300 ${isDark ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}`}
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
      
      {/* Overlay when mobile menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;