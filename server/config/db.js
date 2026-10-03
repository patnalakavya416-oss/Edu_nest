// config/db.js
// This file is responsible for one thing only: connecting to MongoDB.
// It exports a function called connectDB that server.js calls on startup.
// If the connection fails, the error is logged and the process exits
// so you know immediately that something is wrong.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we await it
    // process.env.MONGODB_URI is read from the .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // conn.connection.host tells us which server we connected to
    // e.g. "cluster0.xxxxx.mongodb.net"
    // We do NOT log the full URI because it contains your password
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If anything goes wrong (wrong URI, no internet, wrong password),
    // log the error message and stop the server immediately
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // exit code 1 means something went wrong
  }
};

// Export the function so server.js can import and call it
module.exports = connectDB;
