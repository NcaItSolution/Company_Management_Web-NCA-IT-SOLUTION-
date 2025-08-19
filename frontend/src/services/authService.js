const API_BASE_URL = 'https://company-management-web-nca-it-solution.onrender.com/api';

export const authService = {
  // Login user
  login: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Create admin
  createAdmin: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Create student
  createStudent: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/create-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    // Additional logout logic can be added here
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Get user information
  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  // Get user role
  getUserRole: () => {
    const userInfo = authService.getUserInfo();
    return userInfo ? userInfo.role : null;
  },

  // Check if user is admin
  isAdmin: () => {
    const userInfo = authService.getUserInfo();
    return userInfo && userInfo.role === 'admin';
  },

  // Check if user is student
  isStudent: () => {
    const userInfo = authService.getUserInfo();
    return userInfo && userInfo.role === 'student';
  }
};
