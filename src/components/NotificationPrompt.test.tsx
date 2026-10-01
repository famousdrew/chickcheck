import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationPrompt from "./NotificationPrompt";
import type { PushStatus } from "@/hooks/usePushSubscription";

const push = {
  status: "unsubscribed" as PushStatus,
  error: "",
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
};
vi.mock("@/hooks/usePushSubscription", () => ({
  usePushSubscription: () => push,
}));

const notifications = {
  supported: true,
  permission: "default" as NotificationPermission,
  requestPermission: vi.fn(),
  sendNotification: vi.fn(),
  isDismissed: () => false,
  dismiss: vi.fn(),
};
vi.mock("@/hooks/useNotifications", () => ({
  useNotifications: () => notifications,
}));

describe("NotificationPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    push.status = "unsubscribed";
    push.error = "";
    notifications.permission = "default";
    // Flock created more than a day ago, so the prompt may show
    localStorage.setItem(
      "chickcheck:flockCreatedAt",
      String(Date.now() - 2 * 24 * 60 * 60 * 1000)
    );
  });

  it("should offer push reminders and subscribe on Enable", async () => {
    push.subscribe.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<NotificationPrompt />);

    expect(
      screen.getByText(/even when ChickCheck is closed/i)
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /enable/i }));

    expect(push.subscribe).toHaveBeenCalled();
    expect(notifications.requestPermission).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /enable/i })).toBeNull();
  });

  it("should stay visible if subscribing fails", async () => {
    push.subscribe.mockResolvedValue(false);
    const user = userEvent.setup();
    render(<NotificationPrompt />);

    await user.click(screen.getByRole("button", { name: /enable/i }));

    expect(screen.getByRole("button", { name: /enable/i })).toBeInTheDocument();
  });

  it("should show Home Screen instructions on iPhone without an Enable button", () => {
    push.status = "ios-needs-install";
    render(<NotificationPrompt />);

    expect(screen.getByText(/add to home screen/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /enable/i })).toBeNull();
  });

  it("should fall back to in-tab notifications when push isn't set up", async () => {
    push.status = "disabled";
    const user = userEvent.setup();
    render(<NotificationPrompt />);

    expect(screen.getByText(/while the app is open/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /enable/i }));

    expect(notifications.requestPermission).toHaveBeenCalled();
  });

  it("should not show once the device is subscribed", () => {
    push.status = "subscribed";
    const { container } = render(<NotificationPrompt />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should not show in the first day after creating a flock", () => {
    localStorage.setItem("chickcheck:flockCreatedAt", String(Date.now()));
    const { container } = render(<NotificationPrompt />);

    expect(container).toBeEmptyDOMElement();
  });
});
