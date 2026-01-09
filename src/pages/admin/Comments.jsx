import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get("/admin/comments");

        console.log("Admin comments response:", res.data);

        setComments(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/admin/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Delete comment failed", err);
      alert("Failed to delete comment");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading comments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Manage Comments</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              <th className="p-3">Comment</th>
              <th className="p-3">Author</th>
              <th className="p-3">Post</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {comments.map((comment) => (
              <tr
                key={comment._id}
                className="border-b border-slate-700 hover:bg-slate-800/40"
              >
                <td className="p-3 max-w-md truncate">{comment.content}</td>

                <td className="p-3">{comment.author?.name || "Unknown"}</td>

                <td className="p-3">{comment.post?.title || "Deleted Post"}</td>

                <td className="p-3">{formatDate(comment.createdAt)}</td>

                <td className="p-3">
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {comments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No comments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
