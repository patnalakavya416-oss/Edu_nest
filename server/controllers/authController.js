// controllers/authController.js
// This file contains the logic for two routes:
//   POST /api/auth/register  → create a new user account
//   POST /api/auth/login     → log in and get a JWT token
//
// A controller receives the request (req), does the work,
// and sends back a response (res).

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---------------------------------------------------------------
// REGISTER
// Called when a new user signs up
// Expects req.body to contain: { name, email, password, role }
// ---------------------------------------------------------------
const register = async (req, res) => {
  try {
    // Pull the fields out of the request body
    // role is intentionally not accepted here — public registration always creates a student
    const { name, email, password } = req.body;

    // --- Validation ---
    // Make sure the required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if a user with this email already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // --- Hash the password ---
    // bcrypt.hash(password, saltRounds)
    // saltRounds = 10 means bcrypt will run the hashing algorithm 2^10 = 1024 times
    // The higher the number, the more secure but the slower it is. 10 is the standard.
    // This turns "mypassword123" into something like "$2a$10$XJ..."
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Create the user in MongoDB ---
    // role is hardcoded to "student" — public registration must never create an admin.
    // Admin creation is handled by a separate protected endpoint (createAdmin).
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    // --- Send back the response ---
    // We return the user's info but deliberately exclude the password field
    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ---------------------------------------------------------------
// LOGIN
// Called when a user tries to log in
// Expects req.body to contain: { email, password }
// Returns a JWT token on success
// ---------------------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // --- Find the user by email ---
    // If no user is found, we return a generic "invalid credentials" message
    // We never say "email not found" specifically - that would tell attackers
    // which emails are registered
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // --- Compare the password ---
    // bcrypt.compare() takes the plain text password the user typed
    // and the hashed password stored in MongoDB, and checks if they match
    // It returns true or false
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // --- Generate a JWT token ---
    // jwt.sign(payload, secret, options)
    // payload: the data we want to store inside the token (user id and role)
    // secret: a private string only our server knows (from .env)
    // expiresIn: the token will stop working after 7 days
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // --- Send back the token and basic user info ---
    // The frontend will save this token and send it with future requests
    // We never include the password in the response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ---------------------------------------------------------------
// createAdmin — POST /api/auth/admins
// Admin only. Creates a new admin account.
// Expects req.body: { name, email, password }
// Role is always forced to "admin" — not taken from the request body.
// ---------------------------------------------------------------
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin", // always admin — this endpoint is protected, role is not from body
    });

    res.status(201).json({
      message: "Admin account created successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error.message);
    res.status(500).json({ message: "Server error while creating admin" });
  }
};

// ---------------------------------------------------------------
// getAdmins — GET /api/auth/admins
// Admin only. Returns all users with role = "admin".
// Passwords are never included in the response.
// ---------------------------------------------------------------
const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password") // exclude password from all results
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Get admins error:", error.message);
    res.status(500).json({ message: "Server error while fetching admins" });
  }
};

module.exports = { register, login, createAdmin, getAdmins };
