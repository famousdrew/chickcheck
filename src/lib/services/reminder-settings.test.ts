import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../prisma", () => ({
  prisma: {
    reminderSettings: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from "../prisma";
import {
  DEFAULT_REMINDER_SETTINGS,
  getReminderSettings,
  parseReminderSettings,
  updateReminderSettings,
} from "./reminder-settings";

describe("Reminder settings service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getReminderSettings", () => {
    it("should return defaults when the user has no saved settings", async () => {
      vi.mocked(prisma.reminderSettings.findUnique).mockResolvedValue(null);

      expect(await getReminderSettings("user-1")).toEqual(
        DEFAULT_REMINDER_SETTINGS
      );
    });

    it("should return saved settings", async () => {
      vi.mocked(prisma.reminderSettings.findUnique).mockResolvedValue({
        userId: "user-1",
        morningEnabled: false,
        morningHour: 6,
        eveningEnabled: true,
        eveningHour: 20,
        updatedAt: new Date(),
      });

      expect(await getReminderSettings("user-1")).toEqual({
        morningEnabled: false,
        morningHour: 6,
        eveningEnabled: true,
        eveningHour: 20,
      });
    });
  });

  describe("updateReminderSettings", () => {
    it("should create settings from defaults on first save", async () => {
      vi.mocked(prisma.reminderSettings.upsert).mockResolvedValue({
        userId: "user-1",
        ...DEFAULT_REMINDER_SETTINGS,
        morningHour: 7,
        updatedAt: new Date(),
      });

      await updateReminderSettings("user-1", { morningHour: 7 });

      expect(prisma.reminderSettings.upsert).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        update: { morningHour: 7 },
        create: {
          ...DEFAULT_REMINDER_SETTINGS,
          morningHour: 7,
          userId: "user-1",
        },
      });
    });
  });

  describe("parseReminderSettings", () => {
    it("should accept valid fields", () => {
      expect(
        parseReminderSettings({
          morningEnabled: false,
          morningHour: 6,
          eveningEnabled: true,
          eveningHour: 21,
        })
      ).toEqual({
        data: {
          morningEnabled: false,
          morningHour: 6,
          eveningEnabled: true,
          eveningHour: 21,
        },
      });
    });

    it("should ignore unknown fields", () => {
      expect(parseReminderSettings({ eveningHour: 18, userId: "x" })).toEqual({
        data: { eveningHour: 18 },
      });
    });

    it("should reject hours outside the allowed window", () => {
      expect(parseReminderSettings({ morningHour: 14 })).toHaveProperty(
        "error"
      );
      expect(parseReminderSettings({ eveningHour: 3 })).toHaveProperty("error");
      expect(parseReminderSettings({ morningHour: 7.5 })).toHaveProperty(
        "error"
      );
      expect(parseReminderSettings({ morningHour: "8" })).toHaveProperty(
        "error"
      );
    });

    it("should reject non-boolean toggles and empty updates", () => {
      expect(parseReminderSettings({ morningEnabled: "yes" })).toHaveProperty(
        "error"
      );
      expect(parseReminderSettings({})).toHaveProperty("error");
    });
  });
});
