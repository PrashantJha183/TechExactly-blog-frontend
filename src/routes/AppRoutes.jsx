import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "../auth/ProtectedRoute";
import AdminRoute from "../auth/AdminRoute";

import MainLayout from "../components/layout/MainLayout";

import PostList from "../pages/posts/PostList";
import PostDetails from "../pages/posts/PostDetails";
import CreatePost from "../pages/posts/CreatePost";
import EditPost from "../pages/posts/EditPost";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Posts from "../pages/admin/Posts";
import Comments from "../pages/admin/Comments";

import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main layout (Navbar always visible) */}
      <Route element={<MainLayout />}>
        {/* Public pages */}
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Auth-protected pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />

          {/* Admin-only pages */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/posts"
            element={
              <AdminRoute>
                <Posts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/comments"
            element={
              <AdminRoute>
                <Comments />
              </AdminRoute>
            }
          />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
