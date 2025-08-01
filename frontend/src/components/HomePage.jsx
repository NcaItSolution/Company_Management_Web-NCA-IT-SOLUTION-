import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    Password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };
  

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess('');
    setFormData({ userId: '', Password: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await authService.login({
        userId: formData.userId,
        Password: formData.Password,
      });

      if (data.success) {
        setSuccess(data.message);
        // Store token in localStorage for future requests
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        // Store user information for role-based access
        if (data.user) {
          localStorage.setItem('userInfo', JSON.stringify(data.user));
        }
        
        // Redirect based on user role
        setTimeout(() => {
          handleCloseModal();
          if (data.user && data.user.role) {
            if (data.user.role === 'admin') {
              navigate('/admin');
            } else if (data.user.role === 'student') {
              navigate('/student');
            } else {
              console.warn('Unknown user role:', data.user.role);
            }
          } else {
            console.error('User role not found in response');
          }
        }, 1500);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                  Enter Login ID
                </label>
                <input 
                  type="text" 
                  id="userId" 
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Your Login ID"
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="Password" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                  Password
                </label>
                <input 
                  type="password" 
                  id="Password" 
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="••••••••••"
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-center">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition-colors duration-200`}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
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
