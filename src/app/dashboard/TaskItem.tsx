"use client";

import { useState } from "react";
import { TaskCategory, TaskFrequency } from "@prisma/client";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    detailedContent: string;
    frequency: TaskFrequency;
    category: TaskCategory;
    dayNumber: number | null;
    isCompleted: boolean;
  };
  flockId: string;
  currentDay: number;
  onToggle: () => void;
}

const categoryStyles: Record<
  TaskCategory,
  { bg: string; text: string; label: string }
> = {
  BROODER_CARE: {
    bg: "bg-straw-400/20",
    text: "text-wood-dark",
    label: "Brooder",
  },
  FEEDING_WATER: {
    bg: "bg-sky-100",
    text: "text-sky-800",
    label: "Feed/Water",
  },
  HEALTH_CHECK: { bg: "bg-rose-100", text: "text-rose-800", label: "Health" },
  ENVIRONMENT: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Environment",
  },
  MILESTONE: { bg: "bg-amber-100", text: "text-amber-800", label: "Milestone" },
  PREPARATION: { bg: "bg-purple-100", text: "text-purple-800", label: "Prep" },
};

const frequencyLabels: Record<TaskFrequency, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  ONCE: "One-time",
};

export default function TaskItem({
  task,
  flockId,
  currentDay,
  onToggle,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const style = categoryStyles[task.category];
  const isApplicableToday =
    task.frequency === "DAILY" ||
    (task.dayNumber !== null && task.dayNumber === currentDay);

  async function handleToggle() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch(`/api/flocks/${flockId}/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          action: task.isCompleted ? "undo" : "complete",
        }),
      });
      onToggle();
    } catch (error) {
      console.error("Failed to toggle task:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`rounded-rustic border transition-all ${
        task.isCompleted
          ? "border-grass-500/30 bg-grass-500/5"
          : "border-wood-dark/10 bg-white"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={handleToggle}
          disabled={isLoading || !isApplicableToday}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
            task.isCompleted
              ? "border-grass-500 bg-grass-500 text-white"
              : isApplicableToday
                ? "border-wood-dark/30 hover:border-grass-500"
                : "border-wood-dark/10 cursor-not-allowed bg-gray-50"
          }`}
          aria-label={
            task.isCompleted ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {task.isCompleted && (
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-medium ${
                task.isCompleted
                  ? "text-wood-dark/50 line-through"
                  : "text-wood-dark"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${style.bg} ${style.text}`}
            >
              {style.label}
            </span>
            <span className="text-wood-dark/50 text-xs">
              {frequencyLabels[task.frequency]}
              {task.dayNumber && ` · Day ${task.dayNumber}`}
            </span>
          </div>

          <p
            className={`mt-1 text-sm ${task.isCompleted ? "text-wood-dark/40" : "text-wood-dark/70"}`}
          >
            {task.description}
          </p>

          {task.detailedContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-grass-600 hover:text-grass-700 mt-2 text-sm font-medium"
            >
              {isExpanded ? "Hide details" : "Show details"}
            </button>
          )}

          {isExpanded && (
            <div className="bg-straw-400/10 mt-3 rounded-md p-3">
              <pre className="text-wood-dark/80 font-sans text-sm whitespace-pre-wrap">
                {task.detailedContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
