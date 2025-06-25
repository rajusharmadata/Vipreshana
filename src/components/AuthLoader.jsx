import React from 'react';
import { useTheme } from '../context/ThemeContext';

const AuthLoader = ({ message = "Checking Authentication..." }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div 
        className={`p-8 rounded-lg shadow-lg text-center ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
          style={{ 
            borderColor: isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.5)',
            borderTopColor: 'transparent' 
          }}
        ></div>
        <h2 className="text-2xl font-bold mb-2">Checking Authentication</h2>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default AuthLoader; 