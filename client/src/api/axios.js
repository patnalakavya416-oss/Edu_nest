// api/axios.js
// Creates a pre-configured axios instance for all API calls.
// Automatically attaches the JWT token to every request if present.

import axios from "axios";

// Base URL for the Express server
const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Request interceptor — runs before every request is sent
// Reads the token from localStorage and adds it as a Bearer header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("edunest_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
