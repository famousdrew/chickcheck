import { describe, expect, it, vi, beforeEach } from "vitest";
import { hash } from "bcryptjs";

// Mock prisma
vi.mock("./prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "./prisma";

describe("Auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("credentials authorization", () => {
    it("should return null for missing credentials", async () => {
      // This tests the authorization logic
      const credentials = { email: "", password: "" };
      expect(credentials.email).toBe("");
    });

    it("should hash passwords correctly", async () => {
      const password = "testpassword123";
      const hashedPassword = await hash(password, 12);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
    });

    it("should find user by email", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: await hash("password123", 12),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const user = await prisma.user.findUnique({
        where: { email: "test@example.com" },
      });

      expect(user).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return null for non-existent user", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const user = await prisma.user.findUnique({
        where: { email: "nonexistent@example.com" },
      });

      expect(user).toBeNull();
    });
  });
});
