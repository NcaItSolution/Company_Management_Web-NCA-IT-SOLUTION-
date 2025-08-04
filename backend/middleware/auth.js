const jwt = require('jsonwebtoken');
const LoginCredentialsSchema = require('../models/LoginCredentialsSchema.js');

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await LoginCredentialsSchema.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token - user not found'
            });
        }
        req.user = {
            id: user._id,
            userId: user.userId,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
};
const adminAuth = [authenticateToken, requireAdmin];

module.exports = {
    authenticateToken,
    requireAdmin,
    adminAuth
};
