"use client";

import { FlockStatus } from "@prisma/client";
import { useState, useRef, useEffect } from "react";
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

  return (
    <div className="rounded-rustic shadow-rustic bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveName}
                  disabled={isSaving}
                  className="font-display text-wood-dark rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-48 border px-2 py-1 text-xl font-bold focus:ring-2 focus:outline-none"
                  maxLength={50}
                />
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-2"
                title="Click to rename"
              >
                <h2 className="font-display text-wood-dark text-xl font-bold">
                  {flock.name}
                </h2>
                <svg
                  className="text-wood-dark/30 group-hover:text-wood-dark/60 h-4 w-4 transition-colors"
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
