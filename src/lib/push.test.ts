import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("web-push", () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
  },
}));

vi.mock("./prisma", () => ({
  prisma: {
    pushSubscription: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import webpush from "web-push";
import { prisma } from "./prisma";
import { isPushConfigured, sendPushToUser } from "./push";

const subscription = (id: string) => ({
  id,
  endpoint: `https://push.example.com/${id}`,
  p256dh: "p256dh-key",
  auth: "auth-key",
  createdAt: new Date(),
  userId: "user-1",
});

describe("push", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VAPID_PUBLIC_KEY", "public-key");
    vi.stubEnv("VAPID_PRIVATE_KEY", "private-key");
    vi.stubEnv("VAPID_SUBJECT", "mailto:drew@example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("isPushConfigured", () => {
    it("should require both VAPID keys", () => {
      expect(isPushConfigured()).toBe(true);
      vi.stubEnv("VAPID_PRIVATE_KEY", "");
      expect(isPushConfigured()).toBe(false);
    });
  });

  describe("sendPushToUser", () => {
    it("should send the payload to every subscribed device", async () => {
      vi.mocked(prisma.pushSubscription.findMany).mockResolvedValue([
        subscription("a"),
        subscription("b"),
      ]);
      vi.mocked(webpush.sendNotification).mockResolvedValue({} as never);

      const result = await sendPushToUser("user-1", {
        title: "Hi",
        body: "Check on your chicks",
      });

      expect(result).toEqual({ sent: 2, failed: 0, removed: 0 });
      expect(webpush.setVapidDetails).toHaveBeenCalledWith(
        "mailto:drew@example.com",
        "public-key",
        "private-key"
      );
      expect(webpush.sendNotification).toHaveBeenCalledWith(
        {
          endpoint: "https://push.example.com/a",
          keys: { p256dh: "p256dh-key", auth: "auth-key" },
        },
        JSON.stringify({ title: "Hi", body: "Check on your chicks" }),
        expect.objectContaining({ TTL: expect.any(Number) })
      );
    });

    it("should remove subscriptions the push service says are gone", async () => {
      vi.mocked(prisma.pushSubscription.findMany).mockResolvedValue([
        subscription("expired"),
        subscription("ok"),
      ]);
      vi.mocked(webpush.sendNotification).mockImplementation(async (sub) => {
        if (sub.endpoint.endsWith("expired")) {
          throw Object.assign(new Error("Gone"), { statusCode: 410 });
        }
        return {} as never;
      });

      const result = await sendPushToUser("user-1", { title: "t", body: "b" });

      expect(result).toEqual({ sent: 1, failed: 0, removed: 1 });
      expect(prisma.pushSubscription.deleteMany).toHaveBeenCalledWith({
        where: { id: "expired" },
      });
    });

    it("should keep subscriptions after other errors", async () => {
      vi.mocked(prisma.pushSubscription.findMany).mockResolvedValue([
        subscription("a"),
      ]);
      vi.mocked(webpush.sendNotification).mockRejectedValue(
        Object.assign(new Error("Server error"), { statusCode: 500 })
      );
      vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await sendPushToUser("user-1", { title: "t", body: "b" });

      expect(result).toEqual({ sent: 0, failed: 1, removed: 0 });
      expect(prisma.pushSubscription.deleteMany).not.toHaveBeenCalled();
    });

    it("should do nothing when VAPID keys are not set", async () => {
      vi.stubEnv("VAPID_PUBLIC_KEY", "");

      const result = await sendPushToUser("user-1", { title: "t", body: "b" });

      expect(result).toEqual({ sent: 0, failed: 0, removed: 0 });
      expect(prisma.pushSubscription.findMany).not.toHaveBeenCalled();
    });
  });
});
