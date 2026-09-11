const mongoose = require('mongoose'); // Import the Mongoose library for MongoDB interaction
const dotenv = require('dotenv'); // Import the dotenv library to load environment variables    

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: [true, "Username already exists" ],
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        unique: [true, "Email already exists" ],
        required: [true, "Email is required"],
    },   
    password: {
        type: String,
        required: [true, "Password is required"],
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

const userModel = mongoose.model('User', userSchema); // Create a Mongoose model named 'User' based on the userSchema

module.exports = userModel; // Export the userModel for use in other files (e.g., controllers, routes)  
     