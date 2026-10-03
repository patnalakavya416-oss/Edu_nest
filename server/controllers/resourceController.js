// controllers/resourceController.js
//
// Handles all resource-related logic:
//
// POST   /api/resources      → admin creates a new resource
// GET    /api/resources      → any logged-in user retrieves resources
// GET    /api/resources/:id  → any logged-in user gets a single resource
// PUT    /api/resources/:id  → admin updates a resource
// DELETE /api/resources/:id  → admin deletes a resource

const Resource = require("../models/Resource");

// ---------------------------------------------------------------
// createResource — POST /api/resources
// Admin only. Creates a new resource with an uploaded PDF/PPT.
// ---------------------------------------------------------------

const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      year,
      semester,
      subject,
      resourceType,
    } = req.body;

    // Get the uploaded file URL
    const fileUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    // Validate required fields
    if (
      !title ||
      !department ||
      !year ||
      !semester ||
      !subject ||
      !resourceType ||
      !fileUrl
    ) {
      return res.status(400).json({
        message:
          "title, department, year, semester, subject, resourceType, and file are all required",
      });
    }

    // Create resource in MongoDB
    const resource = await Resource.create({
      title,
      description,
      department,
      year,
      semester,
      subject,
      resourceType,
      fileUrl,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (error) {
    console.error("Create resource error:", error.message);

    res.status(500).json({
      message: "Server error while creating resource",
    });
  }
};

// ---------------------------------------------------------------
// getResources — GET /api/resources
// Any logged-in user.
// Supports filtering and keyword search.
// ---------------------------------------------------------------

const getResources = async (req, res) => {
  try {
    const {
      department,
      year,
      semester,
      subject,
      resourceType,
      keyword,
    } = req.query;

    // Build filter dynamically
    const filter = {};

    if (department) {
      filter.department = {
        $regex: department,
        $options: "i",
      };
    }

    if (year) {
      filter.year = Number(year);
    }

    if (semester) {
      filter.semester = Number(semester);
    }

    if (subject) {
      filter.subject = {
        $regex: subject,
        $options: "i",
      };
    }

    if (resourceType) {
      filter.resourceType = resourceType;
    }

    // Keyword search
    if (keyword) {
      filter.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          subject: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          department: {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    const resources = await Resource.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: resources.length,
      resources,
    });
  } catch (error) {
    console.error("Get resources error:", error.message);

    res.status(500).json({
      message: "Server error while fetching resources",
    });
  }
};

// ---------------------------------------------------------------
// getResourceById — GET /api/resources/:id
// Any logged-in user.
// ---------------------------------------------------------------

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("uploadedBy", "name email");

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      resource,
    });
  } catch (error) {
    console.error("Get resource by ID error:", error.message);

    // Handle invalid ObjectId
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(500).json({
      message: "Server error while fetching resource",
    });
  }
};

// ---------------------------------------------------------------
// updateResource — PUT /api/resources/:id
// Admin only.
// ---------------------------------------------------------------

const updateResource = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      year,
      semester,
      subject,
      resourceType,
      fileUrl,
    } = req.body;

    // Build update object
    const updates = {};

    if (title !== undefined) {
      updates.title = title;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (department !== undefined) {
      updates.department = department;
    }

    if (year !== undefined) {
      updates.year = Number(year);
    }

    if (semester !== undefined) {
      updates.semester = Number(semester);
    }

    if (subject !== undefined) {
      updates.subject = subject;
    }

    if (resourceType !== undefined) {
      updates.resourceType = resourceType;
    }

    if (fileUrl !== undefined) {
      updates.fileUrl = fileUrl;
    }

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("uploadedBy", "name email");

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error("Update resource error:", error.message);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(500).json({
      message: "Server error while updating resource",
    });
  }
};

// ---------------------------------------------------------------
// deleteResource — DELETE /api/resources/:id
// Admin only.
// ---------------------------------------------------------------

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error.message);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(500).json({
      message: "Server error while deleting resource",
    });
  }
};

// ---------------------------------------------------------------
// Export controllers
// ---------------------------------------------------------------

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
};