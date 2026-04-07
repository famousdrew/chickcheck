"use client";

import Link from "next/link";

export default function ChickProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-cream min-h-screen">
      <header className="border-wood-dark/10 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Link
            href="/dashboard"
            className="text-wood-dark/60 hover:text-wood-dark transition-colors"
          >
            <svg
              className="h-6 w-6"
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
          </Link>
          <h1 className="font-display text-wood-dark text-2xl font-bold">
            Oops
          </h1>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-rustic shadow-rustic bg-white p-8 text-center">
          <p className="text-wood-dark/70 mb-4">
            Something went wrong loading this chick&apos;s profile.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={reset}
              className="bg-grass-500 hover:bg-grass-500/90 rounded-rustic px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="border-wood-dark/20 text-wood-dark hover:bg-wood-dark/5 rounded-rustic border px-4 py-2 text-sm font-medium transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
