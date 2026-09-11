const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// 1. CORS Setup (Vite / React frontend ke sath cookies allow karne ke liye)
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body & Cookie Parsers (Routes se pehle aane zaroori hain)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Routes
const authRouter = require('./routes/auth.routes');
app.use('/api/auth', authRouter);

// Agar interview routes ki file bani hui hai toh usse bhi yahan load karo:
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