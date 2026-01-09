import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../components/common/Loader";

export default function PostList() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  // Date formatter (DD/MM/YYYY)
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/posts?page=${page}&limit=${limit}`, {
          signal: controller.signal,
        });

        setPosts(res.data?.data?.posts || []);
        setTotal(res.data?.data?.total || 0);
      } catch (err) {
        if (err.name !== "CanceledError") {
          setError("Failed to load posts");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
    return () => controller.abort();
  }, [page]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold">TechExactly Blog</h1>
        <p className="text-gray-400">Read articles from our community</p>

        {user && (
          <Link
            to="/create-post"
            className="inline-block mt-4 px-5 py-2 bg-green-600 rounded hover:bg-green-500 transition"
          >
            Create Post
          </Link>
        )}
      </section>

      {error && <p className="text-center text-red-400">{error}</p>}

      {/* Posts Grid (stable height) */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 min-h-[100px]">
        {posts.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">
            No posts found.
          </p>
        ) : (
          posts.map((post) => (
            <Link
              key={post._id}
              to={`/posts/${post._id}`}
              className="
    bg-slate-800
    rounded-lg
    p-5
    hover:shadow-lg
    transition
    flex
    flex-col
    h-[200px]
  "
            >
              {/* Title */}
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                {post.title}
              </h2>

              {/* Content */}
              <p className="text-sm text-gray-400 line-clamp-4">
                {post.content}
              </p>

              {/* Footer pinned to bottom */}
              <div className="mt-auto pt-4 text-xs text-gray-500 flex justify-between">
                <span>By {post.author?.name || "Unknown"}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </Link>
          ))
        )}
      </section>

      {/* Pagination (stable position) */}
      <div className="flex justify-center">
        <div className="flex items-center gap-6 min-w-[280px] justify-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-gray-300 text-sm whitespace-nowrap">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages || 1}</span>
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
