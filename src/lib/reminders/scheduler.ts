import { runReminderJob } from "./job";

const INTERVAL_MS = 15 * 60 * 1000;
const STARTUP_DELAY_MS = 60 * 1000;

let started = false;
let running = false;

async function tick() {
  // Skip if the previous run is still going
  if (running) return;
  running = true;
  try {
    const { usersChecked, remindersSent } = await runReminderJob();
    if (remindersSent > 0) {
      console.log(
        `[reminders] Sent ${remindersSent} reminder(s), checked ${usersChecked} user(s)`
      );
    }
  } catch (error) {
    console.error("[reminders] Reminder job failed:", error);
  } finally {
    running = false;
  }
}

/**
 * Runs the reminder job every 15 minutes in this server process. The job is
 * idempotent, so it's safe alongside the /api/cron/reminders endpoint or if
 * more than one server instance runs it.
 */
export function startReminderScheduler() {
  if (started) return;
  started = true;

  setTimeout(tick, STARTUP_DELAY_MS).unref();
  setInterval(tick, INTERVAL_MS).unref();
  console.log("[reminders] Scheduler started (every 15 minutes)");
}
