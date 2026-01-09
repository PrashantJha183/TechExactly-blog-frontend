import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     Handle Change
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =======================
     Submit Register
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    /* 🔐 Frontend Validation */
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (name.length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // Register
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Auto-login
      await login({ email, password });

      navigate("/");
    } catch (err) {
      console.error("Register error:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white"
          />

          {/* Password with toggle */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-slate-700 text-white pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
