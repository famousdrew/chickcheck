"use client";

import { useState } from "react";
import { getTemperatureGuidance } from "@/lib/utils/temperature";

interface TemperatureCardProps {
  weekNumber: number;
}

export default function TemperatureCard({ weekNumber }: TemperatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const guidance = getTemperatureGuidance(weekNumber);

  return (
    <div className="bg-barn-500/5 border-barn-500/20 rounded-lg border px-4 py-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <svg
            className="text-barn-500 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-wood-dark/70 text-sm">Brooder temp:</span>
          <span className="text-barn-500 font-semibold">
            {guidance.temperature}°F
          </span>
          <span className="text-wood-dark/40 text-xs">
            ({Math.round((guidance.temperature - 32) * (5 / 9))}°C)
          </span>
        </div>
        <svg
          className={`text-wood-dark/40 h-4 w-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
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

      {isExpanded && (
        <div className="border-barn-500/10 mt-3 grid gap-2 border-t pt-3 text-xs sm:grid-cols-2">
          <div className="rounded bg-blue-50 p-2">
            <span className="font-medium text-blue-800">Too Cold:</span>{" "}
            <span className="text-blue-700">{guidance.tooCold}</span>
          </div>
          <div className="rounded bg-red-50 p-2">
            <span className="font-medium text-red-800">Too Hot:</span>{" "}
            <span className="text-red-700">{guidance.tooHot}</span>
          </div>
          <div className="rounded bg-green-50 p-2">
            <span className="font-medium text-green-800">Just Right:</span>{" "}
            <span className="text-green-700">{guidance.justRight}</span>
          </div>
          <div className="bg-straw-400/20 rounded p-2">
            <span className="text-wood-dark font-medium">Tip:</span>{" "}
            <span className="text-wood-dark/80">{guidance.tip}</span>
          </div>
        </div>
      )}
    </div>
  );
}
