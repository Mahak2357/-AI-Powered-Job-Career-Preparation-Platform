const express = require('express'); // Import the Express framework
const app = express(); // Create an instance of the Express application
app.use(express.json()); // Middleware to parse incoming JSON requests


//requires the all routes here
const authRouter = require('./routes/auth.routes'); 
//using the authRouter for handling authentication-related routes
app.use('/api/auth', authRouter); 










module.exports = app; // Export the Express app for use in other files (e.g., server.js)
