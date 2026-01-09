import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../auth/AuthContext";

test("AuthProvider renders children", () => {
  render(
    <AuthProvider>
      <div>Test Child</div>
    </AuthProvider>
  );

  expect(screen.getByText("Test Child")).toBeInTheDocument();
});
