import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runReminderJob } from "@/lib/reminders/job";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/**
 * Runs the reminder job on demand, for use with an external scheduler.
 * Requires CRON_SECRET and an "Authorization: Bearer <CRON_SECRET>" header.
 * The server already runs this job every 15 minutes on its own.
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runReminderJob();
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[reminders] Reminder job failed:", error);
    return NextResponse.json({ error: "Reminder job failed" }, { status: 500 });
  }
}
