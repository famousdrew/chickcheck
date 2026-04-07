"use client";

import { useState } from "react";

const DISMISSED_KEY = "chickcheck:welcomeDismissed";

interface JourneyOverviewProps {
  currentWeek: number;
}

export default function JourneyOverview({ currentWeek }: JourneyOverviewProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(DISMISSED_KEY) === "true";
  });

  if (dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  }

  const weeks = [
    { num: 0, label: "Prep" },
    { num: 1, label: "1" },
    { num: 2, label: "2" },
    { num: 3, label: "3" },
    { num: 4, label: "4" },
    { num: 5, label: "5" },
    { num: 6, label: "6" },
    { num: 7, label: "7" },
    { num: 8, label: "8" },
  ];

  return (
    <div className="rounded-rustic shadow-rustic bg-straw-400/10 p-5">
      <h3 className="font-display text-wood-dark text-base font-bold">
        Your 8-Week Chick Care Guide
      </h3>

      {/* Mini timeline */}
      <div className="mt-3 flex items-center gap-1">
        {weeks.map((w) => (
          <div key={w.num} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                w.num === currentWeek
                  ? "bg-grass-500 text-white"
                  : w.num < currentWeek
                    ? "bg-grass-500/20 text-grass-700"
                    : "bg-wood-dark/10 text-wood-dark/40"
              }`}
            >
              {w.label}
            </div>
            {w.num > 0 && w.num < 9 && (
              <div
                className={`h-0.5 w-full ${
                  w.num <= currentWeek ? "bg-grass-500/30" : "bg-wood-dark/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-wood-dark/70 mt-3 text-sm">
        ChickCheck breaks the brooding period into weekly phases. Each week has
        daily care tasks (like checking food and water) and one-time milestones
        (like adjusting brooder temperature).
      </p>
      <p className="text-wood-dark/70 mt-1 text-sm">
        You&apos;re currently on{" "}
        <strong className="text-wood-dark">
          {currentWeek === 0 ? "Week 0 (Preparation)" : `Week ${currentWeek}`}
        </strong>
        . We&apos;ll surface what matters today and flag anything overdue.
      </p>

      <button
        onClick={handleDismiss}
        className="text-grass-600 hover:text-grass-700 mt-3 text-sm font-medium"
      >
        Got it
      </button>
    </div>
  );
}
