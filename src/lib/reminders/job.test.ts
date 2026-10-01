import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Prisma, ReminderKind } from "@prisma/client";

vi.mock("../prisma", () => ({
  prisma: {
    user: { findMany: vi.fn() },
    reminderLog: { create: vi.fn() },
  },
}));

vi.mock("../push", () => ({
  isPushConfigured: vi.fn(),
  sendPushToUser: vi.fn(),
}));

vi.mock("../services/tasks", () => ({
  findTasksByWeek: vi.fn(),
}));

vi.mock("../services/task-completions", () => ({
  findCompletionsByFlockAndDate: vi.fn(),
}));

import { prisma } from "../prisma";
import { isPushConfigured, sendPushToUser } from "../push";
import { findTasksByWeek } from "../services/tasks";
import { findCompletionsByFlockAndDate } from "../services/task-completions";
import { getDueReminder, runReminderJob } from "./job";

const DEFAULTS = {
  morningEnabled: true,
  morningHour: 8,
  eveningEnabled: true,
  eveningHour: 19,
};

/** Sets the clock to a Pacific wall-clock time on 2026-03-10 (PDT, UTC-7) */
function setPacificTime(hour: number) {
  vi.setSystemTime(new Date(Date.UTC(2026, 2, 10, hour + 7, 5)));
}

function userWithFlock(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    reminderSettings: null,
    reminderLogs: [],
    flocks: [
      {
        id: "flock-1",
        name: "Spring Hatch",
        // Day 3 on 2026-03-10
        startDate: new Date("2026-03-08T18:00:00Z"),
      },
    ],
    ...overrides,
  };
}

describe("getDueReminder", () => {
  it("should pick the morning reminder from its hour until noon", () => {
    expect(getDueReminder(DEFAULTS, 7)).toBeNull();
    expect(getDueReminder(DEFAULTS, 8)).toBe(ReminderKind.MORNING);
    expect(getDueReminder(DEFAULTS, 11)).toBe(ReminderKind.MORNING);
    expect(getDueReminder(DEFAULTS, 12)).toBeNull();
  });

  it("should pick the evening reminder from its hour until midnight", () => {
    expect(getDueReminder(DEFAULTS, 18)).toBeNull();
    expect(getDueReminder(DEFAULTS, 19)).toBe(ReminderKind.EVENING);
    expect(getDueReminder(DEFAULTS, 23)).toBe(ReminderKind.EVENING);
  });

  it("should respect disabled reminders and custom hours", () => {
    const settings = { ...DEFAULTS, morningEnabled: false, eveningHour: 21 };
    expect(getDueReminder(settings, 9)).toBeNull();
    expect(getDueReminder(settings, 20)).toBeNull();
    expect(getDueReminder(settings, 21)).toBe(ReminderKind.EVENING);
  });
});

describe("runReminderJob", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.mocked(isPushConfigured).mockReturnValue(true);
    vi.mocked(findTasksByWeek).mockResolvedValue([
      { id: "water", frequency: "DAILY", dayNumber: null },
      { id: "feed", frequency: "DAILY", dayNumber: null },
      { id: "day3", frequency: "ONCE", dayNumber: 3 },
    ] as never);
    vi.mocked(findCompletionsByFlockAndDate).mockResolvedValue([
      { taskId: "water" },
    ] as never);
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      userWithFlock(),
    ] as never);
    vi.mocked(prisma.reminderLog.create).mockResolvedValue({} as never);
    vi.mocked(sendPushToUser).mockResolvedValue({
      sent: 1,
      failed: 0,
      removed: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should send the morning reminder with today's remaining tasks", async () => {
    setPacificTime(8);

    const summary = await runReminderJob();

    expect(summary).toEqual({ usersChecked: 1, remindersSent: 1 });
    expect(prisma.reminderLog.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        kind: ReminderKind.MORNING,
        dayDate: new Date("2026-03-10T00:00:00.000Z"),
      },
    });
    expect(sendPushToUser).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({
        body: "2 tasks for Spring Hatch today (Week 1, Day 3).",
      })
    );
  });

  it("should send the evening reminder when tasks are unfinished", async () => {
    setPacificTime(19);

    await runReminderJob();

    expect(sendPushToUser).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ title: "Still to do today" })
    );
  });

  it("should skip the evening reminder when everything is done", async () => {
    setPacificTime(19);
    vi.mocked(findCompletionsByFlockAndDate).mockResolvedValue([
      { taskId: "water" },
      { taskId: "feed" },
      { taskId: "day3" },
    ] as never);

    const summary = await runReminderJob();

    expect(summary.remindersSent).toBe(0);
    expect(prisma.reminderLog.create).not.toHaveBeenCalled();
    expect(sendPushToUser).not.toHaveBeenCalled();
  });

  it("should not send outside the reminder windows", async () => {
    setPacificTime(14);

    await runReminderJob();

    expect(sendPushToUser).not.toHaveBeenCalled();
  });

  it("should not resend a reminder already logged today", async () => {
    setPacificTime(9);
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      userWithFlock({ reminderLogs: [{ kind: ReminderKind.MORNING }] }),
    ] as never);

    await runReminderJob();

    expect(sendPushToUser).not.toHaveBeenCalled();
  });

  it("should not send if another run claimed the reminder first", async () => {
    setPacificTime(8);
    vi.mocked(prisma.reminderLog.create).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        code: "P2002",
        clientVersion: "test",
      })
    );

    const summary = await runReminderJob();

    expect(summary.remindersSent).toBe(0);
    expect(sendPushToUser).not.toHaveBeenCalled();
  });

  it("should use the user's own reminder hours", async () => {
    setPacificTime(8);
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      userWithFlock({
        reminderSettings: { ...DEFAULTS, morningHour: 10 },
      }),
    ] as never);

    await runReminderJob();

    expect(sendPushToUser).not.toHaveBeenCalled();
  });

  it("should do nothing when push is not configured", async () => {
    setPacificTime(8);
    vi.mocked(isPushConfigured).mockReturnValue(false);

    const summary = await runReminderJob();

    expect(summary).toEqual({ usersChecked: 0, remindersSent: 0 });
    expect(prisma.user.findMany).not.toHaveBeenCalled();
  });
});
