import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/services/users", () => ({
  findUserByEmail: vi.fn(),
}));

vi.mock("@/lib/services/password-reset", () => ({
  createPasswordResetToken: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(),
  getAppUrl: vi.fn(),
}));

import { findUserByEmail } from "@/lib/services/users";
import { createPasswordResetToken } from "@/lib/services/password-reset";
import { getAppUrl, sendEmail } from "@/lib/email";
import { resetRateLimits } from "@/lib/rate-limit";
import { POST } from "./route";

function request(body: unknown, ip = "203.0.113.1") {
  return new Request("http://localhost/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const user = {
  id: "user-1",
  email: "test@example.com",
  passwordHash: "hashed",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimits();
    vi.mocked(getAppUrl).mockReturnValue("https://chickcheck.app");
    vi.mocked(createPasswordResetToken).mockResolvedValue("tok-123");
  });

  it("should email a reset link to an existing user", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(user);

    const response = await POST(request({ email: " Test@Example.com " }));

    expect(response.status).toBe(200);
    expect(findUserByEmail).toHaveBeenCalledWith("test@example.com");
    expect(createPasswordResetToken).toHaveBeenCalledWith("user-1");
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        text: expect.stringContaining(
          "https://chickcheck.app/reset-password?token=tok-123"
        ),
      })
    );
  });

  it("should give the same response for an unknown email without sending", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(user);
    const known = await (
      await POST(request({ email: "test@example.com" }))
    ).json();

    vi.mocked(findUserByEmail).mockResolvedValue(null);
    vi.mocked(sendEmail).mockClear();
    const response = await POST(request({ email: "nobody@example.com" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(known);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should still respond normally if the email fails to send", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(user);
    vi.mocked(sendEmail).mockRejectedValue(new Error("Resend down"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(request({ email: "test@example.com" }));

    expect(response.status).toBe(200);
  });

  it("should not create a token when no app URL is configured", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(user);
    vi.mocked(getAppUrl).mockReturnValue(null);
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(request({ email: "test@example.com" }));

    expect(response.status).toBe(200);
    expect(createPasswordResetToken).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should return 400 when email is missing", async () => {
    const response = await POST(request({}));
    expect(response.status).toBe(400);
  });

  it("should send at most 3 emails per address per window", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(user);

    for (let i = 0; i < 4; i++) {
      const response = await POST(
        request({ email: "test@example.com" }, `203.0.113.${i}`)
      );
      expect(response.status).toBe(200);
    }

    expect(sendEmail).toHaveBeenCalledTimes(3);
  });

  it("should return 429 after too many requests from one IP", async () => {
    vi.mocked(findUserByEmail).mockResolvedValue(null);

    for (let i = 0; i < 5; i++) {
      await POST(request({ email: `user${i}@example.com` }));
    }
    const response = await POST(request({ email: "another@example.com" }));

    expect(response.status).toBe(429);
  });
});
