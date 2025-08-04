const express = require('express');
const adminRouter = express.Router();
const {
    generateQRCode,
    getAttendanceSessions,
    getAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSession
} = require('../controller/adminCtrl.js');
const { adminAuth } = require('../middleware/auth.js');

// QR Code and Attendance Management Routes
// All routes require admin authentication

// POST - Generate QR Code for attendance session
adminRouter.post('/attendance/generate-qr', adminAuth, generateQRCode);

// GET - Get all attendance sessions with pagination
adminRouter.get('/attendance/sessions', adminAuth, getAttendanceSessions);

// GET - Get specific attendance session by sessionId
adminRouter.get('/attendance/session/:sessionId', adminAuth, getAttendanceSession);

// PUT - Update attendance session (activate/deactivate, edit title/description)
adminRouter.put('/attendance/session/:sessionId', adminAuth, updateAttendanceSession);

// DELETE - Delete attendance session and QR code file
adminRouter.delete('/attendance/session/:sessionId', adminAuth, deleteAttendanceSession);

module.exports = adminRouter;
