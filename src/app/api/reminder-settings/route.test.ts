import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/services/reminder-settings", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/services/reminder-settings")>();
  return {
    ...actual,
    getReminderSettings: vi.fn(),
    updateReminderSettings: vi.fn(),
  };
});

import { auth } from "@/lib/auth";
import {
  DEFAULT_REMINDER_SETTINGS,
  getReminderSettings,
  updateReminderSettings,
} from "@/lib/services/reminder-settings";
import { GET, PATCH } from "./route";

function patch(body: unknown) {
  return PATCH(
    new Request("http://localhost/api/reminder-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}

describe("/api/reminder-settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com" },
      expires: "",
    } as never);
  });

  it("should return the user's settings", async () => {
    vi.mocked(getReminderSettings).mockResolvedValue(DEFAULT_REMINDER_SETTINGS);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(DEFAULT_REMINDER_SETTINGS);
    expect(getReminderSettings).toHaveBeenCalledWith("user-1");
  });

  it("should require sign-in", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    expect((await GET()).status).toBe(401);
    expect((await patch({ morningHour: 7 })).status).toBe(401);
  });

  it("should update valid settings", async () => {
    vi.mocked(updateReminderSettings).mockResolvedValue({
      ...DEFAULT_REMINDER_SETTINGS,
      eveningEnabled: false,
    });

    const response = await patch({ eveningEnabled: false });

    expect(response.status).toBe(200);
    expect(updateReminderSettings).toHaveBeenCalledWith("user-1", {
      eveningEnabled: false,
    });
  });

  it("should reject invalid settings", async () => {
    const response = await patch({ morningHour: 15 });

    expect(response.status).toBe(400);
    expect(updateReminderSettings).not.toHaveBeenCalled();
  });
});
