const userModel = require('../models/user.model');
const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library for token generation
const Blacklist = require('../models/blacklist.model'); // Import the Blacklist model for token blacklisting


/**
    * @name registerUser
    * @description Register a new user, hash the password, and save the user to the database.
    * @access Public
 */

async function registerUser(req, res) {
    
        const { username, email, password } = req.body; // Destructure the username, email, and password from the request body
        // Registration logic here

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide username,email and password" }); // Return a 400 Bad Request if any field is missing
        }

        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] }); // Check if a user with the same username or email already exists
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" }); // Return a 400 Bad Request if the username or email is already taken
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt with a salt round of 10

        const newUser = new userModel({
            username,
            email,
            password: hashedPassword, // Store the hashed password in the database
        });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a JWT token for the new user with a 1-hour expiration time

        res.cookie("token", token);
        res.status(201).json({ 
            message: "User registered successfully",
             user:{
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
             },
             token: token   
             });// Return a 201 Created response with a success message and the JWT token

    
}

/**
 * @name loginUser
 * @description Authenticate a user, verify the password, and return a JWT token.
 * @access Public   
 */

async function loginUser(req, res) {
    const { email, password } = req.body; // Destructure the email and password from the request body  
    
const user = await userModel.findOne({ email }); // Find the user in the database by email  

if (!user) {
    return res.status(400).json({ message: "Invalid email or password" }); // Return a 400 Bad Request if the user is not found
}

const isMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password in the database
if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" }); // Return a 400 Bad Request if the passwords do not match
}

const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a JWT token for the authenticated user with a 1-hour expiration time
res.cookie("token", token);
res.status(200).json({ 
    message: "User logged in successfully",
     user:{
        id: user._id,
        username: user.username,
        email: user.email,
     },
     token: token   
     });// Return a 200 OK response with a success message and the JWT token

}

/**
 * @name logoutUser
 * @description Logout a user by invalidating the JWT token and clearing the cookie.
 * @access Public   
 */

async function logoutUser(req, res) {
    const token = req.cookies.token; // Get the JWT token from the request cookies
    if (!token) {
        return res.status(400).json({ message: "No token provided" }); // Return a 400 Bad Request if no token is provided
    }  
    // Add the token to the blacklist
    await Blacklist.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}

/**
 * @name getAuthenticatedUser
 * @description Get the authenticated user's information.
 * @access Private
 */

async function getAuthenticatedUser(req, res) {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password'); // Find the user by ID and exclude the password field
    if (!user) {
        return res.status(404).json({ message: "User not found" }); // Return a 404 Not Found if the user is not found
    }
    res.status(200).json({ user }); // Return a 200 OK response with the user's information
}

module.exports = { registerUser, loginUser, logoutUser, getAuthenticatedUser }; // Export all functions for use in routes