import { describe, expect, it, vi, beforeEach } from "vitest";
import { createHash } from "node:crypto";

vi.mock("../prisma", () => ({
  prisma: {
    passwordResetToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("./users", () => ({
  updateUser: vi.fn(),
}));

import { prisma } from "../prisma";
import { updateUser } from "./users";
import {
  createPasswordResetToken,
  resetPasswordWithToken,
} from "./password-reset";

const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");

describe("Password reset service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPasswordResetToken", () => {
    it("should store only a hash of the token, expiring in an hour", async () => {
      const before = Date.now();

      const token = await createPasswordResetToken("user-1");

      expect(token.length).toBeGreaterThanOrEqual(40);
      const { data } = vi.mocked(prisma.passwordResetToken.create).mock
        .calls[0][0];
      expect(data.userId).toBe("user-1");
      expect(data.tokenHash).toBe(sha256(token));
      expect(data.tokenHash).not.toBe(token);
      const expiresAt = (data.expiresAt as Date).getTime();
      expect(expiresAt - before).toBeGreaterThanOrEqual(60 * 60 * 1000 - 1000);
      expect(expiresAt - before).toBeLessThanOrEqual(60 * 60 * 1000 + 1000);
    });

    it("should invalidate earlier tokens for the user", async () => {
      await createPasswordResetToken("user-1");

      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
    });

    it("should generate a different token each time", async () => {
      const a = await createPasswordResetToken("user-1");
      const b = await createPasswordResetToken("user-1");
      expect(a).not.toBe(b);
    });
  });

  describe("resetPasswordWithToken", () => {
    const record = {
      id: "token-1",
      tokenHash: sha256("good-token"),
      userId: "user-1",
      expiresAt: new Date(Date.now() + 60_000),
      usedAt: null,
      createdAt: new Date(),
    };

    it("should update the password for a valid token", async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(record);
      vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValue({
        count: 1,
      });

      const result = await resetPasswordWithToken("good-token", "newpass123");

      expect(result).toBe(true);
      expect(prisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { tokenHash: sha256("good-token") },
      });
      expect(updateUser).toHaveBeenCalledWith("user-1", {
        password: "newpass123",
      });
    });

    it("should only claim the token if it is unused and unexpired", async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(record);
      vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValue({
        count: 1,
      });

      await resetPasswordWithToken("good-token", "newpass123");

      expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith({
        where: {
          id: "token-1",
          usedAt: null,
          expiresAt: { gt: expect.any(Date) },
        },
        data: { usedAt: expect.any(Date) },
      });
    });

    it("should reject an unknown token", async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null);

      const result = await resetPasswordWithToken("bad-token", "newpass123");

      expect(result).toBe(false);
      expect(updateUser).not.toHaveBeenCalled();
    });

    it("should reject a used or expired token", async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(record);
      vi.mocked(prisma.passwordResetToken.updateMany).mockResolvedValue({
        count: 0,
      });

      const result = await resetPasswordWithToken("good-token", "newpass123");

      expect(result).toBe(false);
      expect(updateUser).not.toHaveBeenCalled();
    });
  });
});
