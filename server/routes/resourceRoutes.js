// routes/resourceRoutes.js
// All routes are mounted at /api/resources in server.js.
//
//   GET    /api/resources      - logged-in users (student + admin)
//   POST   /api/resources      - admin only
//   GET    /api/resources/:id  - any logged-in user
//   PUT    /api/resources/:id  - admin only
//   DELETE /api/resources/:id  - admin only

const express = require("express");
const router = express.Router();

const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const { protect, authorize } = require("../middleware/authMiddleware");

// uploadMiddleware exports the multer instance directly (module.exports = upload)
// so we import it as-is and call upload.single("file") in the route
const upload = require("../middleware/uploadMiddleware");
// GET /api/resources — any logged-in user (student or admin)
router.get("/", protect, authorize("student", "admin"), getResources);

// POST /api/resources — admin only
router.post("/", protect, authorize("admin"), upload.single("file"), createResource);

// GET /api/resources/:id — any logged-in user
router.get("/:id", protect, getResourceById);

// PUT /api/resources/:id — admin only
router.put("/:id", protect, authorize("admin"), updateResource);

// DELETE /api/resources/:id — admin only
router.delete("/:id", protect, authorize("admin"), deleteResource);

module.exports = router;
