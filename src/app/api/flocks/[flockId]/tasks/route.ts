import { auth } from "@/lib/auth";
import { findFlockById, calculateCurrentDay } from "@/lib/services/flocks";
import { findTasksByWeek } from "@/lib/services/tasks";
import { findCompletionsByFlockAndDate } from "@/lib/services/task-completions";
import { getTodayInPacific } from "@/lib/utils/timezone";
import { NextResponse } from "next/server";

export async function GET(
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

  const { searchParams } = new URL(request.url);
  const weekParam = searchParams.get("week");

  // Determine current week and day based on flock start date
  let currentWeek = flock.currentWeek;
  let currentDay = 0;

  if (flock.startDate) {
    currentDay = calculateCurrentDay(flock.startDate);
    currentWeek = Math.min(Math.floor((currentDay - 1) / 7) + 1, 8);
  }

  const week = weekParam ? parseInt(weekParam, 10) : currentWeek;
  const tasks = await findTasksByWeek(week);

  // Get today's date in Pacific timezone for completion lookup
  const today = getTodayInPacific();

  const completions = await findCompletionsByFlockAndDate(flockId, today);
  const completedTaskIds = new Set(completions.map((c) => c.taskId));

  // Annotate tasks with completion status
  const tasksWithStatus = tasks.map((task) => ({
    ...task,
    isCompleted: completedTaskIds.has(task.id),
  }));

  return NextResponse.json({
    tasks: tasksWithStatus,
    currentWeek,
    currentDay,
    flockStatus: flock.status,
  });
}
