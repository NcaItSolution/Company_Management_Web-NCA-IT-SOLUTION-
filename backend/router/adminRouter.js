const express = require('express');
const adminRouter = express.Router();
const {
    generateQRCode,
    getAttendanceSessions,
    getAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSession,
    getAllStuent,
    getAllAdmin,
    updateUserPassword,
    deleteUser,
    getUserDetails,
    testConnection,
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addLecture,
    addAssignment,
    addNotes
} = require('../controller/adminCtrl.js');
const { adminAuth } = require('../middleware/auth.js');
const upload=require('../middleware/multerMiddleware.js')

// Test route (no auth required)
adminRouter.get('/test', testConnection);

adminRouter.post('/attendance/generate-qr', adminAuth, generateQRCode);

adminRouter.get('/attendance/sessions', adminAuth, getAttendanceSessions);

adminRouter.get('/attendance/session/:sessionId', adminAuth, getAttendanceSession);

adminRouter.put('/attendance/session/:sessionId', adminAuth, updateAttendanceSession);

adminRouter.delete('/attendance/session/:sessionId', adminAuth, deleteAttendanceSession);

adminRouter.get('/getAllStudent', adminAuth, getAllStuent);

adminRouter.get('/getAllAdmin', adminAuth, getAllAdmin);

adminRouter.post('/create-course', adminAuth, createCourse);

adminRouter.get('/courses', adminAuth, getAllCourses);

adminRouter.get('/course/:id', adminAuth, getCourseById);

adminRouter.put('/course/:id', adminAuth, updateCourse);

adminRouter.delete('/course/:id', adminAuth, deleteCourse);

adminRouter.post('/addLecture/:id', adminAuth,upload.single('lecture'), addLecture);

adminRouter.post('/addAssignments/:id', adminAuth,upload.single('assignment'), addAssignment);

adminRouter.post('/addNotes/:id', adminAuth,upload.single('note'), addNotes);

// User management routes
adminRouter.get('/user/:userId', adminAuth, getUserDetails);
adminRouter.put('/user/:userId/password', adminAuth, updateUserPassword);
adminRouter.delete('/user/:userId', adminAuth, deleteUser);

module.exports = adminRouter;
