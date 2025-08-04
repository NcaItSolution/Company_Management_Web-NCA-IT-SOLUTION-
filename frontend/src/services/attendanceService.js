const API_BASE_URL = 'http://localhost:1234/api';

export const attendanceService = {
  // Generate QR Code for attendance session
  generateQRCode: async (sessionData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/attendance/generate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Get all attendance sessions
  getAttendanceSessions: async (params = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/admin/attendance/sessions${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Get specific attendance session
  getAttendanceSession: async (sessionId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/attendance/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Update attendance session
  updateAttendanceSession: async (sessionId, updateData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/attendance/session/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Delete attendance session
  deleteAttendanceSession: async (sessionId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/admin/attendance/session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Network error. Please check if the server is running.');
    }
  },

  // Get QR code image URL
  getQRCodeImageUrl: (fileName) => {
    return `${API_BASE_URL.replace('/api', '')}/uploads/${fileName}`;
  },

  // Download QR code
  downloadQRCode: async (sessionId, fileName) => {
    try {
      const url = `${API_BASE_URL.replace('/api', '')}/uploads/qr-${sessionId}.png`;
      const response = await fetch(url);
      
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName || `attendance-qr-${sessionId}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        return true;
      }
      throw new Error('Failed to download QR code');
    } catch (error) {
      throw new Error('Failed to download QR code: ' + error.message);
    }
  }
};
