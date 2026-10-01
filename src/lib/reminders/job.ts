import { FlockStatus, Prisma, ReminderKind, type Task } from "@prisma/client";
import { prisma } from "../prisma";
import { isPushConfigured, sendPushToUser, type PushPayload } from "../push";
import { calculateCurrentDay, calculateCurrentWeek } from "../services/flocks";
import { findTasksByWeek } from "../services/tasks";
import { findCompletionsByFlockAndDate } from "../services/task-completions";
import { DEFAULT_REMINDER_SETTINGS } from "../services/reminder-settings";
import { getCurrentHourInPacific, getTodayInPacific } from "../utils/timezone";
import {
  buildEveningReminder,
  buildMorningReminder,
  getTodaysTasks,
  type FlockDay,
} from "./content";

// A morning reminder that couldn't go out (e.g. server down) is still useful
// until noon; an evening one until midnight
const MORNING_CUTOFF_HOUR = 12;

interface ReminderSettingsLike {
  morningEnabled: boolean;
  morningHour: number;
  eveningEnabled: boolean;
  eveningHour: number;
}

/**
 * Which reminder, if any, is due for these settings at this Pacific hour.
 */
export function getDueReminder(
  settings: ReminderSettingsLike,
  hour: number
): ReminderKind | null {
  if (settings.eveningEnabled && hour >= settings.eveningHour) {
    return ReminderKind.EVENING;
  }
  if (
    settings.morningEnabled &&
    hour >= settings.morningHour &&
    hour < MORNING_CUTOFF_HOUR
  ) {
    return ReminderKind.MORNING;
  }
  return null;
}

/**
 * Records that a reminder is being sent. Returns false if it was already
 * sent today, so concurrent or repeated runs never send it twice.
 */
async function claimReminder(
  userId: string,
  kind: ReminderKind,
  dayDate: Date
): Promise<boolean> {
  try {
    await prisma.reminderLog.create({ data: { userId, kind, dayDate } });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return false;
    }
    throw error;
  }
}

/**
 * Sends any morning or evening reminders that are due. Safe to run as often
 * as you like; each reminder goes out at most once per user per day.
 */
export async function runReminderJob() {
  const summary = { usersChecked: 0, remindersSent: 0 };

  if (!isPushConfigured()) {
    return summary;
  }

  const hour = getCurrentHourInPacific();
  const today = getTodayInPacific();

  const users = await prisma.user.findMany({
    where: {
      pushSubscriptions: { some: {} },
      flocks: {
        some: { status: FlockStatus.ACTIVE, startDate: { not: null } },
      },
    },
    select: {
      id: true,
      reminderSettings: true,
      flocks: {
        where: { status: FlockStatus.ACTIVE, startDate: { not: null } },
        orderBy: { createdAt: "asc" },
      },
      reminderLogs: { where: { dayDate: today }, select: { kind: true } },
    },
  });

  // Tasks only vary by week, so share them across users
  const tasksByWeek = new Map<number, Task[]>();
  async function getTasks(week: number) {
    if (!tasksByWeek.has(week)) {
      tasksByWeek.set(week, await findTasksByWeek(week));
    }
    return tasksByWeek.get(week)!;
  }

  for (const user of users) {
    summary.usersChecked++;

    const settings = user.reminderSettings ?? DEFAULT_REMINDER_SETTINGS;
    const kind = getDueReminder(settings, hour);
    if (!kind || user.reminderLogs.some((log) => log.kind === kind)) {
      continue;
    }

    const flockDays: FlockDay[] = [];
    for (const flock of user.flocks) {
      const currentDay = calculateCurrentDay(flock.startDate!);
      const currentWeek = calculateCurrentWeek(flock.startDate!);
      const todaysTasks = getTodaysTasks(
        await getTasks(currentWeek),
        currentDay
      );
      const completions = await findCompletionsByFlockAndDate(flock.id, today);
      const done = new Set(completions.map((c) => c.taskId));

      flockDays.push({
        name: flock.name,
        currentWeek,
        currentDay,
        remainingTasks: todaysTasks.filter((t) => !done.has(t.id)).length,
      });
    }

    const payload: PushPayload | null =
      kind === ReminderKind.MORNING
        ? buildMorningReminder(flockDays)
        : buildEveningReminder(flockDays);

    if (!payload || !(await claimReminder(user.id, kind, today))) {
      continue;
    }

    await sendPushToUser(user.id, payload);
    summary.remindersSent++;
  }

  return summary;
}
