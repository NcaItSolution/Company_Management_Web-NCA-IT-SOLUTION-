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
    createCourse
} = require('../controller/adminCtrl.js');
const { adminAuth } = require('../middleware/auth.js');
const upload=require('../middleware/multerMiddleware.js')

adminRouter.post('/attendance/generate-qr', adminAuth, generateQRCode);

adminRouter.get('/attendance/sessions', adminAuth, getAttendanceSessions);

adminRouter.get('/attendance/session/:sessionId', adminAuth, getAttendanceSession);

adminRouter.put('/attendance/session/:sessionId', adminAuth, updateAttendanceSession);

adminRouter.delete('/attendance/session/:sessionId', adminAuth, deleteAttendanceSession);

adminRouter.get('/getAllStudent', adminAuth, getAllStuent);

adminRouter.get('/getAllAdmin', adminAuth, getAllAdmin);

adminRouter.post('/create-course', adminAuth, createCourse);

// User management routes
adminRouter.get('/user/:userId', adminAuth, getUserDetails);
adminRouter.put('/user/:userId/password', adminAuth, updateUserPassword);
adminRouter.delete('/user/:userId', adminAuth, deleteUser);

module.exports = adminRouter;
