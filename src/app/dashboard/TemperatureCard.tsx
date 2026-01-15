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
    <div className="rounded-rustic shadow-rustic bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-wood-dark/60 text-sm font-medium">
            Recommended Temperature
          </h3>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-barn-500 text-3xl font-bold">
              {guidance.temperature}°F
            </span>
            <span className="text-wood-dark/50 text-sm">
              ({Math.round((guidance.temperature - 32) * (5 / 9))}°C)
            </span>
          </div>
        </div>
        <div className="bg-barn-500/10 rounded-full p-3">
          <svg
            className="text-barn-500 h-6 w-6"
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
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-grass-600 hover:text-grass-700 mt-3 text-sm font-medium"
      >
        {isExpanded ? "Hide guidance" : "How do I know if it's right?"}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="rounded-md bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">Too Cold?</p>
            <p className="mt-1 text-sm text-blue-700">{guidance.tooCold}</p>
          </div>

          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">Too Hot?</p>
            <p className="mt-1 text-sm text-red-700">{guidance.tooHot}</p>
          </div>

          <div className="rounded-md bg-green-50 p-3">
            <p className="text-sm font-medium text-green-800">Just Right!</p>
            <p className="mt-1 text-sm text-green-700">{guidance.justRight}</p>
          </div>

          <div className="bg-straw-400/20 rounded-md p-3">
            <p className="text-wood-dark text-sm">
              <strong>Tip:</strong> {guidance.tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
