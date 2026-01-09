import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";

import { getPostById, deletePost } from "../../api/post.api";
import { getCommentsByPost, addComment } from "../../api/comment.api";
import MyComment from "../comments/MyComments";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  /* =======================
     SORT HELPER (DESC)
     Newest → Oldest
  ======================= */
  const sortByCreatedAtDesc = (list) =>
    [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /* =======================
     Fetch Post + Comments
  ======================= */
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const postRes = await getPostById(id, controller.signal);
        const postData = postRes?.data?.data;

        if (!postData) {
          setNotFound(true);
          return;
        }

        setPost(postData);

        const commentRes = await getCommentsByPost(
          postData._id,
          controller.signal
        );

        // Newest → Oldest
        setComments(sortByCreatedAtDesc(commentRes?.data?.data || []));
      } catch (err) {
        if (err?.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [id]);

  /* =======================
     Guards
  ======================= */
  if (loading) return <Loader />;

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold text-red-400">Post Not Found</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!post) return <Loader />;

  const isPostOwner = user?.id === post?.author?._id;

  /* =======================
     Add Comment
  ======================= */
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);

      const res = await addComment({
        postId: post._id,
        content: commentText.trim(),
      });

      // Add + keep newest on top
      setComments((prev) => sortByCreatedAtDesc([...prev, res.data.data]));
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setCommentLoading(false);
    }
  };

  /* =======================
     Comment handlers
  ======================= */
  const handleCommentDeleted = (id) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  const handleCommentUpdated = (updated) => {
    setComments((prev) =>
      sortByCreatedAtDesc(
        prev.map((c) => (c._id === updated._id ? updated : c))
      )
    );
  };

  /* =======================
     Render
  ======================= */
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Post */}
      <article className="bg-slate-800 p-6 rounded-lg space-y-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>

        <div className="text-sm text-gray-400 flex justify-between">
          <span>By {post?.author?.name || "Unknown"}</span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <p className="text-gray-300 leading-relaxed">{post.content}</p>

        {(isPostOwner || isAdmin) && (
          <div className="flex gap-4 pt-4">
            <Link to={`/edit-post/${post._id}`} className="text-indigo-400">
              Edit
            </Link>
            <button
              onClick={async () => {
                await deletePost(post._id);
                navigate("/");
              }}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        )}
      </article>

      {/* Comments */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>

        {comments.length === 0 && (
          <p className="text-gray-400">No comments yet.</p>
        )}

        {/* Comments List */}
        {comments.map((comment) =>
          user ? (
            <MyComment
              key={comment._id}
              comment={comment}
              onDeleted={handleCommentDeleted}
              onUpdated={handleCommentUpdated}
            />
          ) : (
            <div key={comment._id} className="bg-slate-700 p-4 rounded">
              <p className="text-gray-200">{comment.content}</p>
              <span className="text-xs text-gray-400">{comment.user.name}</span>
            </div>
          )
        )}

        {/* Add Comment */}
        {user && (
          <div className="space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3 rounded bg-slate-800 text-white"
              placeholder="Write a comment..."
              rows={3}
            />
            <button
              onClick={handleAddComment}
              disabled={commentLoading}
              className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50"
            >
              {commentLoading ? "Posting..." : "Add Comment"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
