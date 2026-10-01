"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setMessage(data.message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      id="main-content"
      className="bg-cream flex min-h-screen items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <div className="rounded-rustic shadow-rustic bg-white p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-wood-dark text-3xl font-bold">
              Forgot Password
            </h1>
            <p className="text-wood-dark/70 mt-2">
              We&apos;ll email you a link to reset it
            </p>
          </div>

          {error && (
            <div className="rounded-rustic bg-barn-500/10 text-barn-500 mb-4 p-3 text-sm">
              {error}
            </div>
          )}

          {message ? (
            <div className="rounded-rustic bg-grass-500/10 text-grass-500 p-3 text-sm">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-wood-dark mb-1 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-4 py-2 focus:ring-2 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-rustic bg-grass-500 hover:bg-grass-500/90 w-full px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <p className="text-wood-dark/70 mt-6 text-center text-sm">
            Remembered it?{" "}
            <Link
              href="/login"
              className="text-grass-500 font-medium hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
