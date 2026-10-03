// models/User.js
// This file defines the shape of a User document in MongoDB.
// Mongoose uses this "schema" to know what fields a user has,
// what type each field is, and what rules apply to each field.

const mongoose = require("mongoose");

// A schema is a blueprint that describes what a document looks like
const userSchema = new mongoose.Schema(
  {
    // The user's full name - required, stored as a trimmed string
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra spaces from both ends
    },

    // Email must be unique - no two users can have the same email
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // always store email in lowercase
      trim: true,
    },

    // Password is required - we will store the HASHED version, never plain text
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // Role decides what the user can do
    // "student" can browse and bookmark resources
    // "admin" can upload, edit, and delete resources
    role: {
      type: String,
      enum: ["student", "admin"], // only these two values are allowed
      default: "student",         // if no role is given, default to student
    },
  },
  {
    // timestamps: true automatically adds two fields to every document:
    // createdAt - when the user registered
    // updatedAt - when the user was last modified
    timestamps: true,
  }
);

// Create the Model from the schema
// "User" becomes the collection name "users" in MongoDB (Mongoose pluralises it)
const User = mongoose.model("User", userSchema);

module.exports = User;
