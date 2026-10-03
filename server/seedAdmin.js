// seedAdmin.js
// This is a ONE-TIME script to create an admin user in MongoDB.
// Run it once with: node seedAdmin.js
// After it succeeds, you can delete this file.
// It will NOT create a duplicate if the email already exists.

const dotenv = require("dotenv");
dotenv.config(); // loads MONGODB_URI from .env

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin.test@example.com" });
    if (existing) {
      console.log("Admin user already exists. Nothing was changed.");
      process.exit(0);
    }

    // Hash the password exactly the same way register() does it
    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    // Create the admin user
    await User.create({
      name: "EduNest Admin",
      email: "admin.test@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log("  Email:    admin.test@example.com");
    console.log("  Password: Admin@12345");
    console.log("  Role:     admin");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
