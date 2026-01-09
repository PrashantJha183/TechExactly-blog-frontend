import api from "./axios";

// Get comments for a post (public)
export const getCommentsByPost = (postId, signal) => {
  return api.get(`/comments/post/${postId}`, { signal });
};

// Add comment (auth required)
export const addComment = (payload) => {
  return api.post("/comments", payload);
};

// Update comment (FIXED: PUT instead of PATCH)
export const updateComment = (commentId, payload) => {
  return api.put(`/comments/${commentId}`, payload);
};

// Delete comment (owner or admin)
export const deleteComment = (commentId) => {
  return api.delete(`/comments/${commentId}`);
};
