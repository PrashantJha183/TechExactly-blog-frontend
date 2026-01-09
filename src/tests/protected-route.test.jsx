import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import { AuthProvider } from "../auth/AuthContext";

test("redirects unauthenticated user", () => {
  const { container } = render(
    <MemoryRouter>
      <AuthProvider>
        <ProtectedRoute>
          <div>Private</div>
        </ProtectedRoute>
      </AuthProvider>
    </MemoryRouter>
  );

  expect(container.innerHTML).not.toContain("Private");
});
