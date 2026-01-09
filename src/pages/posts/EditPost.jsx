import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getPostById, updatePost } from "../../api/post.api";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  console.log("EditPost mounted");
  console.log("Route post id:", id);
  console.log("Logged in user:", user);

  /* =========================
     Fetch Post Details
  ========================= */
  useEffect(() => {
    const controller = new AbortController();

    const fetchPost = async () => {
      try {
        console.log("Fetching post for edit...");

        const res = await getPostById(id, controller.signal);
        const post = res?.data?.data;

        console.log("Fetched post:", post);

        if (!post) {
          throw new Error("Post not found");
        }

        const postAuthorId = post?.author?._id;
        const loggedInUserId = user?.id;

        console.log("Ownership check values:", {
          postAuthorId,
          loggedInUserId,
          userRole: user?.role,
        });

        const isOwner = postAuthorId === loggedInUserId;
        const isAdmin = user?.role === "ADMIN";

        console.log("isOwner:", isOwner);
        console.log("isAdmin:", isAdmin);

        if (!isOwner && !isAdmin) {
          console.log("Unauthorized edit attempt, redirecting to home");
          navigate("/");
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        console.log("Error while fetching post:", err);
        if (err.name !== "CanceledError") {
          setError(err?.response?.data?.message || "Failed to load post");
        }
      } finally {
        setLoading(false);
        console.log("EditPost loading finished");
      }
    };

    fetchPost();
    return () => controller.abort();
  }, [id, navigate, user]);

  /* =========================
     Submit Update
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Update submit clicked");
    console.log("Title:", title);
    console.log("Content:", content);

    if (!title.trim() || !content.trim()) {
      console.log("Validation failed: empty fields");
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log("Sending update request...");

      await updatePost(id, {
        title: title.trim(),
        content: content.trim(),
      });

      console.log("Post updated successfully, redirecting to details");
      navigate(`/posts/${id}`);
    } catch (err) {
      console.log("Update failed:", err);
      setError(err?.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
      console.log("Update request finished");
    }
  };

  /* =========================
     UI States
  ========================= */
  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">Loading post...</div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-red-400 bg-red-900/20 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Edit Post</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Post"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-slate-600 rounded hover:bg-slate-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
