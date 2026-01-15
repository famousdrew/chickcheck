"use client";

interface WeekSelectorProps {
  currentWeek: number;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  maxWeek?: number;
}

export default function WeekSelector({
  currentWeek,
  selectedWeek,
  onWeekChange,
  maxWeek = 8,
}: WeekSelectorProps) {
  const weeks = Array.from({ length: maxWeek + 1 }, (_, i) => i);

  return (
    <div className="rounded-rustic shadow-rustic bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onWeekChange(Math.max(0, selectedWeek - 1))}
          disabled={selectedWeek === 0}
          className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
          aria-label="Previous week"
        >
          <svg
            className="text-wood-dark h-5 w-5"
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

        <div className="flex gap-1 overflow-x-auto px-2">
          {weeks.map((week) => {
            const isCurrent = week === currentWeek;
            const isSelected = week === selectedWeek;
            const isPast = week < currentWeek;
            const isFuture = week > currentWeek;

            return (
              <button
                key={week}
                onClick={() => onWeekChange(week)}
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
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
                aria-current={isCurrent ? "true" : undefined}
              >
                {week}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onWeekChange(Math.min(maxWeek, selectedWeek + 1))}
          disabled={selectedWeek === maxWeek}
          className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-30"
          aria-label="Next week"
        >
          <svg
            className="text-wood-dark h-5 w-5"
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

      <div className="mt-2 text-center">
        <span className="text-wood-dark/60 text-sm">
          {selectedWeek === 0
            ? "Preparation"
            : selectedWeek === currentWeek
              ? `Week ${selectedWeek} (Current)`
              : selectedWeek < currentWeek
                ? `Week ${selectedWeek} (Past)`
                : `Week ${selectedWeek} (Preview)`}
        </span>
      </div>
    </div>
  );
}
