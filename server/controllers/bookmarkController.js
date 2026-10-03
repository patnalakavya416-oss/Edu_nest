// controllers/bookmarkController.js
// Handles bookmarking resources for logged-in students.
//
//   POST   /api/bookmarks/:resourceId  → add a bookmark
//   DELETE /api/bookmarks/:resourceId  → remove a bookmark
//   GET    /api/bookmarks              → get all bookmarks for current user

const Bookmark = require("../models/Bookmark");
const Resource = require("../models/Resource");

// ---------------------------------------------------------------
// addBookmark — POST /api/bookmarks/:resourceId
// Protected. Lets a logged-in user bookmark a resource.
// Returns 400 if already bookmarked.
// ---------------------------------------------------------------
const addBookmark = async (req, res) => {
  try {
    const { resourceId } = req.params;

    // Verify the resource actually exists before bookmarking
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if this user has already bookmarked this resource
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      resource: resourceId,
    });

    if (existingBookmark) {
      return res.status(400).json({ message: "Resource already bookmarked" });
    }

    // Create the bookmark
    const bookmark = await Bookmark.create({
      user: req.user._id,
      resource: resourceId,
    });

    res.status(201).json({
      message: "Bookmark added successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Add bookmark error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(500).json({ message: "Server error while adding bookmark" });
  }
};

// ---------------------------------------------------------------
// removeBookmark — DELETE /api/bookmarks/:resourceId
// Protected. Removes a user's bookmark for a specific resource.
// ---------------------------------------------------------------
const removeBookmark = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      resource: resourceId,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Remove bookmark error:", error.message);
    res.status(500).json({ message: "Server error while removing bookmark" });
  }
};

// ---------------------------------------------------------------
// getMyBookmarks — GET /api/bookmarks
// Protected. Returns all bookmarks for the currently logged-in user,
// with full resource details populated.
// ---------------------------------------------------------------
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate("resource") // populate all resource fields
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error.message);
    res.status(500).json({ message: "Server error while fetching bookmarks" });
  }
};

module.exports = { addBookmark, removeBookmark, getMyBookmarks };
