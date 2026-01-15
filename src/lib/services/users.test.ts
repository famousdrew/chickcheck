import { describe, expect, it, vi, beforeEach } from "vitest";
import { hash } from "bcryptjs";

// Mock prisma
vi.mock("../prisma", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

import { prisma } from "../prisma";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
} from "./users";

describe("User Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user with hashed password", async () => {
      const mockHashedPassword = "hashed_password_123";
      vi.mocked(hash).mockResolvedValue(mockHashedPassword as never);

      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: mockHashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

      const result = await createUser("test@example.com", "password123");

      expect(hash).toHaveBeenCalledWith("password123", 12);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          passwordHash: mockHashedPassword,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it("should throw error for invalid email", async () => {
      await expect(createUser("", "password123")).rejects.toThrow(
        "Email is required"
      );
    });

    it("should throw error for invalid password", async () => {
      await expect(createUser("test@example.com", "")).rejects.toThrow(
        "Password is required"
      );
    });

    it("should throw error for short password", async () => {
      await expect(createUser("test@example.com", "short")).rejects.toThrow(
        "Password must be at least 8 characters"
      );
    });
  });

  describe("findUserByEmail", () => {
    it("should find user by email", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await findUserByEmail("test@example.com");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null for non-existent email", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await findUserByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("findUserById", () => {
    it("should find user by id", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await findUserById("user-123");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null for non-existent id", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await findUserById("nonexistent-id");

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update user email", async () => {
      const mockUser = {
        id: "user-123",
        email: "updated@example.com",
        passwordHash: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);

      const result = await updateUser("user-123", {
        email: "updated@example.com",
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { email: "updated@example.com" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should update user password with hashing", async () => {
      const mockHashedPassword = "new_hashed_password";
      vi.mocked(hash).mockResolvedValue(mockHashedPassword as never);

      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: mockHashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser);

      const result = await updateUser("user-123", {
        password: "newpassword123",
      });

      expect(hash).toHaveBeenCalledWith("newpassword123", 12);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { passwordHash: mockHashedPassword },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("deleteUser", () => {
    it("should delete user by id", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        passwordHash: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.user.delete).mockResolvedValue(mockUser);

      const result = await deleteUser("user-123");

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
