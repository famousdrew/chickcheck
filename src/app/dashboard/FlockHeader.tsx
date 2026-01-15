"use client";

import { FlockStatus } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FlockHeaderProps {
  flock: {
    id: string;
    name: string;
    status: FlockStatus;
    startDate: string | null;
    currentWeek: number;
  };
}

export default function FlockHeader({ flock }: FlockHeaderProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

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

  const statusLabels: Record<FlockStatus, { label: string; color: string }> = {
    PREPARING: { label: "Preparing", color: "bg-amber-100 text-amber-800" },
    ACTIVE: { label: "Active", color: "bg-grass-500/20 text-grass-700" },
    GRADUATED: { label: "Graduated", color: "bg-purple-100 text-purple-800" },
  };

  const status = statusLabels[flock.status];

  return (
    <div className="rounded-rustic shadow-rustic bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-wood-dark text-xl font-bold">
              {flock.name}
            </h2>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
            >
              {status.label}
            </span>
          </div>
          {flock.status === "PREPARING" && (
            <p className="text-wood-dark/70 mt-1 text-sm">
              Complete Week 0 preparation tasks before your chicks arrive
            </p>
          )}
          {flock.status === "ACTIVE" && flock.startDate && (
            <p className="text-wood-dark/70 mt-1 text-sm">
              Started {new Date(flock.startDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {flock.status === "PREPARING" && (
          <button
            onClick={handleStartFlock}
            disabled={isStarting}
            className="bg-barn-500 hover:bg-barn-500/90 disabled:bg-barn-500/50 rounded-rustic px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            {isStarting ? "Starting..." : "Chicks Have Arrived!"}
          </button>
        )}
      </div>
    </div>
  );
}
