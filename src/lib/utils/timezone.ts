/**
 * Timezone utilities for Pacific Time (PT)
 * Handles PST (UTC-8) and PDT (UTC-7) automatically
 */

const PACIFIC_TIMEZONE = "America/Los_Angeles";

/**
 * Get the current date in Pacific timezone as a Date object set to midnight UTC
 * This ensures consistent date comparisons in the database
 */
export function getTodayInPacific(): Date {
  // Get current time formatted in Pacific timezone
  const pacificDateStr = new Date().toLocaleDateString("en-CA", {
    timeZone: PACIFIC_TIMEZONE,
  }); // Returns YYYY-MM-DD format

  // Parse as UTC midnight
  return new Date(pacificDateStr + "T00:00:00.000Z");
}

/**
 * Get a specific date normalized to midnight UTC, interpreted as Pacific date
 * Use this when you have a date and want to normalize it for database storage
 */
export function normalizeDateToPacific(date: Date): Date {
  const pacificDateStr = date.toLocaleDateString("en-CA", {
    timeZone: PACIFIC_TIMEZONE,
  });
  return new Date(pacificDateStr + "T00:00:00.000Z");
}

/**
 * Get the current day number (1-7) in Pacific timezone
 */
export function getCurrentDayInPacific(): number {
  const now = new Date();
  const pacificDay = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: PACIFIC_TIMEZONE,
      day: "numeric",
    }).format(now),
    10
  );
  return pacificDay;
}

/**
 * Format a date for display in Pacific timezone
 */
export function formatDateInPacific(
  date: Date,
  options?: Intl.DateTimeFormatOptions
): string {
  return date.toLocaleDateString("en-US", {
    timeZone: PACIFIC_TIMEZONE,
    ...options,
  });
}
