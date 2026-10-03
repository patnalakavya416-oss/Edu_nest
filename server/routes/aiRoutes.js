// routes/aiRoutes.js
// All routes are mounted at /api/ai in server.js.
//
//   POST /api/ai/ask — submit a question to the AI assistant

const express = require("express");
const router = express.Router();

const { askAI } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/ai/ask — protected, any logged-in user can ask
router.post("/ask", protect, askAI);

module.exports = router;
