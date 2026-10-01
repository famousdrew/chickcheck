import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "./ResetPasswordForm";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams("token=tok-123");
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

const mockFetch = vi.fn();

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams("token=tok-123");
    vi.stubGlobal("fetch", mockFetch);
  });

  async function fillAndSubmit(password: string, confirm: string) {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    await user.type(screen.getByLabelText(/^new password/i), password);
    await user.type(screen.getByLabelText(/confirm new password/i), confirm);
    await user.click(screen.getByRole("button", { name: /reset password/i }));
  }

  it("should submit the token and new password, then go to login", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await fillAndSubmit("newpass123", "newpass123");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login?reset=true");
    });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/reset-password",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token: "tok-123", password: "newpass123" }),
      })
    );
  });

  it("should show an error when passwords don't match", async () => {
    await fillAndSubmit("newpass123", "different1");

    expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should show the server error for an expired link", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "This reset link is invalid or has expired.",
      }),
    });

    await fillAndSubmit("newpass123", "newpass123");

    await waitFor(() => {
      expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should explain when the link has no token", () => {
    mockSearchParams = new URLSearchParams();
    render(<ResetPasswordForm />);

    expect(screen.getByText(/missing its token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /request a new one/i })
    ).toHaveAttribute("href", "/forgot-password");
  });
});
