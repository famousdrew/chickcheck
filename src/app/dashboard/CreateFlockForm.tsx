"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFlockForm() {
  const router = useRouter();
  const [name, setName] = useState("My Flock");
  const [startNow, setStartNow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/flocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          startDate: startNow ? new Date().toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create flock");
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-rustic shadow-rustic bg-white p-8">
      <h2 className="font-display text-wood-dark text-xl font-bold">
        Start Your Chick Journey
      </h2>
      <p className="text-wood-dark/70 mt-2">
        Create your first flock to start tracking daily tasks and milestones.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="flockName"
            className="text-wood-dark block text-sm font-medium"
          >
            Flock Name
          </label>
          <input
            type="text"
            id="flockName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500 mt-1 block w-full rounded-md border px-3 py-2"
            placeholder="My Flock"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="startNow"
            checked={startNow}
            onChange={(e) => setStartNow(e.target.checked)}
            className="text-grass-500 focus:ring-grass-500 h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="startNow" className="text-wood-dark text-sm">
            Chicks are arriving today - start Week 1 now
          </label>
        </div>

        {error && <p className="text-barn-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-grass-500 hover:bg-grass-500/90 disabled:bg-grass-500/50 rounded-rustic w-full px-4 py-2 font-medium text-white transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Flock"}
        </button>
      </form>
    </div>
  );
}
