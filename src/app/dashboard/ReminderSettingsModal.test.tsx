import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReminderSettingsModal, { formatHour } from "./ReminderSettingsModal";
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

const fetchMock = vi.fn();
const savedSettings = {
  morningEnabled: true,
  morningHour: 8,
  eveningEnabled: true,
  eveningHour: 19,
};

describe("ReminderSettingsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    push.status = "unsubscribed";
    push.error = "";
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockImplementation(async (_url: string, init?: RequestInit) => ({
      ok: true,
      json: async () =>
        init?.method === "PATCH"
          ? { ...savedSettings, ...JSON.parse(String(init.body)) }
          : savedSettings,
    }));
  });

  it("should format hours as 12-hour times", () => {
    expect(formatHour(5)).toBe("5 AM");
    expect(formatHour(12)).toBe("12 PM");
    expect(formatHour(19)).toBe("7 PM");
  });

  it("should show the saved settings", async () => {
    render(<ReminderSettingsModal isOpen onClose={() => {}} />);

    expect(await screen.findByLabelText(/morning reminder time/i)).toHaveValue(
      "8"
    );
    expect(screen.getByLabelText(/evening reminder time/i)).toHaveValue("19");
    expect(screen.getByRole("checkbox", { name: /morning/i })).toBeChecked();
  });

  it("should save a new reminder time", async () => {
    const user = userEvent.setup();
    render(<ReminderSettingsModal isOpen onClose={() => {}} />);

    await user.selectOptions(
      await screen.findByLabelText(/morning reminder time/i),
      "6"
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/reminder-settings",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ morningHour: 6 }),
        })
      );
    });
    expect(screen.getByLabelText(/morning reminder time/i)).toHaveValue("6");
  });

  it("should turn off the evening reminder", async () => {
    const user = userEvent.setup();
    render(<ReminderSettingsModal isOpen onClose={() => {}} />);

    await user.click(await screen.findByRole("checkbox", { name: /evening/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/reminder-settings",
        expect.objectContaining({
          body: JSON.stringify({ eveningEnabled: false }),
        })
      );
    });
    expect(screen.getByLabelText(/evening reminder time/i)).toBeDisabled();
  });

  it("should undo the change and show an error if saving fails", async () => {
    const user = userEvent.setup();
    render(<ReminderSettingsModal isOpen onClose={() => {}} />);
    const morning = await screen.findByRole("checkbox", { name: /morning/i });
    fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({}) });

    await user.click(morning);

    expect(await screen.findByText(/couldn't save/i)).toBeInTheDocument();
    expect(morning).toBeChecked();
  });

  it("should let the user turn on push for this device", async () => {
    const user = userEvent.setup();
    render(<ReminderSettingsModal isOpen onClose={() => {}} />);

    await user.click(screen.getByRole("button", { name: /turn on/i }));

    expect(push.subscribe).toHaveBeenCalled();
  });

  it("should let the user turn off push for this device", async () => {
    push.status = "subscribed";
    const user = userEvent.setup();
    render(<ReminderSettingsModal isOpen onClose={() => {}} />);

    await user.click(screen.getByRole("button", { name: /turn off/i }));

    expect(push.unsubscribe).toHaveBeenCalled();
  });

  it("should explain how to get reminders on iPhone", () => {
    push.status = "ios-needs-install";
    render(<ReminderSettingsModal isOpen onClose={() => {}} />);

    expect(screen.getByText(/add to home screen/i)).toBeInTheDocument();
  });
});
