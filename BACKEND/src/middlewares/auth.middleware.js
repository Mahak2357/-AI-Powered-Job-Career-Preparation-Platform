const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for handling JWTs
const tokenBlacklistModel= require('../models/blacklist.model'); // Import the Blacklist model for token blacklisting

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Retrieve the token from the request cookies
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const isBlacklisted = tokenBlacklistModel.findOne({ token }); // Check if the token is blacklisted
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Access denied. Token is blacklisted.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Call the next middleware function
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = { authenticateToken // Export the authenticateToken middleware function for use in routes
};