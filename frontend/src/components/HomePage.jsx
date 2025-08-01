import React, { useState } from 'react';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // You can add your login logic here, e.g., calling an API
    console.log("Form submitted");
    handleCloseModal(); // Close modal after submission for this example
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {/* Main content card */}
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">NCA IT Solution</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">IT Training and Software Development</p>
        
        <button 
          onClick={handleLoginClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition duration-300"
        >
          Login
        </button>
      </div>

      {/* Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm relative transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl font-light"
              aria-label="close"
            >
              &times;
            </button>
            
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="loginId" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                  Enter Login ID
                </label>
                <input 
                  type="text" 
                  id="loginId" 
                  name="loginId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Your Login ID"
                  required 
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                  Password
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="••••••••••"
                  required 
                />
              </div>
              <div className="flex items-center justify-center">
                <button 
                  type="submit"
                  
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
