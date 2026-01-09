import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     Date Formatter (DD/MM/YYYY)
  ========================= */
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /* =========================
     Sort Helper (NEWEST → OLDEST)
  ========================= */
  const sortNewestFirst = (list) =>
    [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts?limit=100");

        console.log("Admin posts response:", res.data);

        const list = res.data.data?.posts || res.data.data || [];

        // SORT HERE
        setPosts(sortNewestFirst(list));
      } catch (err) {
        console.error("Failed to fetch posts", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/posts/${postId}`);

      // keep sorted after delete
      setPosts((prev) => sortNewestFirst(prev.filter((p) => p._id !== postId)));
    } catch (err) {
      console.error("Delete post failed", err);
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Manage Posts</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Created</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <tr
                key={post._id}
                className="border-b border-slate-700 hover:bg-slate-800/40"
              >
                <td className="p-3">{post.title}</td>

                <td className="p-3">{post.author?.name || "Unknown"}</td>

                <td className="p-3">{formatDate(post.createdAt)}</td>

                <td className="p-3">
                  {post.isDeleted ? (
                    <span className="text-red-400">Deleted</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </td>

                <td className="p-3">
                  {!post.isDeleted && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {posts.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
