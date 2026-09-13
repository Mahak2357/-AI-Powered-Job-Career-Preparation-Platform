const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const allowedOrigins = new Set([
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
].filter(Boolean));
const prepAiVercelOrigin = /^https:\/\/ai-powered-job-career-preparation(?:-[a-z0-9-]+)?\.vercel\.app$/i;

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin) || prepAiVercelOrigin.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

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