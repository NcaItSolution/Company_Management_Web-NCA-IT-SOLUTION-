import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    if (activeTab === 'history') {
      fetchAttendanceHistory();
    } else {
      fetchActiveSessions();
    }
  }, [activeTab]);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch('http://localhost:1234/api/student/my-attendance?page=1&limit=20', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        setAttendanceHistory(data.data.attendanceHistory);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch('http://localhost:1234/api/student/active-sessions?page=1&limit=20', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        setActiveSessions(data.data.sessions);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-800">My Attendance</h1>
              <p className="text-gray-600 mt-2">Track your attendance and access active sessions</p>
            </div>
            <button
              onClick={() => navigate('/student')}
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
              onClick={() => setActiveTab('history')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Attendance History
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'active'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Sessions
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="m-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {/* Attendance History Tab */}
                {activeTab === 'history' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Your Attendance Record</h2>
                      <button
                        onClick={fetchAttendanceHistory}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                      >
                        Refresh
                      </button>
                    </div>

                    {attendanceHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No attendance records found.</p>
                        <p className="text-sm text-gray-500 mt-2">Mark your first attendance by scanning a QR code!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {attendanceHistory.map((record, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800">{record.title}</h3>
                                {record.description && (
                                  <p className="text-gray-600 text-sm mt-1">{record.description}</p>
                                )}
                                <div className="text-sm text-gray-500 mt-2">
                                  <p>Session Date: {formatDate(record.sessionDate)}</p>
                                  <p>Attendance Marked: {formatDate(record.attendanceMarkedAt)}</p>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0 text-right">
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                  Present
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  {record.totalAttendees} total attendees
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Active Sessions Tab */}
                {activeTab === 'active' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Available Attendance Sessions</h2>
                      <button
                        onClick={fetchActiveSessions}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                      >
                        Refresh
                      </button>
                    </div>

                    {activeSessions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No active attendance sessions available.</p>
                        <p className="text-sm text-gray-500 mt-2">Check back later or contact your instructor.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeSessions.map((session, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800">{session.title}</h3>
                                {session.description && (
                                  <p className="text-gray-600 text-sm mt-1">{session.description}</p>
                                )}
                                <div className="text-sm text-gray-500 mt-2">
                                  <p>Created by: {session.createdBy}</p>
                                  <p>Expires: {formatDate(session.expiresAt)}</p>
                                  <p>Current attendees: {session.totalAttendees}</p>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0">
                                <button
                                  onClick={() => navigate(`/attendance/${session.sessionId}`)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
                                >
                                  Mark Attendance
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/attendance')}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition duration-200 text-left"
            >
              <h4 className="font-medium">Scan QR Code</h4>
              <p className="text-sm opacity-90 mt-1">Scan a QR code to mark attendance</p>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition duration-200 text-left"
            >
              <h4 className="font-medium">View Active Sessions</h4>
              <p className="text-sm opacity-90 mt-1">See all available attendance sessions</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
