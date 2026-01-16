import { auth } from "@/lib/auth";
import { findFlockById } from "@/lib/services/flocks";
import {
  completeTask,
  undoTaskCompletion,
} from "@/lib/services/task-completions";
import { getTodayInPacific } from "@/lib/utils/timezone";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ flockId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId } = await params;
  const flock = await findFlockById(flockId);

  if (!flock) {
    return NextResponse.json({ error: "Flock not found" }, { status: 404 });
  }

  if (flock.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { taskId, dayDate, notes, action } = body;

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });
  }

  // Use today in Pacific timezone if dayDate not provided
  const date = dayDate ? new Date(dayDate) : getTodayInPacific();
  if (dayDate) {
    date.setUTCHours(0, 0, 0, 0); // Normalize provided dates to midnight UTC
  }

  if (action === "undo") {
    const completion = await undoTaskCompletion(flockId, taskId, date);
    return NextResponse.json(completion);
  }

  const completion = await completeTask(flockId, taskId, date, notes);
  return NextResponse.json(completion, { status: 201 });
}
