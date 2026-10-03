// api/resources.js
// Functions for resource CRUD API calls.

import api from "./axios";

/**
 * Get all resources with optional filters.
 * Filters: { keyword, department, year, semester, subject, resourceType }
 */
export const getResources = async (filters = {}) => {
  // Build query params — only include params with non-empty values
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params[key] = value;
    }
  });
  const response = await api.get("/api/resources", { params });
  return response.data;
};

/**
 * Get a single resource by its MongoDB ID.
 */
export const getResourceById = async (id) => {
  const response = await api.get(`/api/resources/${id}`);
  return response.data;
};

/**
 * Create a new resource (admin only).
 * Always sends as multipart/form-data so multer can handle the file.
 * IMPORTANT: do NOT set Content-Type manually — the browser must set it
 * automatically so it includes the required boundary string for multipart parsing.
 */
export const createResource = async (data) => {
  const formData = new FormData();

  // Append every field to FormData — including the File object if present
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  // Do NOT pass a Content-Type header — axios + browser sets it with the correct boundary
  const response = await api.post("/api/resources", formData);
  return response.data;
};

/**
 * Update an existing resource by ID (admin only).
 */
export const updateResource = async (id, data) => {
  const response = await api.put(`/api/resources/${id}`, data);
  return response.data;
};

/**
 * Delete a resource by ID (admin only).
 */
export const deleteResource = async (id) => {
  const response = await api.delete(`/api/resources/${id}`);
  return response.data;
};
