/**
 * Runs once when the Next.js server starts.
 * See https://nextjs.org/docs/app/guides/instrumentation
 */
export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "production" &&
    process.env.REMINDER_SCHEDULER !== "off"
  ) {
    const { startReminderScheduler } =
      await import("./lib/reminders/scheduler");
    startReminderScheduler();
  }
}
