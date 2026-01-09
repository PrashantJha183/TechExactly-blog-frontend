import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { createPost } from "../../api/post.api";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("CreatePost → user:", user);
  console.log("CreatePost → isAuthenticated:", isAuthenticated);

  // Safety guard (route is protected anyway)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Please login to create a post.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        title: title.trim(),
        content: content.trim(),
      };

      console.log("CreatePost → submitting:", payload);

      const res = await createPost(payload);

      console.log("CreatePost → API result:", res);

      const createdPost = res?.data;

      if (!createdPost?._id) {
        throw new Error("Post creation failed");
      }

      // Redirect to post details
      navigate(`/posts/${createdPost._id}`);
    } catch (err) {
      console.error("CreatePost error:", err);

      // Token invalid / expired
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
        logout();
        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message || err?.message || "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Create New Post</h1>

      {error && (
        <p className="text-red-400 bg-red-900/20 p-3 rounded">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg space-y-6"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-slate-700 text-white"
            placeholder="Enter post title"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-3 rounded bg-slate-700 text-white"
            placeholder="Write your post content..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-slate-600 rounded hover:bg-slate-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
