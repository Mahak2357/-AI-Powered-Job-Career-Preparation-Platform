const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// 1. Bulletproof CORS headers (handles all domains and OPTIONS preflight)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');

    // Instantly answer browser preflight OPTIONS check
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 2. Body & Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Routes
const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

try {
    const interviewRouter = require('./routes/interview.routes');
    app.use('/api/interview', interviewRouter);
} catch (err) {
    console.log('interview.routes not loaded yet:', err.message);
}

// 4. Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;