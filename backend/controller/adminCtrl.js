const AttendanceSchema = require('../models/AttendanceSchema.js');
const QRCode = require('qrcode');
const LoginCredentialsSchema=require('../models/LoginCredentialsSchema.js')

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Generate QR Code for Attendance Session
const generateQRCode = async (req, res) => {
    try {
        const { title, description, expiresInHours = 24 } = req.body;
        const adminUserId = req.user?.userId || 'admin';
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }
        const sessionId = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + parseInt(expiresInHours));

        // Create QR code data - this will be the URL students scan
        const qrData = {
            sessionId: sessionId,
            type: 'attendance',
            url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/attendance/${sessionId}`
        };

        // Generate QR code as base64
        const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(qrData), {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 256
        });

        // Save QR code as file
        const fileName = `qr-${sessionId}.png`;
        const filePath = path.join(uploadsDir, fileName);
        const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '');
        
        fs.writeFileSync(filePath, base64Data, 'base64');

        // Create QR code URL for access
        const qrCodeUrl = `/uploads/${fileName}`;

        // Save to database
        const attendanceSession = new AttendanceSchema({
            sessionId,
            title,
            description: description || '',
            qrCode: qrCodeBase64,
            qrCodeUrl,
            createdBy: adminUserId,
            expiresAt,
            isActive: true,
            attendees: []
        });

        await attendanceSession.save();

        return res.status(201).json({
            success: true,
            message: 'QR Code generated successfully',
            data: {
                sessionId,
                title,
                description,
                qrCodeUrl,
                qrCode: qrCodeBase64,
                expiresAt,
                isActive: true
            }
        });

    } catch (error) {
        console.error('Error generating QR code:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate QR code',
            error: error.message
        });
    }
};

// Get all attendance sessions
const getAttendanceSessions = async (req, res) => {
    try {
        const { isActive, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get sessions with pagination
        const sessions = await AttendanceSchema.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-qrCode'); // Exclude base64 QR code for performance

        // Get total count for pagination
        const totalSessions = await AttendanceSchema.countDocuments(query);
        const totalPages = Math.ceil(totalSessions / parseInt(limit));

        return res.status(200).json({
            success: true,
            message: 'Attendance sessions retrieved successfully',
            data: {
                sessions,
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
        console.error('Error fetching attendance sessions:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance sessions',
            error: error.message
        });
    }
};

// Get specific attendance session
const getAttendanceSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const session = await AttendanceSchema.findOne({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Attendance session not found'
            });
        }

        // Check if session is expired
        const isExpired = new Date() > session.expiresAt;

        return res.status(200).json({
            success: true,
            message: 'Attendance session retrieved successfully',
            data: {
                ...session.toObject(),
                isExpired
            }
        });

    } catch (error) {
        console.error('Error fetching attendance session:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance session',
            error: error.message
        });
    }
};

// Update attendance session (activate/deactivate)
const updateAttendanceSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { isActive, title, description } = req.body;

        const updateData = {};
        if (isActive !== undefined) updateData.isActive = isActive;
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;

        const session = await AttendanceSchema.findOneAndUpdate(
            { sessionId },
            updateData,
            { new: true }
        ).select('-qrCode');

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Attendance session not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Attendance session updated successfully',
            data: session
        });

    } catch (error) {
        console.error('Error updating attendance session:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update attendance session',
            error: error.message
        });
    }
};

// Delete attendance session
const deleteAttendanceSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await AttendanceSchema.findOneAndDelete({ sessionId });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Attendance session not found'
            });
        }

        // Delete QR code file
        try {
            const fileName = `qr-${sessionId}.png`;
            const filePath = path.join(uploadsDir, fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (fileError) {
            console.warn('Failed to delete QR code file:', fileError.message);
        }

        return res.status(200).json({
            success: true,
            message: 'Attendance session deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting attendance session:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete attendance session',
            error: error.message
        });
    }
};

const getAllStuent=async(req,res)=>{
   try{
    const student=await LoginCredentialsSchema.find({role:'student'})
    return res.status(200).json({
        success:true,
        student
    })
   }catch(e){
    return res.status(400).json({
        success:false,
        message:'something went wrong'
    })
   }
}

const getAllAdmin=async(req,res)=>{
   try{
    const student=await LoginCredentialsSchema.find({role:'admin'})
    return res.status(200).json({
        success:true,
        student
    })
   }catch(e){
    return res.status(400).json({
        success:false,
        message:'something went wrong'
    })
   }
}


// Update user password
const updateUserPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword, confirmPassword } = req.body;

        // Validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirmation are required'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Find user
        const user = await LoginCredentialsSchema.findOne({ userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update password (LoginCredentialsSchema should hash it automatically)
        user.Password = newPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: {
                userId: user.userId,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error updating user password:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update password',
            error: error.message
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminUserId = req.user?.userId;

        // Validation
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Prevent admin from deleting themselves
        if (userId === adminUserId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Find and delete user
        const user = await LoginCredentialsSchema.findOneAndDelete({ userId });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: `User ${userId} deleted successfully`,
            data: {
                deletedUser: {
                    userId: user.userId,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
};

// Get user details
const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await LoginCredentialsSchema.findOne({ userId }).select('-Password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User details retrieved successfully',
            data: user
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user details',
            error: error.message
        });
    }
};

module.exports = {
    generateQRCode,
    getAttendanceSessions,
    getAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSession,
    getAllStuent,
    getAllAdmin,
    updateUserPassword,
    deleteUser,
    getUserDetails
};
