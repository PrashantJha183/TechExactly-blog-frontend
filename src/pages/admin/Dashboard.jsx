import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const endpoint = "/admin/dashboard";

      console.log(
        "Calling Admin Dashboard API:",
        `${api.defaults.baseURL}${endpoint}`
      );

      try {
        const res = await api.get(endpoint);

        console.log("Admin dashboard response:", res.data);

        // Map backend keys → frontend keys
        const backendData = res.data.data;

        setStats({
          totalUsers: backendData.users,
          totalPosts: backendData.posts,
          totalComments: backendData.comments,
        });
      } catch (err) {
        console.error(
          "Admin dashboard API error:",
          err?.response?.status,
          err?.response?.data
        );

        setError(
          err?.response?.data?.message ||
            "You are not authorized to view this page"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {/* Admin Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          to="/admin/users"
          className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-white"
        >
          Manage Users
        </Link>

        <Link
          to="/admin/posts"
          className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 text-white"
        >
          Manage Posts
        </Link>

        {/* NEW: Manage Comments */}
        <Link
          to="/admin/comments"
          className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 text-white"
        >
          Manage Comments
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded">
          <p className="text-gray-400">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded">
          <p className="text-gray-400">Total Posts</p>
          <p className="text-3xl font-bold">{stats.totalPosts}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded">
          <p className="text-gray-400">Total Comments</p>
          <p className="text-3xl font-bold">{stats.totalComments}</p>
        </div>
      </div>
    </div>
  );
}
