// models/Bookmark.js
// Represents a bookmark — a student saving a resource for later.
// A user can only bookmark a given resource once (compound unique index).

const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    // The student who bookmarked the resource
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The resource that was bookmarked
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Compound unique index: a user cannot bookmark the same resource twice
bookmarkSchema.index({ user: 1, resource: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
