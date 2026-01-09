import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

/* =========================
   Hook
========================= */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};

/* =========================
   Provider
========================= */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Restore session */
  useEffect(() => {
    console.log("Restoring auth session");

    const storedUser = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");

    console.log("Stored user:", storedUser);
    console.log("Stored token:", token);

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      console.log("Session restored");
    } else {
      console.log("No session found");
    }

    setLoading(false);
  }, []);

  /* Login */
  const login = async (payload) => {
    console.log("LOGIN payload:", payload);

    const res = await api.post("/auth/login", payload);

    console.log("LOGIN response:", res.data);

    if (!res?.data?.success) {
      throw new Error("Login failed");
    }

    const { user, accessToken, refreshToken } = res.data.data;

    console.log("User:", user);
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    if (!accessToken) {
      throw new Error("Access token missing from login response");
    }

    // STORE CORRECT TOKEN
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("auth_token", accessToken);

    console.log("Auth data saved to localStorage");

    setUser(user);
    return user;
  };

  /* Logout */
  const logout = () => {
    console.log("Logging out");

    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    logout,
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
