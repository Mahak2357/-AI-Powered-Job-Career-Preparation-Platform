const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

async function authenticateToken(req, res, next) {
    try {
        // 1. Safely retrieve token from cookies or Authorization header
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(' ')[1] ||
            req.headers?.token;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // 2. Await the database check for blacklisted token
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Access denied. Token is blacklisted.' });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = { authenticateToken };