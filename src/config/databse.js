const mongoose = require('mongoose'); // Import the Mongoose library for MongoDB interaction    

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }); // Connect to the MongoDB database using the URI from environment variables
        console.log('Connected to MongoDB'); // Log success message
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); // Log any connection errors
        process.exit(1); // Exit the process with an error code
    }
}

module.exports = connectToDatabase; // Export the function for use in other files (e.g., server.js)