"use client";

import { FlockStatus } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FlockDashboardHeaderProps {
  flock: {
    id: string;
    name: string;
    status: FlockStatus;
    startDate: string | null;
    currentWeek: number;
  };
  currentWeek: number;
  currentDay: number;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  completedCount: number;
  totalCount: number;
  maxWeek?: number;
}

export default function FlockDashboardHeader({
  flock,
  currentWeek,
  currentDay,
  selectedWeek,
  onWeekChange,
  completedCount,
  totalCount,
  maxWeek = 8,
}: FlockDashboardHeaderProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(flock.name);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  async function handleStartFlock() {
    setIsStarting(true);
    try {
      await fetch(`/api/flocks/${flock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to start flock:", error);
    } finally {
      setIsStarting(false);
    }
  }

  async function handleSaveName() {
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName === flock.name) {
      setIsEditing(false);
      setEditName(flock.name);
      return;
    }

    setIsSaving(true);
    try {
      await fetch(`/api/flocks/${flock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to rename flock:", error);
      setEditName(flock.name);
    } finally {
      setIsSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditName(flock.name);
    }
  }

  const statusLabels: Record<FlockStatus, { label: string; color: string }> = {
    PREPARING: { label: "Preparing", color: "bg-amber-100 text-amber-800" },
    ACTIVE: { label: "Active", color: "bg-grass-500/20 text-grass-700" },
    GRADUATED: { label: "Graduated", color: "bg-purple-100 text-purple-800" },
  };

  const status = statusLabels[flock.status];
  const weeks = Array.from({ length: maxWeek + 1 }, (_, i) => i);
  const isViewingCurrentWeek = selectedWeek === currentWeek;
  const isViewingFutureWeek = selectedWeek > currentWeek;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-rustic shadow-rustic bg-white p-4 sm:p-6">
      {/* Top row: Flock name, status, start button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveName}
              disabled={isSaving}
              className="font-display text-wood-dark rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-40 border px-2 py-1 text-lg font-bold focus:ring-2 focus:outline-none"
              maxLength={50}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="group flex min-w-0 items-center gap-2"
              title="Click to rename"
            >
              <h2 className="font-display text-wood-dark truncate text-lg font-bold">
                {flock.name}
              </h2>
              <svg
                className="text-wood-dark/30 group-hover:text-wood-dark/60 h-4 w-4 flex-shrink-0 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
          <span
            className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        {flock.status === "PREPARING" ? (
          <button
            onClick={handleStartFlock}
            disabled={isStarting}
            className="bg-barn-500 hover:bg-barn-500/90 disabled:bg-barn-500/50 rounded-rustic flex-shrink-0 px-3 py-1.5 text-sm font-medium text-white transition-colors"
          >
            {isStarting ? "Starting..." : "Chicks Arrived!"}
          </button>
        ) : flock.startDate ? (
          <span className="text-wood-dark/50 flex-shrink-0 text-xs">
            Started {new Date(flock.startDate).toLocaleDateString()}
          </span>
        ) : null}
      </div>

      {/* Week selector row */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onWeekChange(Math.max(0, selectedWeek - 1))}
          disabled={selectedWeek === 0}
          className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30"
          aria-label="Previous week"
        >
          <svg
            className="text-wood-dark h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex flex-1 justify-center gap-1 overflow-x-auto">
          {weeks.map((week) => {
            const isCurrent = week === currentWeek;
            const isSelected = week === selectedWeek;
            const isPast = week < currentWeek;
            const isFuture = week > currentWeek;

            return (
              <button
                key={week}
                onClick={() => onWeekChange(week)}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-grass-500 text-white"
                    : isCurrent
                      ? "bg-grass-500/20 text-grass-700"
                      : isPast
                        ? "text-wood-dark/70 hover:bg-gray-100"
                        : isFuture
                          ? "text-wood-dark/40 hover:bg-gray-50"
                          : "text-wood-dark hover:bg-gray-100"
                }`}
                aria-label={`Week ${week}${isCurrent ? " (current)" : ""}`}
              >
                {week}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onWeekChange(Math.min(maxWeek, selectedWeek + 1))}
          disabled={selectedWeek === maxWeek}
          className="flex-shrink-0 rounded-full p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-30"
          aria-label="Next week"
        >
          <svg
            className="text-wood-dark h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Progress row */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="text-wood-dark text-sm font-medium">
            {isViewingCurrentWeek
              ? `Week ${currentWeek}, Day ${currentDay}`
              : selectedWeek === 0
                ? "Preparation"
                : `Week ${selectedWeek}`}
          </span>
          <span className="text-wood-dark/50 ml-2 text-xs">
            {isViewingCurrentWeek
              ? `${completedCount}/${totalCount} today`
              : isViewingFutureWeek
                ? `${totalCount} tasks`
                : `${completedCount}/${totalCount} done`}
          </span>
        </div>

        {!isViewingFutureWeek && (
          <span className="text-grass-600 flex-shrink-0 text-sm font-bold">
            {progressPercent}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!isViewingFutureWeek && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-grass-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
