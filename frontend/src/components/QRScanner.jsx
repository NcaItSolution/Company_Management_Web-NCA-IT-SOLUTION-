import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import { authService } from '../services/authService';
import QrScanner from 'qr-scanner';
import jsQR from 'jsqr';

const QRScanner = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualSessionId, setManualSessionId] = useState('');
  
  // QR Scanner states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scanMode, setScanMode] = useState('none'); // 'none', 'camera', 'file'
  const [qrScanner, setQrScanner] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId);
    }
  }, [sessionId]);

  // Cleanup QR scanner on component unmount
  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [qrScanner]);

  const fetchSessionData = async (id) => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const token = authService.getToken();
      const response = await fetch(`https://company-management-web-nca-it-solution.onrender.com/api/student/attendance-session/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSessionData(data.data);
      } else {
        // More specific error messages
        if (response.status === 404) {
          setError(`Session not found. The session ID "${id}" may be invalid, expired, or deleted.`);
        } else if (response.status === 401) {
          setError('Please log in as a student to access attendance sessions.');
        } else {
          setError(data.message || 'Failed to load attendance session.');
        }
      }
    } catch (error) {
      console.error('Fetch session error:', error);
      setError('Unable to connect to server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (id) => {
    const userInfo = authService.getUserInfo();
    
    if (!userInfo) {
      setError('Please log in to mark attendance');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Mark attendance API call
      const response = await fetch('https://company-management-web-nca-it-solution.onrender.com/api/student/mark-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          sessionId: id,
          userId: userInfo.userId,
          userName: userInfo.userId // We'll improve this with full names later
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Attendance marked successfully!');
        // Refresh session data to show updated attendee count
        await fetchSessionData(id);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualSessionId.trim()) {
      navigate(`/attendance/${manualSessionId.trim()}`);
    }
  };

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // QR Scanner Functions
  const startCameraScanner = async () => {
    try {
      if (!videoRef.current) return;
      
      setScanMode('camera');
      setIsCameraActive(true);
      setError('');

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          handleQRCodeDetected(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Use back camera on mobile
        }
      );

      setQrScanner(scanner);
      await scanner.start();
    } catch (error) {
      console.error('Camera scanner error:', error);
      setError('Failed to access camera. Please check permissions and try again.');
      setScanMode('none');
      setIsCameraActive(false);
    }
  };

  const stopCameraScanner = () => {
    if (qrScanner) {
      qrScanner.destroy();
      setQrScanner(null);
    }
    setIsCameraActive(false);
    setScanMode('none');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError('');
      
      // Create image element to load the file
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleQRCodeDetected(code.data);
        } else {
          setError('No QR code found in the uploaded image. Please try again with a clearer image.');
        }
      };

      img.onerror = () => {
        setError('Failed to load the uploaded image. Please try again.');
      };

      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to process the uploaded file. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleQRCodeDetected = (qrData) => {
    try {
      // Stop scanning
      if (qrScanner) {
        stopCameraScanner();
      }

      console.log('QR Data detected:', qrData);
      
      // Extract session ID from QR data
      let extractedSessionId = '';
      
      try {
        // Try to parse as JSON first (this is how admin generates QR codes)
        const parsedData = JSON.parse(qrData);
        if (parsedData.sessionId) {
          extractedSessionId = parsedData.sessionId;
        } else if (parsedData.url && parsedData.url.includes('attendance/')) {
          const parts = parsedData.url.split('attendance/');
          extractedSessionId = parts[1];
        }
      } catch (jsonError) {
        // Not JSON, try other formats
        if (qrData.includes('attendance/')) {
          // If QR contains a URL like http://localhost:5173/attendance/session-id
          const parts = qrData.split('attendance/');
          extractedSessionId = parts[1];
        } else if (qrData.includes('sessionId=')) {
          // If QR contains sessionId parameter
          const urlParams = new URLSearchParams(qrData.split('?')[1]);
          extractedSessionId = urlParams.get('sessionId');
        } else {
          // Assume the QR data is the session ID itself
          extractedSessionId = qrData.trim();
        }
      }

      console.log('Extracted session ID:', extractedSessionId);

      if (extractedSessionId) {
        // Navigate to the session
        navigate(`/attendance/${extractedSessionId}`);
      } else {
        setError('Invalid QR code format. Please scan a valid attendance QR code.');
        console.error('Could not extract session ID from QR data:', qrData);
      }
    } catch (error) {
      console.error('QR processing error:', error);
      setError('Failed to process QR code. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Attendance Scanner</h1>
              <p className="text-gray-600 mt-2">Scan QR code with camera, upload image, or enter session ID manually</p>
            </div>
            <button
              onClick={() => navigate(authService.getUserRole() === 'student' ? '/student' : '/')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Manual Entry Option */}
        {!sessionId && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Session ID Manually</h2>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Session ID</label>
                <input
                  type="text"
                  value={manualSessionId}
                  onChange={(e) => setManualSessionId(e.target.value)}
                  placeholder="Enter the session ID from your instructor"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
              >
                Access Session
              </button>
            </form>
          </div>
        )}

        {/* QR Code Scanner Section */}
        {!sessionId && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Scanner</h2>
            
            {scanMode === 'none' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Camera Scanner */}
                  <button
                    onClick={startCameraScanner}
                    className="flex flex-col items-center p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition duration-200"
                  >
                    <svg className="w-12 h-12 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-green-700 font-medium">Use Camera</span>
                    <span className="text-sm text-gray-500 mt-1">Scan QR code with camera</span>
                  </button>

                  {/* File Upload */}
                  <label className="flex flex-col items-center p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200 cursor-pointer">
                    <svg className="w-12 h-12 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-blue-700 font-medium">Upload Image</span>
                    <span className="text-sm text-gray-500 mt-1">Select QR code image</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>Choose your preferred method to scan the QR code</p>
                </div>
              </div>
            )}

            {/* Camera Scanner View */}
            {scanMode === 'camera' && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full max-w-md mx-auto rounded-lg border-2 border-green-400"
                    style={{ maxHeight: '400px' }}
                  />
                  {isCameraActive && (
                    <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none">
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                      <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <p className="text-green-700 font-medium">Camera is active - Point at QR code</p>
                  <p className="text-sm text-gray-500">Position the QR code within the camera view</p>
                  <button
                    onClick={stopCameraScanner}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Stop Camera
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Details */}
        {sessionData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Session</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-green-800">{sessionData.title}</h3>
                {sessionData.description && (
                  <p className="text-gray-600 mt-1">{sessionData.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status: </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sessionData.isActive && !isExpired(sessionData.expiresAt)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sessionData.isActive && !isExpired(sessionData.expiresAt) ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Expires: </span>
                  <span className="text-gray-600">{formatDate(sessionData.expiresAt)}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Created By: </span>
                  <span className="text-gray-600">{sessionData.createdBy}</span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Attendees: </span>
                  <span className="text-gray-600">{sessionData.attendees?.length || 0}</span>
                </div>
              </div>

              {/* Attendance Action */}
              <div className="pt-4 border-t">
                {!sessionData.isActive ? (
                  <div className="text-center py-4">
                    <p className="text-red-600 font-medium">This attendance session is inactive</p>
                  </div>
                ) : isExpired(sessionData.expiresAt) ? (
                  <div className="text-center py-4">
                    <p className="text-orange-600 font-medium">This attendance session has expired</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => markAttendance(sessionData.sessionId)}
                      disabled={loading}
                      className={`px-8 py-3 rounded-lg font-semibold transition duration-200 ${
                        loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {loading ? 'Marking Attendance...' : 'Mark My Attendance'}
                    </button>
                  </div>
                )}
              </div>

              {/* Current Attendees */}
              {sessionData.attendees && sessionData.attendees.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">Recent Attendees:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {sessionData.attendees.slice(-5).map((attendee, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{attendee.userName || attendee.userId}</span>
                        <span className="text-gray-500">{formatDate(attendee.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
