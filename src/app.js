const express = require('express'); // Import the Express framework
const app = express(); // Create an instance of the Express application
app.use(express.json()); // Middleware to parse incoming JSON requests

module.exports = app; // Export the Express app for use in other files (e.g., server.js)
