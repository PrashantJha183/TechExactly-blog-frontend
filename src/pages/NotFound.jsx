import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-4xl font-bold text-red-400">404</h1>

      <p className="text-gray-400">
        The page you are looking for does not exist.
      </p>

      {/* <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition"
      >
        Go Back Home
      </Link> */}
    </div>
  );
}
