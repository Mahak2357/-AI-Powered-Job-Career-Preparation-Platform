const {Router} = require('express')
const { registerUser,
    loginUser,
    logoutUser, getAuthenticatedUser } = require('../controllers/auth.controllers'); // Import the registerUser function from the auth.controllers.js file
const { authenticateToken} = require('../middlewares/auth.middleware'); // Import the authenticateToken middleware and getAuthenticatedUser function from the auth.middleware.js file

const authRouter = Router();

 /**
  * @route POST /api/auth/register
  * @description Register a new user
  * @access Public
  */
 authRouter.post("/register",registerUser);

 /**
  * @route POST /api/auth/login
  * @description Authenticate a user and return a JWT token
  * @access Public
  */
 authRouter.post("/login",loginUser);

 /**
  * @route GET /api/auth/logout
  * @description Logout a user and invalidate the JWT token
  * @access Public
  */
 authRouter.get("/logout",logoutUser);
 
 /**
  * @route GET /api/auth/get-me
  * @description Get the authenticated user's information
  * @access Private 
  */
 authRouter.get("/get-me", authenticateToken, getAuthenticatedUser);


module.exports = authRouter;