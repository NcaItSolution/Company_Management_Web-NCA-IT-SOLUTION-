const express = require('express');
const studentRouter = express.Router();
const {
    markAttendance,
    getStudentAttendance,
    getAttendanceSessionForStudent,
    getActiveAttendanceSessions
} = require('../controller/studentCtrl.js');
const { authenticateToken } = require('../middleware/auth.js');

// Student Attendance Routes
// All routes require authentication but any authenticated user can access

// POST - Mark attendance for a session
studentRouter.post('/mark-attendance', authenticateToken, markAttendance);

// GET - Get student's own attendance history
studentRouter.get('/my-attendance', authenticateToken, getStudentAttendance);

// GET - Get attendance session details (for scanning QR)
studentRouter.get('/attendance-session/:sessionId', authenticateToken, getAttendanceSessionForStudent);

// GET - Get all active attendance sessions
studentRouter.get('/active-sessions', authenticateToken, getActiveAttendanceSessions);

module.exports = studentRouter;
