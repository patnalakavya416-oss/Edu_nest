// seedData.js
// Seeds 5 sample academic resources into MongoDB.
// Run with: node seedData.js
//
// - Skips seeding if resources already exist (idempotent)
// - Looks up the admin user by email: admin.test@example.com
// - Each resource has uploadedBy set to that admin's ObjectId

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Resource = require("./models/Resource");
const User = require("./models/User");

const seed = async () => {
  await connectDB();

  // Check if resources already exist — skip if so
  const count = await Resource.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped: ${count} resources already exist in the database.`);
    process.exit(0);
  }

  // Find the admin user
  const admin = await User.findOne({ email: "admin.test@example.com" });
  if (!admin) {
    console.error(
      "Seed failed: Admin user with email admin.test@example.com not found.\n" +
      "Run seedAdmin.js first to create the admin account."
    );
    process.exit(1);
  }

  // Sample resources to seed
  const sampleResources = [
    {
      title: "Data Mining Unit 1 Notes",
      description: "Comprehensive notes covering Unit 1 of Data Mining including concepts of KDD and data preprocessing.",
      department: "CSE",
      year: 3,
      semester: 5,
      subject: "Data Mining",
      resourceType: "Notes",
      fileUrl: "#",
      uploadedBy: admin._id,
    },
    {
      title: "Compiler Design Previous Paper 2023",
      description: "Previous year question paper for Compiler Design from the 2023 university examinations.",
      department: "CSE",
      year: 3,
      semester: 6,
      subject: "Compiler Design",
      resourceType: "Previous Papers",
      fileUrl: "#",
      uploadedBy: admin._id,
    },
    {
      title: "Data Mining Lab Manual",
      description: "Lab manual with step-by-step instructions for all Data Mining experiments.",
      department: "CSE",
      year: 3,
      semester: 5,
      subject: "Data Mining",
      resourceType: "Lab Manuals",
      fileUrl: "#",
      uploadedBy: admin._id,
    },
    {
      title: "Computer Architecture PPT Unit 2",
      description: "Slide deck covering Unit 2 of Computer Architecture: CPU organization, instruction cycles, and pipelining.",
      department: "CSE",
      year: 2,
      semester: 4,
      subject: "Computer Architecture",
      resourceType: "PPTs",
      fileUrl: "#",
      uploadedBy: admin._id,
    },
    {
      title: "DAA Important Questions Unit 3-5",
      description: "Curated list of important questions from Units 3 to 5 of Design and Analysis of Algorithms.",
      department: "CSE",
      year: 3,
      semester: 5,
      subject: "Design and Analysis of Algorithms",
      resourceType: "Important Questions",
      fileUrl: "#",
      uploadedBy: admin._id,
    },
  ];

  await Resource.insertMany(sampleResources);
  console.log(`Seed successful: ${sampleResources.length} resources inserted.`);
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err.message);
  process.exit(1);
});
