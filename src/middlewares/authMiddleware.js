const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect endpoints via JWT Token
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route, token missing'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SWIFT_DEFAULT_SECRET');
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user || !req.user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'User account is inactive or no longer exists'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Middleware for Role-Based Access Control (RBAC) - Section 14
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to perform this action`
            });
        }
        next();
    };
};