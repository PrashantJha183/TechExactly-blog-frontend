import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { login } = auth;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     Input Change
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     Submit Login
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password.trim(),
    };

    try {
      const user = await login(payload);

      if (!user) {
        throw new Error("Login failed");
      }

      /* 🔐 ROLE-BASED REDIRECT */
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-slate-700 text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 rounded bg-slate-700 text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
