import React from 'react';

const Dashboard = () => {
    return (
        <div
            className="relative h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('https://img.freepik.com/free-photo/scene-with-photorealistic-logistics-operations-proceedings_23-2151468862.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Logistics Platform</h1>
                <p className="text-lg md:text-xl mb-6 text-center px-4">
                    Your one-stop solution for on-demand transportation services. 
                    Book, track, and manage your shipments seamlessly.
                </p>
                <div className="flex space-x-4">
                    <button
                        className="bg-white text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition"
                        onClick={() => (window.location.href = '/register')}
                    >
                        Register
                    </button>
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                        onClick={() => (window.location.href = '/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
