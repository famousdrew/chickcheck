"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ArrivalTiming = "here" | "soon" | "unsure";

interface ChickRow {
  name: string;
  breed: string;
}

export default function WelcomeSetup() {
  const router = useRouter();
  const [flockName, setFlockName] = useState("My Flock");
  const [timing, setTiming] = useState<ArrivalTiming>("soon");
  const [chicks, setChicks] = useState<ChickRow[]>([{ name: "", breed: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addChickRow() {
    if (chicks.length < 20) {
      setChicks([...chicks, { name: "", breed: "" }]);
    }
  }

  function updateChick(index: number, field: keyof ChickRow, value: string) {
    const updated = [...chicks];
    updated[index] = { ...updated[index], [field]: value };
    setChicks(updated);
  }

  function removeChick(index: number) {
    if (chicks.length > 1) {
      setChicks(chicks.filter((_, i) => i !== index));
    } else {
      setChicks([{ name: "", breed: "" }]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Create flock
      const flockRes = await fetch("/api/flocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: flockName.trim() || "My Flock",
          startDate: timing === "here" ? new Date().toISOString() : undefined,
        }),
      });

      if (!flockRes.ok) throw new Error("Failed to create flock");
      const flock = await flockRes.json();

      // Create chicks in parallel
      const validChicks = chicks.filter((c) => c.name.trim());
      if (validChicks.length > 0) {
        await Promise.all(
          validChicks.map((chick) =>
            fetch(`/api/flocks/${flock.id}/chicks`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: chick.name.trim(),
                breed: chick.breed.trim() || undefined,
              }),
            })
          )
        );
      }

      // Track creation time for notification prompt delay
      localStorage.setItem("chickcheck:flockCreatedAt", Date.now().toString());
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const timingOptions: { value: ArrivalTiming; label: string }[] = [
    { value: "here", label: "Already here" },
    { value: "soon", label: "This week" },
    { value: "unsure", label: "Not sure yet" },
  ];

  return (
    <div className="rounded-rustic shadow-rustic bg-white p-6 sm:p-8">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="font-display text-wood-dark text-2xl font-bold">
          Welcome to ChickCheck
        </h2>
        <p className="text-wood-dark/70 mt-1">
          Let&apos;s get your flock set up. This takes about 30 seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flock name */}
        <div>
          <label
            htmlFor="flockName"
            className="text-wood-dark mb-1 block text-sm font-medium"
          >
            Flock Name
          </label>
          <input
            type="text"
            id="flockName"
            value={flockName}
            onChange={(e) => setFlockName(e.target.value)}
            className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-3 py-2 focus:ring-2 focus:outline-none"
            placeholder="My Flock"
            maxLength={100}
          />
        </div>

        {/* Arrival timing */}
        <div>
          <label className="text-wood-dark mb-2 block text-sm font-medium">
            When are your chicks arriving?
          </label>
          <div className="flex gap-2">
            {timingOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTiming(opt.value)}
                className={`rounded-rustic flex-1 border px-3 py-2 text-sm font-medium transition-colors ${
                  timing === opt.value
                    ? "border-grass-500 bg-grass-500/10 text-grass-700"
                    : "border-wood-dark/20 text-wood-dark/70 hover:border-wood-dark/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-wood-dark/50 mt-1.5 text-xs">
            {timing === "here"
              ? "We'll start you on Week 1 with today's care tasks."
              : "We'll start you on Week 0 with preparation tasks. Click \"Chicks Arrived!\" when they're here."}
          </p>
        </div>

        {/* Chick adder */}
        <div>
          <label className="text-wood-dark mb-2 block text-sm font-medium">
            Add your chicks
            <span className="text-wood-dark/50 ml-1 font-normal">
              (optional)
            </span>
          </label>
          <div className="space-y-2">
            {chicks.map((chick, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={chick.name}
                  onChange={(e) => updateChick(i, "name", e.target.value)}
                  className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 flex-1 border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  placeholder="Name"
                  maxLength={50}
                />
                <input
                  type="text"
                  value={chick.breed}
                  onChange={(e) => updateChick(i, "breed", e.target.value)}
                  className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 flex-1 border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  placeholder="Breed (e.g. Buff Orpington)"
                  maxLength={100}
                />
                {chicks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChick(i)}
                    className="text-wood-dark/30 hover:text-barn-500 flex-shrink-0 px-1 transition-colors"
                    aria-label="Remove chick"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addChickRow}
            className="text-grass-600 hover:text-grass-700 mt-2 text-sm font-medium"
          >
            + Add another chick
          </button>
          <p className="text-wood-dark/50 mt-1 text-xs">
            You can always add more later, including photos and notes.
          </p>
        </div>

        {error && (
          <p className="text-barn-500 text-sm" role="alert">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-grass-500 hover:bg-grass-500/90 disabled:bg-grass-500/50 rounded-rustic w-full px-4 py-3 text-lg font-medium text-white transition-colors"
        >
          {isSubmitting ? "Setting up your flock..." : "Start My Flock"}
        </button>
      </form>
    </div>
  );
}
