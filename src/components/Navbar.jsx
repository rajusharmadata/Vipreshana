import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  return (
    <>
      {/* Frosted Glass Navbar */}
      <nav
        className={` fixed top-0 left-0 w-full h-[4.5rem] z-50 px-6 py-4 flex items-center justify-between
          border-b border-white/10 dark:border-white/20 shadow-md z-80 transition-all duration-300`}
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

        {/* Theme Toggle Button & Hamburger Icon  */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 shadow
              ${isDark ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}`}
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Hamburger/Close Button for Mobile - Ensure it's always clickable */}
          <button
            className={`md:hidden p-2 focus:outline-none rounded transition-colors duration-200
              ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
            onClick={toggleMenu} // This correctly toggles the menuOpen state
            aria-label="Toggle menu"
            // Adding a higher z-index directly to the button if needed, though parent z-50 should be enough
            style={{ zIndex:999 }} // Explicitly setting a higher z-index for safety
          >
            {/* Conditionally render hamburger lines or close 'X' */}
            {menuOpen ? (
              <span className="text-xl font-bold">&times;</span> // Close icon when menu is open
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

      {/* Mobile Slide-in Menu (hidden on desktop) */}
      <div
  className={`fixed top-0 right-0 h-full w-60 transform transition-transform  duration-300 z-50
    ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
    md:hidden flex flex-col border-r border-white/10 dark:border-white/20`}
        style={{
          WebkitBackdropFilter: 'blur(24px)',
          backdropFilter: 'blur(24px)',
          backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.15)',
        }}
      >
        <div className="flex justify-end p-4">
          {/* Close button inside the mobile menu */}
          <button
            className={`text-3xl font-bold hover:text-red-400 ${isDark ? 'text-white' : 'text-gray-900'}`}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col px-8 gap-6 mt-8 text-lg font-medium">
          <Link to="/about" onClick={closeMenu} className={`${isDark ? 'text-white' : 'text-gray-900'} hover:text-blue-400 transition`}>About</Link>
          <Link to="/how-it-works" onClick={closeMenu} className={`${isDark ? 'text-white' : 'text-gray-900'} hover:text-blue-400 transition`}>How It Works</Link>
          <Link to="/contact" onClick={closeMenu} className={`${isDark ? 'text-white' : 'text-gray-900'} hover:text-blue-400 transition`}>Contact</Link>
        </nav>
      </div>

      {/* Overlay to dim content and close menu on outside click */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={closeMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;