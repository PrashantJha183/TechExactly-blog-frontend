import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("🔵 Fetching admin users...");

      try {
        const res = await api.get("/admin/users");

        console.log("✅ Admin users API response:", res.data);

        setUsers(res.data.data || []);
      } catch (err) {
        console.error(
          "❌ Fetch users error:",
          err?.response?.status,
          err?.response?.data
        );

        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    console.log("🟡 Delete clicked for userId:", userId);

    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    const endpoint = `/admin/users/${userId}`;

    console.log("🔴 Calling DELETE API:", `${api.defaults.baseURL}${endpoint}`);

    try {
      const res = await api.delete(endpoint);

      console.log("✅ Delete response:", res.data);

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(
        "❌ Delete user error:",
        err?.response?.status,
        err?.response?.data
      );

      alert(
        err?.response?.data?.message || "Delete failed (route may not exist)"
      );
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading users...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-700">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.role === "ADMIN"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-indigo-500/20 text-indigo-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
