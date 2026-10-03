// routes/authRoutes.js
// Defines all URL paths under /api/auth
//
// Public routes (no token needed):
//   POST /api/auth/register
//   POST /api/auth/login
//
// Protected routes (token required):
//   GET  /api/auth/profile      - any logged-in user
//   GET  /api/auth/admin-test   - admin only

const express = require("express");
const router = express.Router();

const { register, login, createAdmin, getAdmins } = require("../controllers/authController");

// Import middleware
// protect  - verifies the JWT token
// authorize - checks the user's role
const { protect, authorize } = require("../middleware/authMiddleware");

// --- Public routes ---
// Anyone can call these without a token
router.post("/register", register);
router.post("/login", login);

// --- Protected route: any logged-in user ---
// protect runs first, checks the token, sets req.user
// then this handler runs and returns req.user info
router.get("/profile", protect, (req, res) => {
  // req.user was attached by the protect middleware
  // We return only safe fields - never the password
  res.json({
    message: "Token is valid. You are authenticated.",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// --- Admin-only route ---
// protect runs first (check token), then authorize("admin") runs (check role)
// Only if both pass does the response get sent
router.get("/admin-test", protect, authorize("admin"), (req, res) => {
  res.json({
    message: "Admin access confirmed.",
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

// --- Admin management routes ---
// GET  /api/auth/admins — list all admin accounts (admin only)
// POST /api/auth/admins — create a new admin account (admin only)
router.get("/admins",  protect, authorize("admin"), getAdmins);
router.post("/admins", protect, authorize("admin"), createAdmin);

module.exports = router;
