import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-slate-900">
      <Link to="/" className="font-bold text-white">
        TechExactly
      </Link>

      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/create-post" className="text-green-400">
              Create Post
            </Link>
            <button onClick={logout} className="text-red-400">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-indigo-400">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
