"use client";

import { useState, useCallback } from "react";
import { FlockStatus } from "@prisma/client";
import FlockSwitcher from "./FlockSwitcher";
import WelcomeSetup from "./WelcomeSetup";
import JourneyOverview from "./JourneyOverview";
import TaskList from "./TaskList";
import ChickGallery from "./ChickGallery";
import SignOutButton from "./SignOutButton";

interface Flock {
  id: string;
  name: string;
  status: FlockStatus;
  startDate: string | null;
  currentWeek: number;
}

interface DashboardContentProps {
  flocks: Flock[];
  email: string;
}

const ACTIVE_FLOCK_KEY = "chickcheck:activeFlockId";

function getStoredFlockId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_FLOCK_KEY);
}

export default function DashboardContent({
  flocks,
  email,
}: DashboardContentProps) {
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [activeFlockId, setActiveFlockId] = useState<string>(() => {
    // Try stored preference, fall back to first flock
    const stored = getStoredFlockId();
    if (stored && flocks.some((f) => f.id === stored)) return stored;
    return flocks[0]?.id ?? "";
  });

  const activeFlock = flocks.find((f) => f.id === activeFlockId) ?? null;

  const handleSwitch = useCallback((flockId: string) => {
    setActiveFlockId(flockId);
    localStorage.setItem(ACTIVE_FLOCK_KEY, flockId);
    setShowCreateNew(false);
  }, []);

  const handleCreateNew = useCallback(() => {
    setShowCreateNew(true);
  }, []);

  const showSetup = flocks.length === 0 || showCreateNew;

  return (
    <>
      <header className="border-wood-dark/10 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          {flocks.length === 0 ? (
            <h1 className="font-display text-wood-dark text-2xl font-bold">
              ChickCheck
            </h1>
          ) : (
            <FlockSwitcher
              flocks={flocks.map((f) => ({
                id: f.id,
                name: f.name,
                status: f.status,
              }))}
              activeFlockId={activeFlockId}
              onSwitch={handleSwitch}
              onCreateNew={handleCreateNew}
            />
          )}
          <div className="flex items-center gap-4">
            <span className="text-wood-dark/70 hidden text-sm sm:inline">
              {email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8">
        {showSetup ? (
          <div className="space-y-4">
            {showCreateNew && flocks.length > 0 && (
              <button
                onClick={() => setShowCreateNew(false)}
                className="text-wood-dark/60 hover:text-wood-dark flex items-center gap-1 text-sm transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to {activeFlock?.name ?? "dashboard"}
              </button>
            )}
            <WelcomeSetup />
          </div>
        ) : activeFlock ? (
          <div className="space-y-6">
            <JourneyOverview currentWeek={activeFlock.currentWeek} />
            <TaskList
              flockId={activeFlock.id}
              flock={{
                id: activeFlock.id,
                name: activeFlock.name,
                status: activeFlock.status,
                startDate: activeFlock.startDate,
                currentWeek: activeFlock.currentWeek,
              }}
            />
            <ChickGallery flockId={activeFlock.id} />
          </div>
        ) : null}
      </main>
    </>
  );
}
