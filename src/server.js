require('dotenv').config(); // Load environment variables from .env file
const app=require('./app'); // Import the Express app from app.js
const connectToDatabase = require('./config/database'); // Import the database connection function

connectToDatabase(); // Establish a connection to the MongoDB database

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); // Start the server and listen on port 3000