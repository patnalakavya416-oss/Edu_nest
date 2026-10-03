// api/bookmarks.js
// Functions for bookmark API calls.

import api from "./axios";

/** Get all bookmarks for the currently logged-in user. */
export const getMyBookmarks = async () => {
  const response = await api.get("/api/bookmarks");
  return response.data;
};

/** Bookmark a resource by its ID. */
export const addBookmark = async (resourceId) => {
  const response = await api.post(`/api/bookmarks/${resourceId}`);
  return response.data;
};

/** Remove a bookmark for a resource. */
export const removeBookmark = async (resourceId) => {
  const response = await api.delete(`/api/bookmarks/${resourceId}`);
  return response.data;
};
