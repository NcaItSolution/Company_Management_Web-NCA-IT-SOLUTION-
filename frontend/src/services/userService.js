// User Management Service
const BASE_URL = 'http://localhost:1234/api';

export const userService = {
  // Get all students
  async getAllStudents() {
    try {
      const response = await fetch(`${BASE_URL}/admin/getAllStudent`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get all admins
  async getAllAdmins() {
    try {
      const response = await fetch(`${BASE_URL}/admin/getAllAdmin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Create new user (placeholder for future implementation)
  async createUser(userData) {
    try {
      const response = await fetch(`${BASE_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user (placeholder for future implementation)
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${BASE_URL}/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user (placeholder for future implementation)
  async deleteUser(userId) {
    try {
      const response = await fetch(`${BASE_URL}/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStatistics() {
    try {
      const [studentsResponse, adminsResponse] = await Promise.all([
        this.getAllStudents(),
        this.getAllAdmins()
      ]);

      return {
        totalStudents: studentsResponse.success ? studentsResponse.student.length : 0,
        totalAdmins: adminsResponse.success ? adminsResponse.student.length : 0,
        totalUsers: (studentsResponse.success ? studentsResponse.student.length : 0) + 
                   (adminsResponse.success ? adminsResponse.student.length : 0)
      };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  }
};
