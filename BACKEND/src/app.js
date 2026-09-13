const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'https://ai-powered-job-career-preparation-p.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// 1. CORS Setup
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests ko explicitly handle karne ke liye

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