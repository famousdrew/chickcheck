import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/services/push-subscriptions", () => ({
  savePushSubscription: vi.fn(),
  deletePushSubscription: vi.fn(),
}));

import { auth } from "@/lib/auth";
import {
  deletePushSubscription,
  savePushSubscription,
} from "@/lib/services/push-subscriptions";
import { DELETE, POST } from "./route";

const validSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
  expirationTime: null,
  keys: { p256dh: "p256dh-key", auth: "auth-key" },
};

function request(method: string, body: unknown) {
  return new Request("http://localhost/api/push/subscriptions", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/push/subscriptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com" },
      expires: "",
    } as never);
  });

  it("should require sign-in", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    const response = await POST(request("POST", validSubscription));

    expect(response.status).toBe(401);
    expect(savePushSubscription).not.toHaveBeenCalled();
  });

  it("should save the device's subscription", async () => {
    const response = await POST(request("POST", validSubscription));

    expect(response.status).toBe(201);
    expect(savePushSubscription).toHaveBeenCalledWith("user-1", {
      endpoint: validSubscription.endpoint,
      keys: validSubscription.keys,
    });
  });

  it("should reject subscriptions with a non-https endpoint or missing keys", async () => {
    const badBodies = [
      { ...validSubscription, endpoint: "http://insecure.example.com/x" },
      { ...validSubscription, endpoint: "not a url" },
      { ...validSubscription, keys: { p256dh: "p256dh-key" } },
      { endpoint: validSubscription.endpoint },
    ];

    for (const body of badBodies) {
      const response = await POST(request("POST", body));
      expect(response.status).toBe(400);
    }
    expect(savePushSubscription).not.toHaveBeenCalled();
  });

  it("should remove the device's subscription", async () => {
    const response = await DELETE(
      request("DELETE", { endpoint: validSubscription.endpoint })
    );

    expect(response.status).toBe(200);
    expect(deletePushSubscription).toHaveBeenCalledWith(
      "user-1",
      validSubscription.endpoint
    );
  });
});
