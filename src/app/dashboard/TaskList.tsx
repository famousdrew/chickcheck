"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskCategory, TaskFrequency } from "@prisma/client";
import TaskItem from "./TaskItem";
import TemperatureCard from "./TemperatureCard";

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

interface TaskListProps {
  flockId: string;
}

export default function TaskList({ flockId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`/api/flocks/${flockId}/tasks`);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      setTasks(data.tasks);
      setCurrentWeek(data.currentWeek);
      setCurrentDay(data.currentDay);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, [flockId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  // Separate tasks into today's tasks and other tasks
  const todaysTasks = tasks.filter(
    (t) =>
      t.frequency === "DAILY" ||
      (t.dayNumber !== null && t.dayNumber === currentDay)
  );
  const pendingTasks = todaysTasks.filter((t) => !t.isCompleted);
  const completedTasks = todaysTasks.filter((t) => t.isCompleted);
  const upcomingTasks = tasks.filter(
    (t) =>
      t.frequency !== "DAILY" &&
      t.dayNumber !== null &&
      t.dayNumber > currentDay
  );
  const completedCount = completedTasks.length;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-wood-dark text-xl font-bold">
              Week {currentWeek}, Day {currentDay}
            </h2>
            <p className="text-wood-dark/70 text-sm">
              {completedCount} of {todaysTasks.length} tasks completed today
            </p>
          </div>
          <div className="text-right">
            <div className="text-grass-600 text-2xl font-bold">
              {todaysTasks.length > 0
                ? Math.round((completedCount / todaysTasks.length) * 100)
                : 0}
              %
            </div>
            <div className="text-wood-dark/50 text-xs">Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-grass-500 h-full transition-all duration-300"
            style={{
              width: `${todaysTasks.length > 0 ? (completedCount / todaysTasks.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Temperature Card */}
      <TemperatureCard weekNumber={currentWeek} />

      {/* Today's Tasks */}
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
                onToggle={fetchTasks}
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
                    onToggle={fetchTasks}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
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
                onToggle={fetchTasks}
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
