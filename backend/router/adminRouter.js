const express = require('express');
const adminRouter = express.Router();
const {
    generateQRCode,
    getAttendanceSessions,
    getAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSession,
    getAllStuent,
    getAllAdmin
} = require('../controller/adminCtrl.js');
const { adminAuth } = require('../middleware/auth.js');

adminRouter.post('/attendance/generate-qr', adminAuth, generateQRCode);

adminRouter.get('/attendance/sessions', adminAuth, getAttendanceSessions);

adminRouter.get('/attendance/session/:sessionId', adminAuth, getAttendanceSession);

adminRouter.put('/attendance/session/:sessionId', adminAuth, updateAttendanceSession);

adminRouter.delete('/attendance/session/:sessionId', adminAuth, deleteAttendanceSession);

adminRouter.get('/getAllStudent', adminAuth, getAllStuent);

adminRouter.get('/getAllAdmin', adminAuth, getAllAdmin);

module.exports = adminRouter;
