// api/auth.js
// Functions for authentication API calls.

import api from "./axios";

/**
 * Login an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {{ token, user }} on success
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

/**
 * Register a new user (always creates a student — role is not accepted).
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ user }} on success
 */
export const registerUser = async (name, email, password) => {
  const response = await api.post("/api/auth/register", { name, email, password });
  return response.data;
};

/**
 * Get all admin accounts (admin only).
 */
export const getAdmins = async () => {
  const response = await api.get("/api/auth/admins");
  return response.data;
};

/**
 * Create a new admin account (admin only).
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */
export const createAdmin = async (name, email, password) => {
  const response = await api.post("/api/auth/admins", { name, email, password });
  return response.data;
};
