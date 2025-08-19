// Get the registered course and its content for the logged-in student
const getMyCourse = async (req, res) => {
    try {
        const studentUserId = req.user?.userId;
        if (!studentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }
        // Find the student and their courseId
        const student = await LoginCredentialsSchema.findOne({ userId: studentUserId });
        if (!student || !student.courseId) {
            return res.status(404).json({
                success: false,
                message: 'No course registered for this student.'
            });
        }
        // Find the course and populate all content
        const Course = require('../models/LecturesSchema.js');
        const course = await Course.findById(student.courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found.'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Course retrieved successfully',
            course
        });
    } catch (error) {
        console.error('Error fetching student course:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch course',
            error: error.message
        });
    }
};
const AttendanceSchema = require('../models/AttendanceSchema.js');
const LoginCredentialsSchema = require('../models/LoginCredentialsSchema.js');

// Mark attendance for a student
const markAttendance = async (req, res) => {
    try {
        const { sessionId, userId, userName } = req.body;
        
        // Get student user info from token (assuming you have middleware to extract user)
        const studentUserId = req.user?.userId || userId;
        const studentUserName = userName || studentUserId;
        
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        // Find the attendance session
        const session = await AttendanceSchema.findOne({ sessionId });
        
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Attendance session not found'
            });
        }

        // Check if session is active
        if (!session.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This attendance session is inactive'
            });
        }

        // Check if session is expired
        if (new Date() > session.expiresAt) {
            return res.status(400).json({
                success: false,
                message: 'This attendance session has expired'
            });
        }

        // Check if student has already marked attendance
        const existingAttendance = session.attendees.find(
            attendee => attendee.userId === studentUserId
        );

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'You have already marked attendance for this session',
                data: {
                    markedAt: existingAttendance.timestamp
                }
            });
        }

        // Add student to attendees list
        session.attendees.push({
            userId: studentUserId,
            userName: studentUserName,
            timestamp: new Date()
        });

        await session.save();

        return res.status(200).json({
            success: true,
            message: 'Attendance marked successfully',
            data: {
                sessionId: session.sessionId,
                title: session.title,
                markedAt: new Date(),
                totalAttendees: session.attendees.length
            }
        });

    } catch (error) {
        console.error('Error marking attendance:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to mark attendance',
            error: error.message
        });
    }
};

// Get student's attendance history
const getStudentAttendance = async (req, res) => {
    try {
        const studentUserId = req.user?.userId;
        const { page = 1, limit = 10 } = req.query;

        if (!studentUserId) {
            return res.status(400).json({
                success: false,
                message: 'Student ID is required'
            });
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Find all sessions where student has marked attendance
        const sessions = await AttendanceSchema.find({
            'attendees.userId': studentUserId
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('sessionId title description createdAt expiresAt attendees');

        // Filter and format the data to show only student's attendance
        const attendanceHistory = sessions.map(session => {
            const studentAttendance = session.attendees.find(
                attendee => attendee.userId === studentUserId
            );
            
            return {
                sessionId: session.sessionId,
                title: session.title,
                description: session.description,
                sessionDate: session.createdAt,
                attendanceMarkedAt: studentAttendance.timestamp,
                totalAttendees: session.attendees.length
            };
        });

        // Get total count for pagination
        const totalSessions = await AttendanceSchema.countDocuments({
            'attendees.userId': studentUserId
        });
        const totalPages = Math.ceil(totalSessions / parseInt(limit));

        return res.status(200).json({
            success: true,
            message: 'Attendance history retrieved successfully',
            data: {
                attendanceHistory,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalSessions,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching student attendance:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance history',
            error: error.message
        });
    }
};

// Get attendance session details for students (without admin privileges)
const getAttendanceSessionForStudent = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const session = await AttendanceSchema.findOne({ sessionId })
            .select('sessionId title description isActive expiresAt createdBy attendees createdAt');

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Attendance session not found'
            });
        }

        // Check if session is expired
        const isExpired = new Date() > session.expiresAt;

        // Don't expose sensitive admin data, only basic session info
        const sessionData = {
            sessionId: session.sessionId,
            title: session.title,
            description: session.description,
            isActive: session.isActive,
            expiresAt: session.expiresAt,
            createdBy: session.createdBy,
            createdAt: session.createdAt,
            isExpired,
            totalAttendees: session.attendees.length,
            // Only show last 5 attendees for privacy
            recentAttendees: session.attendees.slice(-5).map(attendee => ({
                userName: attendee.userName,
                timestamp: attendee.timestamp
            }))
        };

        return res.status(200).json({
            success: true,
            message: 'Attendance session retrieved successfully',
            data: sessionData
        });

    } catch (error) {
        console.error('Error fetching attendance session for student:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance session',
            error: error.message
        });
    }
};

// Get active attendance sessions for students
const getActiveAttendanceSessions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Find active and non-expired sessions
        const currentTime = new Date();
        const sessions = await AttendanceSchema.find({
            isActive: true,
            expiresAt: { $gt: currentTime }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('sessionId title description expiresAt createdBy attendees createdAt');

        const formattedSessions = sessions.map(session => ({
            sessionId: session.sessionId,
            title: session.title,
            description: session.description,
            expiresAt: session.expiresAt,
            createdBy: session.createdBy,
            createdAt: session.createdAt,
            totalAttendees: session.attendees.length
        }));

        const totalSessions = await AttendanceSchema.countDocuments({
            isActive: true,
            expiresAt: { $gt: currentTime }
        });
        const totalPages = Math.ceil(totalSessions / parseInt(limit));

        return res.status(200).json({
            success: true,
            message: 'Active attendance sessions retrieved successfully',
            data: {
                sessions: formattedSessions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalSessions,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching active attendance sessions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch active attendance sessions',
            error: error.message
        });
    }
};

module.exports = {
    markAttendance,
    getStudentAttendance,
    getAttendanceSessionForStudent,
    getActiveAttendanceSessions,
    getMyCourse
};
