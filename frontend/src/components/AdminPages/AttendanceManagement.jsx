import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';

const AttendanceManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('generate');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state for generating QR code
  const [qrForm, setQrForm] = useState({
    title: '',
    description: '',
    expiresInHours: 24
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSessions: 0
  });

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchSessions();
    }
  }, [activeTab, pagination.currentPage]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAttendanceSessions({
        page: pagination.currentPage,
        limit: 10
      });

      if (response.success) {
        setSessions(response.data.sessions);
        setPagination(response.data.pagination);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQrFormChange = (e) => {
    setQrForm({ ...qrForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleGenerateQR = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await attendanceService.generateQRCode(qrForm);

      if (response.success) {
        setSuccess('QR Code generated successfully!');
        setQrForm({ title: '', description: '', expiresInHours: 24 });
        // Refresh sessions if on manage tab
        if (activeTab === 'manage') {
          fetchSessions();
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSession = async (sessionId, currentStatus) => {
    try {
      const response = await attendanceService.updateAttendanceSession(sessionId, {
        isActive: !currentStatus
      });

      if (response.success) {
        setSuccess(`Session ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchSessions();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const response = await attendanceService.deleteAttendanceSession(sessionId);

        if (response.success) {
          setSuccess('Session deleted successfully');
          fetchSessions();
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDownloadQR = async (sessionId) => {
    try {
      await attendanceService.downloadQRCode(sessionId, `attendance-${sessionId}.png`);
      setSuccess('QR Code downloaded successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-pink-800">Attendance Management</h1>
              <p className="text-gray-600 mt-2">Generate QR codes and manage attendance sessions</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Generate QR Code
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage Sessions
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="m-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="m-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Generate QR Code Tab */}
          {activeTab === 'generate' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Attendance Session</h2>
              
              <form onSubmit={handleGenerateQR} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Session Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={qrForm.title}
                      onChange={handleQrFormChange}
                      required
                      disabled={loading}
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100"
                      placeholder="e.g., Morning Attendance - JavaScript Class"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Expires In (Hours)</label>
                    <select
                      name="expiresInHours"
                      value={qrForm.expiresInHours}
                      onChange={handleQrFormChange}
                      disabled={loading}
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100"
                    >
                      <option value={1}>1 Hour</option>
                      <option value={2}>2 Hours</option>
                      <option value={4}>4 Hours</option>
                      <option value={8}>8 Hours</option>
                      <option value={24}>24 Hours</option>
                      <option value={72}>3 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={qrForm.description}
                    onChange={handleQrFormChange}
                    disabled={loading}
                    rows={3}
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100"
                    placeholder="Optional description for the attendance session"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold transition duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
                >
                  {loading ? 'Generating...' : 'Generate QR Code'}
                </button>
              </form>
            </div>
          )}

          {/* Manage Sessions Tab */}
          {activeTab === 'manage' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Attendance Sessions</h2>
                <button
                  onClick={fetchSessions}
                  disabled={loading}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:bg-gray-400"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No attendance sessions found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.sessionId}
                      className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{session.title}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                session.isActive && !isExpired(session.expiresAt)
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {session.isActive && !isExpired(session.expiresAt) ? 'Active' : 'Inactive'}
                            </span>
                            {isExpired(session.expiresAt) && (
                              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                                Expired
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{session.description}</p>
                          <div className="text-sm text-gray-500">
                            <p>Created: {formatDate(session.createdAt)}</p>
                            <p>Expires: {formatDate(session.expiresAt)}</p>
                            <p>Attendees: {session.attendees?.length || 0}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                          <button
                            onClick={() => handleDownloadQR(session.sessionId)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                          >
                            Download QR
                          </button>
                          <button
                            onClick={() => handleToggleSession(session.sessionId, session.isActive)}
                            className={`px-3 py-1 rounded text-sm transition duration-200 ${
                              session.isActive
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {session.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.sessionId)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* QR Code Preview */}
                      {session.qrCodeUrl && (
                        <div className="mt-4 flex justify-center">
                          <div className="text-center">
                            <img
                              src={`https://company-management-web-nca-it-solution.onrender.com${session.qrCodeUrl}`}
                              alt={`QR Code for ${session.title}`}
                              className="w-32 h-32 border rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-2">Session ID: {session.sessionId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                      <button
                        onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400 transition duration-200"
                      >
                        Previous
                      </button>
                      <span className="text-gray-600">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400 transition duration-200"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
