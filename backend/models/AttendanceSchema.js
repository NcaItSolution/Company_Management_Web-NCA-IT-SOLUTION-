const mongoose = require('mongoose');
const { Schema } = mongoose;

const AttendanceSchema = new Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    qrCode: {
        type: String, // Base64 encoded QR code or file path
        required: true
    },
    qrCodeUrl: {
        type: String, // URL to access the QR code image
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String, // Admin user ID who created this session
        required: true
    },
    attendees: [{
        userId: {
            type: String,
            required: true
        },
        userName: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

AttendanceSchema.index({ sessionId: 1 });
AttendanceSchema.index({ createdBy: 1 });
AttendanceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
