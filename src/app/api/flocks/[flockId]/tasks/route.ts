import { auth } from "@/lib/auth";
import { findFlockById, calculateCurrentDay } from "@/lib/services/flocks";
import { findTasksByWeek } from "@/lib/services/tasks";
import {
  findCompletionsByFlockAndDate,
  findCompletionsByFlockDateRange,
} from "@/lib/services/task-completions";
import {
  getTodayInPacific,
  normalizeDateToPacific,
} from "@/lib/utils/timezone";
import { withErrorHandler } from "@/lib/api-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (
    request: Request,
    { params }: { params: Promise<{ flockId: string }> }
  ) => {
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

    // Detect overdue tasks (only when viewing current week, flock is active)
    let overdueTasks: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      frequency: string;
      dayNumber: number | null;
      missedDay: number;
    }> = [];

    if (
      week === currentWeek &&
      flock.startDate &&
      flock.status === "ACTIVE" &&
      currentDay > 1
    ) {
      const startDateNorm = normalizeDateToPacific(flock.startDate);

      // Calculate the first day of the current week (absolute day number)
      const weekStartDay = (currentWeek - 1) * 7 + 1;

      // Get date range: start of current week to yesterday
      const weekStartDate = new Date(
        startDateNorm.getTime() + (weekStartDay - 1) * 86400000
      );
      const yesterday = new Date(today.getTime() - 86400000);

      // Only check if yesterday is at or after the week start
      if (yesterday >= weekStartDate) {
        const pastCompletions = await findCompletionsByFlockDateRange(
          flockId,
          weekStartDate,
          yesterday
        );

        // Index completions by taskId+dayDate for fast lookup
        const completionIndex = new Set(
          pastCompletions.map((c) => `${c.taskId}:${c.dayDate.toISOString()}`)
        );

        // Check each past day in the current week
        for (let day = Math.max(weekStartDay, 1); day < currentDay; day++) {
          const dayDate = new Date(
            startDateNorm.getTime() + (day - 1) * 86400000
          );
          const dayDateStr = dayDate.toISOString();

          for (const task of tasks) {
            // DAILY tasks: only check yesterday (going further back is noisy)
            if (task.frequency === "DAILY" && day === currentDay - 1) {
              if (!completionIndex.has(`${task.id}:${dayDateStr}`)) {
                overdueTasks.push({
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  frequency: task.frequency,
                  dayNumber: task.dayNumber,
                  missedDay: day,
                });
              }
            }

            // ONCE tasks: check all past days in the week
            if (
              task.frequency !== "DAILY" &&
              task.dayNumber !== null &&
              task.dayNumber === day
            ) {
              if (!completionIndex.has(`${task.id}:${dayDateStr}`)) {
                overdueTasks.push({
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  category: task.category,
                  frequency: task.frequency,
                  dayNumber: task.dayNumber,
                  missedDay: day,
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      tasks: tasksWithStatus,
      overdueTasks,
      currentWeek,
      currentDay,
      flockStatus: flock.status,
    });
  }
);
