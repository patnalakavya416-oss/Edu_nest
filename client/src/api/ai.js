// api/ai.js
// Function for the AI assistant API call.

import api from "./axios";

/**
 * Send a message to the AI assistant.
 * @param {string} message — the user's question
 * @returns {{ reply: string, resources: Array }} 
 */
export const askAI = async (message) => {
  const response = await api.post("/api/ai/ask", { message });
  return response.data;
};
