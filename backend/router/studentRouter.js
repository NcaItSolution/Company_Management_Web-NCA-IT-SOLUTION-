const express = require('express');
const studentRouter = express.Router();
const {
    markAttendance,
    getStudentAttendance,
    getAttendanceSessionForStudent,
    getActiveAttendanceSessions,
    getMyCourse
} = require('../controller/studentCtrl.js');
// GET - Get the student's registered course and its content

const { authenticateToken } = require('../middleware/auth.js');

// Student Attendance Routes
// All routes require authentication but any authenticated user can access

studentRouter.get('/my-course', authenticateToken, getMyCourse);
// POST - Mark attendance for a session
studentRouter.post('/mark-attendance', authenticateToken, markAttendance);

// GET - Get student's own attendance history
studentRouter.get('/my-attendance', authenticateToken, getStudentAttendance);

// GET - Get attendance session details (for scanning QR)
studentRouter.get('/attendance-session/:sessionId', authenticateToken, getAttendanceSessionForStudent);

// GET - Get all active attendance sessions
studentRouter.get('/active-sessions', authenticateToken, getActiveAttendanceSessions);

module.exports = studentRouter;
