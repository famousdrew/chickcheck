import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  hasActivePushSubscription,
  usePushSubscription,
} from "./usePushSubscription";

// A valid-length base64url P-256 public key
const PUBLIC_KEY =
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

const fakeSubscription = {
  endpoint: "https://push.example.com/device-1",
  toJSON: () => ({
    endpoint: "https://push.example.com/device-1",
    keys: { p256dh: "p", auth: "a" },
  }),
  unsubscribe: vi.fn().mockResolvedValue(true),
};

const pushManager = {
  getSubscription: vi.fn(),
  subscribe: vi.fn(),
};

const fetchMock = vi.fn();

function installBrowserApis({
  permission = "default" as NotificationPermission,
  requestResult = "granted" as NotificationPermission,
  registered = true,
} = {}) {
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      getRegistration: vi
        .fn()
        .mockResolvedValue(registered ? { pushManager } : undefined),
    },
  });
  vi.stubGlobal("PushManager", function PushManager() {});
  vi.stubGlobal(
    "Notification",
    Object.assign(function Notification() {}, {
      permission,
      requestPermission: vi.fn().mockResolvedValue(requestResult),
    })
  );
}

function mockServerConfig(enabled = true) {
  fetchMock.mockImplementation(async (url: string) => {
    if (url === "/api/push/config") {
      return {
        ok: true,
        json: async () => ({
          enabled,
          publicKey: enabled ? PUBLIC_KEY : null,
        }),
      };
    }
    return { ok: true, json: async () => ({}) };
  });
}

describe("usePushSubscription", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    mockServerConfig();
    pushManager.getSubscription.mockResolvedValue(null);
    pushManager.subscribe.mockResolvedValue(fakeSubscription);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    // @ts-expect-error - remove the test double
    delete navigator.serviceWorker;
  });

  it("should report unsupported when the browser has no push support", async () => {
    const { result } = renderHook(() => usePushSubscription());

    await waitFor(() => expect(result.current.status).toBe("unsupported"));
  });

  it("should ask iPhone users to install the app first", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
    );

    const { result } = renderHook(() => usePushSubscription());

    await waitFor(() =>
      expect(result.current.status).toBe("ios-needs-install")
    );
    vi.restoreAllMocks();
  });

  it("should report disabled when the server has no VAPID keys", async () => {
    installBrowserApis();
    mockServerConfig(false);

    const { result } = renderHook(() => usePushSubscription());

    await waitFor(() => expect(result.current.status).toBe("disabled"));
  });

  it("should report denied when notifications are blocked", async () => {
    installBrowserApis({ permission: "denied" });

    const { result } = renderHook(() => usePushSubscription());

    await waitFor(() => expect(result.current.status).toBe("denied"));
  });

  it("should report unsubscribed when there is no subscription yet", async () => {
    installBrowserApis();

    const { result } = renderHook(() => usePushSubscription());

    await waitFor(() => expect(result.current.status).toBe("unsubscribed"));
  });

  it("should re-save an existing subscription and report subscribed", async () => {
    installBrowserApis({ permission: "granted" });
    pushManager.getSubscription.mockResolvedValue(fakeSubscription);

    const { result } = renderHook(() => usePushSubscription());

    await waitFor(() => expect(result.current.status).toBe("subscribed"));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/push/subscriptions",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("should subscribe and save the subscription to the server", async () => {
    installBrowserApis();
    const { result } = renderHook(() => usePushSubscription());
    await waitFor(() => expect(result.current.status).toBe("unsubscribed"));

    let succeeded = false;
    await act(async () => {
      succeeded = await result.current.subscribe();
    });

    expect(succeeded).toBe(true);
    expect(result.current.status).toBe("subscribed");
    expect(pushManager.subscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: expect.any(Uint8Array),
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/push/subscriptions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(fakeSubscription.toJSON()),
      })
    );
  });

  it("should not subscribe if the user declines permission", async () => {
    installBrowserApis({ requestResult: "denied" });
    const { result } = renderHook(() => usePushSubscription());
    await waitFor(() => expect(result.current.status).toBe("unsubscribed"));

    let succeeded = true;
    await act(async () => {
      succeeded = await result.current.subscribe();
    });

    expect(succeeded).toBe(false);
    expect(result.current.status).toBe("denied");
    expect(pushManager.subscribe).not.toHaveBeenCalled();
  });

  it("should unsubscribe and tell the server", async () => {
    installBrowserApis({ permission: "granted" });
    pushManager.getSubscription.mockResolvedValue(fakeSubscription);
    const { result } = renderHook(() => usePushSubscription());
    await waitFor(() => expect(result.current.status).toBe("subscribed"));

    await act(async () => {
      await result.current.unsubscribe();
    });

    expect(result.current.status).toBe("unsubscribed");
    expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/push/subscriptions",
      expect.objectContaining({
        method: "DELETE",
        body: JSON.stringify({ endpoint: fakeSubscription.endpoint }),
      })
    );
  });

  describe("hasActivePushSubscription", () => {
    it("should be true only when this device has a subscription", async () => {
      installBrowserApis();
      expect(await hasActivePushSubscription()).toBe(false);

      pushManager.getSubscription.mockResolvedValue(fakeSubscription);
      expect(await hasActivePushSubscription()).toBe(true);
    });
  });
});
