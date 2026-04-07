"use client";

import { useState, useRef, useEffect } from "react";

interface FlockOption {
  id: string;
  name: string;
  status: string;
}

interface FlockSwitcherProps {
  flocks: FlockOption[];
  activeFlockId: string;
  onSwitch: (flockId: string) => void;
  onCreateNew: () => void;
}

export default function FlockSwitcher({
  flocks,
  activeFlockId,
  onSwitch,
  onCreateNew,
}: FlockSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeFlock = flocks.find((f) => f.id === activeFlockId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Single flock — just show name with a "+" button
  if (flocks.length === 1) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="font-display text-wood-dark text-2xl font-bold">
          {activeFlock?.name || "ChickCheck"}
        </h1>
        <button
          onClick={onCreateNew}
          className="text-wood-dark/30 hover:text-grass-500 transition-colors"
          aria-label="Create new flock"
          title="New flock"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Multiple flocks — dropdown
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2"
      >
        <h1 className="font-display text-wood-dark text-2xl font-bold">
          {activeFlock?.name || "ChickCheck"}
        </h1>
        <svg
          className={`text-wood-dark/40 group-hover:text-wood-dark/60 h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
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

      {isOpen && (
        <div className="rounded-rustic shadow-rustic absolute top-full left-0 z-50 mt-2 min-w-[200px] bg-white py-1">
          {flocks.map((flock) => (
            <button
              key={flock.id}
              onClick={() => {
                onSwitch(flock.id);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                flock.id === activeFlockId
                  ? "bg-grass-500/10 text-grass-700 font-medium"
                  : "text-wood-dark hover:bg-cream"
              }`}
            >
              <span className="truncate">{flock.name}</span>
              <span
                className={`ml-2 flex-shrink-0 rounded-full px-1.5 py-0.5 text-xs ${
                  flock.status === "ACTIVE"
                    ? "bg-grass-500/20 text-grass-700"
                    : flock.status === "GRADUATED"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {flock.status === "ACTIVE"
                  ? "Active"
                  : flock.status === "GRADUATED"
                    ? "Grad"
                    : "Prep"}
              </span>
            </button>
          ))}
          <div className="border-wood-dark/10 my-1 border-t" />
          <button
            onClick={() => {
              onCreateNew();
              setIsOpen(false);
            }}
            className="text-grass-600 hover:bg-cream flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Flock
          </button>
        </div>
      )}
    </div>
  );
}
