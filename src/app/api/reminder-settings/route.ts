import { auth } from "@/lib/auth";
import {
  getReminderSettings,
  parseReminderSettings,
  updateReminderSettings,
} from "@/lib/services/reminder-settings";
import { withErrorHandler } from "@/lib/api-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getReminderSettings(session.user.id);
  return NextResponse.json(settings);
});

export const PATCH = withErrorHandler(async (request: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = parseReminderSettings(body ?? {});

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const settings = await updateReminderSettings(session.user.id, result.data);
  return NextResponse.json(settings);
});
