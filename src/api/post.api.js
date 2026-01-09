import api from "./axios";

/* =========================
   POSTS API
========================= */

// Get posts (pagination)
export const getPosts = (page = 1, limit = 10, signal) => {
  return api.get(`/posts?page=${page}&limit=${limit}`, { signal });
};

// Get single post by ID
export const getPostById = (id, signal) => {
  return api.get(`/posts/${id}`, { signal });
};

// Create post (protected)
export const createPost = async (payload) => {
  console.log("API → createPost payload:", payload);

  const res = await api.post("/posts", payload);

  console.log("API → createPost response:", res.data);

  return res.data; //IMPORTANT
};

// Update post
export const updatePost = async (id, payload) => {
  const res = await api.put(`/posts/${id}`, payload);
  return res.data;
};

// Delete post
export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};
