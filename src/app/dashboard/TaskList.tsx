"use client";

import { useEffect, useState, useCallback } from "react";
import { TaskCategory, TaskFrequency } from "@prisma/client";
import TaskItem from "./TaskItem";

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
  const upcomingTasks = tasks.filter(
    (t) =>
      t.frequency !== "DAILY" &&
      t.dayNumber !== null &&
      t.dayNumber > currentDay
  );
  const completedCount = todaysTasks.filter((t) => t.isCompleted).length;

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

      {/* Today's Tasks */}
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <h3 className="font-display text-wood-dark mb-4 text-lg font-bold">
          Today&apos;s Tasks
        </h3>
        {todaysTasks.length === 0 ? (
          <p className="text-wood-dark/50 py-4 text-center">
            No tasks for today. Great job!
          </p>
        ) : (
          <div className="space-y-3">
            {todaysTasks.map((task) => (
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
