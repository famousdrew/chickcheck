import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "./page";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe("SignupPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render signup form", () => {
    render(<SignupPage />);

    expect(
      screen.getByRole("heading", { name: /join chickcheck/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("should show error when passwords don't match", async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "different123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should submit form and redirect on success", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "123", email: "test@example.com" } }),
    } as Response);

    render(<SignupPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login?registered=true");
    });
  });

  it("should show error from API response", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "An account with this email already exists",
      }),
    } as Response);

    render(<SignupPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an account with this email already exists/i)
      ).toBeInTheDocument();
    });
  });

  it("should show loading state during submission", async () => {
    const user = userEvent.setup();
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  user: { id: "123", email: "test@example.com" },
                }),
              } as Response),
            100
          )
        )
    );

    render(<SignupPage />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      screen.getByRole("button", { name: /creating account/i })
    ).toBeDisabled();
  });

  it("should have link to login page", () => {
    render(<SignupPage />);

    const loginLink = screen.getByRole("link", { name: /sign in/i });
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
