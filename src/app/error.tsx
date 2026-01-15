"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="bg-cream flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="text-barn-500 mx-auto mb-4 h-16 w-16">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="font-display text-wood-dark mb-2 text-2xl font-bold">
          Oops! Something went wrong
        </h1>
        <p className="text-wood-dark/70 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-barn-500 hover:bg-barn-500/90 rounded-rustic px-6 py-3 font-medium text-white transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
