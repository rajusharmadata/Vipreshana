import React, { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext'; 
import Navbar from './components/Navbar'; // Import Navbar
import FAQSection from './components/FAQs'; //importing faq section

const Dashboard = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            <Navbar />
            <div
                className={`relative h-screen bg-cover bg-center transition-all duration-700 ease-out font-inter ${
                    isDark ? 'brightness-30' : 'brightness-70'
                }`}
                style={{ backgroundImage: "url('https://img.freepik.com/free-photo/scene-with-photorealistic-logistics-operations-proceedings_23-2151468862.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
            >
                <div className={`absolute inset-0 ${isDark ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'} flex flex-col justify-center items-center text-white transition-all duration-700`}>
                    <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
                        <h1 className={`text-5xl md:text-7xl font-bold transition-all duration-1000 transform leading-tight ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        } ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-800' : 'text-white drop-shadow-lg'}`}
                            style={{ transitionDelay: '200ms', fontWeight: '800', letterSpacing: '-0.025em' }}
                        >
                            Welcome to Our 
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Logistics Platform
                            </span>
                        </h1>
                        
                        <p className={`text-xl md:text-2xl max-w-3xl mx-auto px-4 leading-relaxed transition-all duration-1000 transform font-light ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        } ${isDark ? 'text-gray-300' : 'text-white drop-shadow-md'}`}
                            style={{ transitionDelay: '400ms', lineHeight: '1.6' }}
                        >
                            Your one-stop solution for on-demand transportation services. 
                            <br />
                            <span className="font-medium">Book, track, and manage</span> your shipments seamlessly with our advanced platform.
                        </p>
                        
                        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 transform ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                            style={{ transitionDelay: '600ms' }}
                        >
                            <button
                                className={`group relative px-6 py-2 rounded-xl font-semibold text-lg tracking-wide transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 ${
                                    isDark
                                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-2 border-gray-600 hover:from-gray-700 hover:to-gray-800 hover:border-gray-500 hover:shadow-xl hover:shadow-gray-800/30'
                                        : 'bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white hover:shadow-xl hover:shadow-white/30'
                                }`}
                                onClick={() => (window.location.href = '/register')}
                            >
                                <span className="relative z-10 flex items-center gap-1 font-medium">
                                    Register Now
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </button>
                            
                            <button
                                className={`group relative px-6 py-2 rounded-xl font-semibold text-lg tracking-wide transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 ${
                                    isDark
                                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-600 text-white hover:from-gray-600 hover:to-gray-700 hover:shadow-xl hover:shadow-blue-500/30'
                                        : 'bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-600/80'
                                }`}
                                onClick={() => (window.location.href = '/login')}
                            >
                                <span className="relative z-10 flex items-center gap-2 font-medium">
                                    Sign In
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </span>
                                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
            <FAQSection isDark={isDark} />
        </>
    );
};

export default Dashboard;