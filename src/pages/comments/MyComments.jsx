import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { updateComment, deleteComment } from "../../api/comment.api";

export default function MyComment({ comment, onDeleted, onUpdated }) {
  const { user, isAdmin } = useAuth();

  const isOwner = user?.id === comment?.user?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await updateComment(comment._id, {
        content: text.trim(),
      });

      onUpdated(res.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(comment._id);
      onDeleted(comment._id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bg-slate-700 p-4 rounded space-y-2">
      {!isEditing ? (
        <>
          <p className="text-gray-200">{comment.content}</p>
          <span className="text-xs text-gray-400">{comment.user.name}</span>

          {(isOwner || isAdmin) && (
            <div className="flex gap-4 text-sm pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-400"
              >
                Edit
              </button>
              <button onClick={handleDelete} className="text-red-400">
                Delete
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full p-2 rounded bg-slate-800 text-white"
          />

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-3 py-1 bg-indigo-600 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setText(comment.content);
              }}
              className="px-3 py-1 bg-slate-600 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
