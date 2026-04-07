"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TaskCategory, TaskFrequency, FlockStatus } from "@prisma/client";
import TaskItem from "./TaskItem";
import TemperatureCard from "./TemperatureCard";
import FlockDashboardHeader from "./FlockDashboardHeader";
import NotificationPrompt from "@/components/NotificationPrompt";
import { useTaskReminder } from "@/hooks/useTaskReminder";

interface Task {
  id: string;
  title: string;
  description: string;
  detailedContent: string;
  weekNumber: number;
  dayNumber: number | null;
  frequency: TaskFrequency;
  category: TaskCategory;
  sortOrder: number;
  isCompleted: boolean;
}

interface OverdueTask {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  dayNumber: number | null;
  missedDay: number;
}

interface TaskListProps {
  flockId: string;
  flock: {
    id: string;
    name: string;
    status: FlockStatus;
    startDate: string | null;
    currentWeek: number;
  };
}

export default function TaskList({ flockId, flock }: TaskListProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showOverdue, setShowOverdue] = useState(true);
  const [isGraduating, setIsGraduating] = useState(false);

  const fetchTasks = useCallback(
    async (week?: number) => {
      setIsLoading(true);
      try {
        const weekParam = week !== undefined ? `?week=${week}` : "";
        const response = await fetch(
          `/api/flocks/${flockId}/tasks${weekParam}`
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data.tasks);
        setOverdueTasks(data.overdueTasks || []);
        setCurrentWeek(data.currentWeek);
        setCurrentDay(data.currentDay);
        if (week === undefined) {
          setSelectedWeek(data.currentWeek);
        }
      } catch {
        setError("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    },
    [flockId]
  );

  const handleWeekChange = useCallback(
    (week: number) => {
      setSelectedWeek(week);
      fetchTasks(week);
    },
    [fetchTasks]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleGraduate() {
    setIsGraduating(true);
    try {
      await fetch(`/api/flocks/${flockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "GRADUATED" }),
      });
      router.refresh();
    } catch {
      setError("Failed to graduate flock");
    } finally {
      setIsGraduating(false);
    }
  }

  const showGraduationBanner = currentWeek >= 8 && flock.status === "ACTIVE";

  // Compute pending count for notifications (safe to call before early returns)
  const isViewingCurrentWeek = selectedWeek === currentWeek;
  const todaysTasks = isViewingCurrentWeek
    ? tasks.filter(
        (t) =>
          t.frequency === "DAILY" ||
          (t.dayNumber !== null && t.dayNumber === currentDay)
      )
    : [];
  const pendingTasks = todaysTasks.filter((t) => !t.isCompleted);
  const completedTasks = todaysTasks.filter((t) => t.isCompleted);

  // Browser notifications for pending/overdue tasks (must be before early returns)
  useTaskReminder({
    flockId: flock.status === "ACTIVE" ? flockId : null,
    pendingCount: pendingTasks.length,
    overdueCount: overdueTasks.length,
    isActive: isViewingCurrentWeek && !isLoading,
  });

  if (isLoading) {
    return (
      <div className="rounded-rustic shadow-rustic bg-white p-8">
        <div className="flex items-center justify-center">
          <div className="border-grass-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-rustic shadow-rustic bg-white p-8">
        <p className="text-barn-500 text-center">{error}</p>
      </div>
    );
  }

  const upcomingTasks = isViewingCurrentWeek
    ? tasks.filter(
        (t) =>
          t.frequency !== "DAILY" &&
          t.dayNumber !== null &&
          t.dayNumber > currentDay
      )
    : [];

  // For weekly view (past/future), group by category
  const allWeekTasks = !isViewingCurrentWeek ? tasks : [];
  const dailyTasks = allWeekTasks.filter((t) => t.frequency === "DAILY");
  const oneTimeTasks = allWeekTasks.filter((t) => t.frequency !== "DAILY");

  const completedCount = isViewingCurrentWeek
    ? completedTasks.length
    : tasks.filter((t) => t.isCompleted).length;
  const totalCount = isViewingCurrentWeek ? todaysTasks.length : tasks.length;

  return (
    <div className="space-y-6">
      {/* Combined Dashboard Header */}
      <FlockDashboardHeader
        flock={flock}
        currentWeek={currentWeek}
        currentDay={currentDay}
        selectedWeek={selectedWeek}
        onWeekChange={handleWeekChange}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Notification prompt */}
      {flock.status === "ACTIVE" && <NotificationPrompt />}

      {/* Temperature Card */}
      <TemperatureCard weekNumber={selectedWeek} />

      {/* Graduation banner */}
      {showGraduationBanner && (
        <div className="rounded-rustic shadow-rustic bg-purple-50 p-6 text-center">
          <h3 className="font-display text-lg font-bold text-purple-800">
            Congratulations!
          </h3>
          <p className="text-wood-dark/70 mt-1 text-sm">
            Your flock has completed the 8-week brooding program. Ready to
            graduate?
          </p>
          <button
            onClick={handleGraduate}
            disabled={isGraduating}
            className="rounded-rustic mt-3 bg-purple-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
          >
            {isGraduating ? "Graduating..." : "Graduate Flock!"}
          </button>
        </div>
      )}

      {/* Overdue Tasks - only show for current week */}
      {isViewingCurrentWeek && overdueTasks.length > 0 && (
        <div className="rounded-rustic shadow-rustic border-barn-500/30 border bg-rose-50 p-6">
          <button
            onClick={() => setShowOverdue(!showOverdue)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <svg
                className="text-barn-500 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="font-display text-barn-600 text-lg font-bold">
                Overdue ({overdueTasks.length})
              </h3>
            </div>
            <svg
              className={`text-barn-500/50 h-5 w-5 transition-transform ${
                showOverdue ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {showOverdue && (
            <div className="mt-4 space-y-2">
              {overdueTasks.map((task, i) => (
                <div
                  key={`${task.id}-${task.missedDay}-${i}`}
                  className="rounded-rustic border-barn-500/20 border bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-wood-dark text-sm font-medium">
                        {task.title}
                      </h4>
                      <p className="text-wood-dark/60 mt-0.5 text-xs">
                        {task.description}
                      </p>
                    </div>
                    <span className="text-barn-500 flex-shrink-0 text-xs font-medium">
                      Day {task.missedDay}
                    </span>
                  </div>
                </div>
              ))}
              <p className="text-barn-500/70 pt-1 text-xs">
                {overdueTasks.some((t) => t.frequency === "DAILY")
                  ? "Daily tasks shown are from yesterday. One-time tasks are from earlier this week."
                  : "These tasks were scheduled for earlier this week."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Today's Tasks - only show for current week */}
      {isViewingCurrentWeek && (
        <div className="rounded-rustic shadow-rustic bg-white p-6">
          <h3 className="font-display text-wood-dark mb-4 text-lg font-bold">
            Today&apos;s Tasks
          </h3>
          {pendingTasks.length === 0 && completedTasks.length === 0 ? (
            <p className="text-wood-dark/50 py-4 text-center">
              No tasks for today. Great job!
            </p>
          ) : pendingTasks.length === 0 ? (
            <p className="text-wood-dark/50 py-4 text-center">
              All done for today!
            </p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  flockId={flockId}
                  currentDay={currentDay}
                  onToggle={() => fetchTasks(selectedWeek)}
                />
              ))}
            </div>
          )}

          {/* Completed Today Accordion */}
          {completedTasks.length > 0 && (
            <div className="border-wood-dark/10 mt-4 border-t pt-4">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-wood-dark/60 text-sm font-medium">
                  Completed today ({completedTasks.length})
                </span>
                <svg
                  className={`text-wood-dark/40 h-5 w-5 transition-transform ${
                    showCompleted ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showCompleted && (
                <div className="mt-3 space-y-3">
                  {completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      flockId={flockId}
                      currentDay={currentDay}
                      onToggle={() => fetchTasks(selectedWeek)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Weekly View - for past/future weeks */}
      {!isViewingCurrentWeek && (
        <>
          {/* Daily Tasks */}
          {dailyTasks.length > 0 && (
            <div className="rounded-rustic shadow-rustic bg-white p-6">
              <h3 className="font-display text-wood-dark mb-4 text-lg font-bold">
                Daily Tasks
              </h3>
              <div className="space-y-3">
                {dailyTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    flockId={flockId}
                    currentDay={currentDay}
                    onToggle={() => fetchTasks(selectedWeek)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* One-time Tasks */}
          {oneTimeTasks.length > 0 && (
            <div className="rounded-rustic shadow-rustic bg-white p-6">
              <h3 className="font-display text-wood-dark mb-4 text-lg font-bold">
                {selectedWeek === 0 ? "Preparation Tasks" : "This Week's Tasks"}
              </h3>
              <div className="space-y-3">
                {oneTimeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    flockId={flockId}
                    currentDay={currentDay}
                    onToggle={() => fetchTasks(selectedWeek)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Upcoming Tasks - only show for current week */}
      {isViewingCurrentWeek && upcomingTasks.length > 0 && (
        <div className="rounded-rustic shadow-rustic bg-white p-6">
          <h3 className="font-display text-wood-dark mb-4 text-lg font-bold">
            Coming Up This Week
          </h3>
          <div className="space-y-3">
            {upcomingTasks.slice(0, 5).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                flockId={flockId}
                currentDay={currentDay}
                onToggle={() => fetchTasks(selectedWeek)}
              />
            ))}
          </div>
          {upcomingTasks.length > 5 && (
            <p className="text-wood-dark/50 mt-4 text-center text-sm">
              +{upcomingTasks.length - 5} more tasks this week
            </p>
          )}
        </div>
      )}
    </div>
  );
}
