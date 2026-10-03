// server.js
// Entry point of the backend.
// Loads env vars, connects to MongoDB, sets up middleware, registers routes, starts server.

// dotenv.config() must run FIRST so process.env is available everywhere
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Import all route files
const authRoutes     = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const aiRoutes       = require("./routes/aiRoutes");

const app = express();

// --- MIDDLEWARE ---
// Allow the React frontend (port 5173) to make requests to this backend
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded files statically at /uploads
// e.g. a file saved as uploads/1234-notes.pdf is accessible at /uploads/1234-notes.pdf
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- ROUTES ---
// Health-check route
app.get("/api/test", (_req, res) => {
  res.json({
    success: true,
    message: "EduNest AI server is running!",
  });
});

app.use("/api/auth",      authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/ai",        aiRoutes);

// --- START ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
