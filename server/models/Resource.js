// models/Resource.js
// This file defines the shape of a Resource document in MongoDB.
// Each academic resource (notes, PPT, lab manual, etc.) is stored
// as one document following this schema.

const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    // The title of the resource, e.g. "Unit 1 Notes - Data Structures"
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    // A short description of what this resource contains (optional)
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Which department this resource belongs to, e.g. "Computer Science"
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    // Which academic year, e.g. 1, 2, 3, or 4
    year: {
      type: Number,
      required: [true, "Year is required"],
    },

    // Which semester, e.g. 1 through 8
    semester: {
      type: Number,
      required: [true, "Semester is required"],
    },

    // The subject name, e.g. "Data Mining", "Operating Systems"
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    // The type of resource - only the listed values are allowed
    resourceType: {
      type: String,
      required: [true, "Resource type is required"],
      enum: [
        "Notes",
        "Previous Papers",
        "Lab Manuals",
        "PPTs",
        "Assignments",
        "Important Questions",
        "Study Materials",
        "Useful Links",
      ],
    },

    // The URL or file path where the resource can be accessed
    // For now this is a plain string (actual file upload comes later)
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
    },

    // Which admin uploaded this resource
    // ref: "User" means this is a reference to a document in the User collection
    // This is called a "foreign key" in SQL terms
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields to every document
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
