// routes/bookmarkRoutes.js
// All routes are mounted at /api/bookmarks in server.js.
//
//   GET    /api/bookmarks              - get current user's bookmarks
//   POST   /api/bookmarks/:resourceId  - bookmark a resource
//   DELETE /api/bookmarks/:resourceId  - remove a bookmark

const express = require("express");
const router = express.Router();

const {
  addBookmark,
  removeBookmark,
  getMyBookmarks,
} = require("../controllers/bookmarkController");

const { protect } = require("../middleware/authMiddleware");

// GET /api/bookmarks — fetch all bookmarks for the logged-in user
router.get("/", protect, getMyBookmarks);

// POST /api/bookmarks/:resourceId — add a bookmark
router.post("/:resourceId", protect, addBookmark);

// DELETE /api/bookmarks/:resourceId — remove a bookmark
router.delete("/:resourceId", protect, removeBookmark);

module.exports = router;
