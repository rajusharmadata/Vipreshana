import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const AuthRequired = ({ redirectPath }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 flex justify-center ${isDark ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-800'}`}>
      <div className="flex items-center gap-3 max-w-3xl">
        <div className={`p-2 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isDark ? 'white' : '#3b82f6'}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-medium">
            Authentication required to access {redirectPath}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Please log in to continue
          </p>
        </div>
        <Link 
          to="/login" 
          state={{ from: redirectPath }}
          className={`ml-auto px-4 py-2 rounded-md ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default AuthRequired; 