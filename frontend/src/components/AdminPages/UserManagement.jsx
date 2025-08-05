import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

const UserManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const token = authService.getToken();
      if (!token) {
        setError('Please log in to access user management.');
        return;
      }

      // Debug: Check token existence
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');

      if (activeTab === 'students') {
        const data = await userService.getAllStudents();
        if (data.success) {
          setStudents(data.student || []);
        } else {
          setError(data.message || 'Failed to fetch students');
        }
      } else {
        const data = await userService.getAllAdmins();
        if (data.success) {
          setAdmins(data.student || []); // API returns 'student' field for both
        } else {
          setError(data.message || 'Failed to fetch administrators');
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // More specific error messages
      if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to server. Make sure the backend is running on port 1234.');
      } else if (error.message.includes('HTTP error! status: 401')) {
        setError('Unauthorized access. Please log in again.');
      } else if (error.message.includes('HTTP error! status: 403')) {
        setError('Access denied. Admin privileges required.');
      } else if (error.message.includes('HTTP error! status: 404')) {
        setError('API endpoint not found. Please check server configuration.');
      } else {
        setError(`Connection error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUsersToDisplay = () => {
    return activeTab === 'students' ? students : admins;
  };

  const getUserCount = () => {
    return getUsersToDisplay().length;
  };

  // Modal handlers
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
    setError('');
    setSuccess('');
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setError('');
    setSuccess('');
  };

  const closeModals = () => {
    setShowPasswordModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  // Update password handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;

    try {
      setLoading(true);
      setError('');

      const result = await userService.updateUserPassword(selectedUser.userId, passwordData);
      
      if (result.success) {
        setSuccess(`Password updated successfully for ${selectedUser.userId}`);
        closeModals();
        // Refresh user list
        setTimeout(() => {
          fetchUsers();
          setSuccess('');
        }, 2000);
      } else {
        setError(result.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      setError('');

      const result = await userService.deleteUser(selectedUser.userId);
      
      if (result.success) {
        setSuccess(`User ${selectedUser.userId} deleted successfully`);
        closeModals();
        // Refresh user list and remove from local state
        if (activeTab === 'students') {
          setStudents(students.filter(user => user.userId !== selectedUser.userId));
        } else {
          setAdmins(admins.filter(user => user.userId !== selectedUser.userId));
        }
        // Clear success message after delay
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">User Management</h1>
              <p className="text-gray-600 mt-2">Manage students and administrators</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 py-4 px-6 text-center font-medium transition duration-200 ${
                activeTab === 'students'
                  ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Students ({students.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex-1 py-4 px-6 text-center font-medium transition duration-200 ${
                activeTab === 'admins'
                  ? 'bg-green-500 text-white border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Administrators ({admins.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'students' ? 'All Students' : 'All Administrators'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Total: {getUserCount()} {activeTab === 'students' ? 'students' : 'administrators'}
              </span>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
            </div>
          ) : (
            <>
              {/* Users Table */}
              {getUserCount() > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getUsersToDisplay().map((user, index) => (
                        <tr key={user._id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                activeTab === 'students' ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                <span className={`text-sm font-medium ${
                                  activeTab === 'students' ? 'text-blue-800' : 'text-green-800'
                                }`}>
                                  {user.userId?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.userId || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              onClick={() => {
                                // View user details
                                console.log('View user:', user.userId);
                              }}
                              title="View user details"
                            >
                              View
                            </button>
                            <button 
                              className="text-yellow-600 hover:text-yellow-900 mr-3"
                              onClick={() => openPasswordModal(user)}
                              title="Change password"
                            >
                              Edit Password
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => openDeleteModal(user)}
                              title="Delete user"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab === 'students' ? 'students' : 'administrators'} found
                  </h3>
                  <p className="text-gray-500">
                    There are currently no {activeTab === 'students' ? 'students' : 'administrators'} in the system.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
                <p className="text-3xl font-bold text-blue-600">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Total Administrators</h3>
                <p className="text-3xl font-bold text-green-600">{admins.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Update Password for {selectedUser?.userId}
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete User
                </h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      Are you sure you want to delete user "{selectedUser?.userId}"?
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm mb-4">{error}</div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
