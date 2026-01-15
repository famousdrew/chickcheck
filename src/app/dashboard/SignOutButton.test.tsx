import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignOutButton from "./SignOutButton";

// Mock next-auth/react
const mockSignOut = vi.fn();
vi.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe("SignOutButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render sign out button", () => {
    render(<SignOutButton />);
    expect(
      screen.getByRole("button", { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it("should call signOut on click", async () => {
    const user = userEvent.setup();
    render(<SignOutButton />);

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
