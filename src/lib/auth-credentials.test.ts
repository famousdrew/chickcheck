import { describe, expect, it, vi, beforeEach } from "vitest";
import { hash } from "bcryptjs";

vi.mock("./prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "./prisma";
import { resetRateLimits } from "./rate-limit";
import { authorizeCredentials, TooManyLoginAttempts } from "./auth-credentials";

function requestFrom(ip: string) {
  return new Request("http://localhost/api/auth/callback/credentials", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("authorizeCredentials", () => {
  let passwordHash: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetRateLimits();
    passwordHash ??= await hash("password123", 4);
  });

  function mockUser() {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  it("should return null for missing credentials", async () => {
    expect(await authorizeCredentials({ email: "", password: "" })).toBeNull();
    expect(await authorizeCredentials(undefined)).toBeNull();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return the user for valid credentials", async () => {
    mockUser();

    const user = await authorizeCredentials(
      { email: "  Test@Example.com ", password: "password123" },
      requestFrom("203.0.113.1")
    );

    expect(user).toEqual({ id: "user-123", email: "test@example.com" });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });

  it("should return null for a wrong password", async () => {
    mockUser();

    const user = await authorizeCredentials(
      { email: "test@example.com", password: "wrong-password" },
      requestFrom("203.0.113.1")
    );

    expect(user).toBeNull();
  });

  it("should return null for an unknown user", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const user = await authorizeCredentials(
      { email: "nobody@example.com", password: "password123" },
      requestFrom("203.0.113.1")
    );

    expect(user).toBeNull();
  });

  it("should block an email after 10 attempts, even from different IPs", async () => {
    mockUser();

    for (let i = 0; i < 10; i++) {
      await authorizeCredentials(
        { email: "test@example.com", password: "wrong-password" },
        requestFrom(`203.0.113.${i}`)
      );
    }

    await expect(
      authorizeCredentials(
        { email: "test@example.com", password: "password123" },
        requestFrom("198.51.100.1")
      )
    ).rejects.toBeInstanceOf(TooManyLoginAttempts);
  });

  it("should block an IP after 30 attempts across different emails", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    for (let i = 0; i < 30; i++) {
      await authorizeCredentials(
        { email: `user${i}@example.com`, password: "password123" },
        requestFrom("203.0.113.50")
      );
    }

    await expect(
      authorizeCredentials(
        { email: "another@example.com", password: "password123" },
        requestFrom("203.0.113.50")
      )
    ).rejects.toMatchObject({ code: "rate_limited" });
  });
});
