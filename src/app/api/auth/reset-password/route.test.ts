import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/services/password-reset", () => ({
  resetPasswordWithToken: vi.fn(),
}));

import { resetPasswordWithToken } from "@/lib/services/password-reset";
import { resetRateLimits } from "@/lib/rate-limit";
import { POST } from "./route";

function request(body: unknown) {
  return new Request("http://localhost/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.1",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
  });

  it("should reset the password with a valid token", async () => {
    vi.mocked(resetPasswordWithToken).mockResolvedValue(true);

    const response = await POST(
      request({ token: "tok-123", password: "newpass123" })
    );

    expect(response.status).toBe(200);
    expect(resetPasswordWithToken).toHaveBeenCalledWith(
      "tok-123",
      "newpass123"
    );
  });

  it("should return 400 for an invalid or expired token", async () => {
    vi.mocked(resetPasswordWithToken).mockResolvedValue(false);

    const response = await POST(
      request({ token: "bad", password: "newpass123" })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toMatch(/invalid or has expired/);
  });

  it("should return 400 for a short password without checking the token", async () => {
    const response = await POST(
      request({ token: "tok-123", password: "short" })
    );

    expect(response.status).toBe(400);
    expect(resetPasswordWithToken).not.toHaveBeenCalled();
  });

  it("should return 400 when the token is missing", async () => {
    const response = await POST(request({ password: "newpass123" }));

    expect(response.status).toBe(400);
    expect(resetPasswordWithToken).not.toHaveBeenCalled();
  });

  it("should return 429 after too many attempts", async () => {
    vi.mocked(resetPasswordWithToken).mockResolvedValue(false);

    for (let i = 0; i < 10; i++) {
      await POST(request({ token: `guess-${i}`, password: "newpass123" }));
    }
    const response = await POST(
      request({ token: "guess", password: "newpass123" })
    );

    expect(response.status).toBe(429);
  });
});
