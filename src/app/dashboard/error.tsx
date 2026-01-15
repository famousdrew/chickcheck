"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="bg-cream min-h-screen">
      <header className="border-wood-dark/10 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-wood-dark text-2xl font-bold">
            ChickCheck
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-rustic shadow-rustic bg-white p-8 text-center">
          <div className="text-barn-500 mx-auto mb-4 h-12 w-12">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="font-display text-wood-dark mb-2 text-xl font-bold">
            Something went wrong
          </h2>
          <p className="text-wood-dark/70 mb-6">
            We had trouble loading your dashboard. This might be a temporary
            issue.
          </p>
          <button
            onClick={reset}
            className="bg-barn-500 hover:bg-barn-500/90 rounded-rustic px-6 py-2 font-medium text-white transition-colors"
          >
            Try again
          </button>
        </div>
      </main>
    </div>
  );
}
