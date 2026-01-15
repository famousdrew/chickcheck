import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "./route";
import * as userService from "@/lib/services/users";

// Mock user service
vi.mock("@/lib/services/users", () => ({
  createUser: vi.fn(),
  findUserByEmail: vi.fn(),
}));

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new user successfully", async () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(userService.findUserByEmail).mockResolvedValue(null);
    vi.mocked(userService.createUser).mockResolvedValue(mockUser);

    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.user.id).toBe("user-123");
    expect(data.user.email).toBe("test@example.com");
    expect(data.user).not.toHaveProperty("passwordHash");
  });

  it("should return 400 for missing email", async () => {
    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "password123" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email and password are required");
  });

  it("should return 400 for missing password", async () => {
    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email and password are required");
  });

  it("should return 400 for invalid email format", async () => {
    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "notanemail", password: "password123" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid email format");
  });

  it("should return 400 for short password", async () => {
    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "short" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Password must be at least 8 characters");
  });

  it("should return 409 if email already exists", async () => {
    const existingUser = {
      id: "existing-user",
      email: "test@example.com",
      passwordHash: "hashed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(userService.findUserByEmail).mockResolvedValue(existingUser);

    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("An account with this email already exists");
  });

  it("should return 500 on unexpected error", async () => {
    vi.mocked(userService.findUserByEmail).mockRejectedValue(
      new Error("Database error")
    );

    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Something went wrong. Please try again.");
  });
});
