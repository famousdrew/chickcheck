import { prisma } from "../prisma";

export interface ReminderSettingsData {
  morningEnabled: boolean;
  morningHour: number;
  eveningEnabled: boolean;
  eveningHour: number;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettingsData = {
  morningEnabled: true,
  morningHour: 8,
  eveningEnabled: true,
  eveningHour: 19,
};

// Allowed hours (Pacific, 24h clock)
export const MORNING_HOURS = { min: 5, max: 11 };
export const EVENING_HOURS = { min: 16, max: 22 };

export async function getReminderSettings(
  userId: string
): Promise<ReminderSettingsData> {
  const settings = await prisma.reminderSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    return DEFAULT_REMINDER_SETTINGS;
  }

  return {
    morningEnabled: settings.morningEnabled,
    morningHour: settings.morningHour,
    eveningEnabled: settings.eveningEnabled,
    eveningHour: settings.eveningHour,
  };
}

export async function updateReminderSettings(
  userId: string,
  data: Partial<ReminderSettingsData>
): Promise<ReminderSettingsData> {
  const settings = await prisma.reminderSettings.upsert({
    where: { userId },
    update: data,
    create: { ...DEFAULT_REMINDER_SETTINGS, ...data, userId },
  });

  return {
    morningEnabled: settings.morningEnabled,
    morningHour: settings.morningHour,
    eveningEnabled: settings.eveningEnabled,
    eveningHour: settings.eveningHour,
  };
}

/**
 * Validates a PATCH body, returning only known fields within range.
 */
export function parseReminderSettings(
  body: Record<string, unknown>
): { data: Partial<ReminderSettingsData> } | { error: string } {
  const data: Partial<ReminderSettingsData> = {};

  for (const key of ["morningEnabled", "eveningEnabled"] as const) {
    if (body[key] !== undefined) {
      if (typeof body[key] !== "boolean") {
        return { error: `${key} must be true or false` };
      }
      data[key] = body[key];
    }
  }

  const hourFields = [
    ["morningHour", MORNING_HOURS],
    ["eveningHour", EVENING_HOURS],
  ] as const;
  for (const [key, range] of hourFields) {
    const value = body[key];
    if (value !== undefined) {
      if (
        typeof value !== "number" ||
        !Number.isInteger(value) ||
        value < range.min ||
        value > range.max
      ) {
        return {
          error: `${key} must be a whole hour from ${range.min} to ${range.max}`,
        };
      }
      data[key] = value;
    }
  }

  if (Object.keys(data).length === 0) {
    return { error: "No valid fields to update" };
  }

  return { data };
}
