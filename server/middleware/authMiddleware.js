// middleware/authMiddleware.js
// This file contains two middleware functions:
//
//   protect   - checks whether the request has a valid JWT token
//   authorize - checks whether the logged-in user has the required role
//
// Middleware is a function that runs BETWEEN receiving a request
// and running the controller. It has access to req, res, and next.
// Calling next() means "continue to the next step".
// Not calling next() (and sending a response instead) means "stop here".

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---------------------------------------------------------------
// protect
// Verifies that the request contains a valid JWT token.
// If valid, attaches the user object to req.user and calls next().
// If invalid or missing, returns 401 Unauthorized.
// ---------------------------------------------------------------
const protect = async (req, res, next) => {
  try {
    // The token is sent in the Authorization header in this format:
    //   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    //
    // req.headers.authorization gives us the full string "Bearer <token>"
    // We split it by space and take the second part to get just the token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token was provided at all
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract the token from "Bearer <token>"
    // split(" ") gives ["Bearer", "<token>"] and [1] gives just the token
    const token = authHeader.split(" ")[1];

    // jwt.verify() checks two things:
    //   1. Was this token signed with our JWT_SECRET?
    //   2. Has the token expired?
    // If either check fails, it throws an error and we catch it below.
    // If successful, it returns the decoded payload: { id, role, iat, exp }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in MongoDB using the id stored in the token
    // .select("-password") means "get everything EXCEPT the password field"
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // Token was valid but the user no longer exists in the database
      return res.status(401).json({ message: "User no longer exists." });
    }

    // Attach the user to the request object
    // Any controller that runs after this middleware can access req.user
    req.user = user;

    // Everything is valid — move on to the next middleware or controller
    next();
  } catch (error) {
    // jwt.verify() throws specific errors we can check:
    //   JsonWebTokenError  - token is malformed or signature is wrong
    //   TokenExpiredError  - token has passed its expiry date
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

// ---------------------------------------------------------------
// authorize
// Checks whether the logged-in user has one of the allowed roles.
// Must be used AFTER protect, because it reads from req.user.
//
// Usage example:
//   router.get("/admin-only", protect, authorize("admin"), controller)
//   router.get("/any-user",   protect, authorize("student", "admin"), controller)
//
// ...roles is a "rest parameter" - it collects all arguments into an array
// So authorize("admin") means roles = ["admin"]
// And authorize("student", "admin") means roles = ["student", "admin"]
// ---------------------------------------------------------------
const authorize = (...roles) => {
  // authorize() returns a middleware function
  // This pattern is called a "higher-order function" - a function that returns a function
  return (req, res, next) => {
    // req.user was set by the protect middleware above
    // Check if the user's role is in the allowed roles array
    if (!roles.includes(req.user.role)) {
      // The user is logged in (authenticated) but not allowed (not authorized)
      // 403 Forbidden means: "I know who you are, but you can't do this"
      return res.status(403).json({
        message: `Access denied. This action requires one of these roles: ${roles.join(", ")}`,
      });
    }

    // Role is allowed — continue to the controller
    next();
  };
};

module.exports = { protect, authorize };
