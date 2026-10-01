"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/login?reset=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-rustic shadow-rustic bg-white p-8">
      <div className="mb-6 text-center">
        <h1 className="font-display text-wood-dark text-3xl font-bold">
          Choose a New Password
        </h1>
      </div>

      {!token ? (
        <div className="rounded-rustic bg-barn-500/10 text-barn-500 p-3 text-sm">
          This reset link is missing its token. Please use the link from your
          email, or{" "}
          <Link href="/forgot-password" className="font-medium underline">
            request a new one
          </Link>
          .
        </div>
      ) : (
        <>
          {error && (
            <div className="rounded-rustic bg-barn-500/10 text-barn-500 mb-4 p-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="text-wood-dark mb-1 block text-sm font-medium"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-4 py-2 focus:ring-2 focus:outline-none"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-wood-dark mb-1 block text-sm font-medium"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-4 py-2 focus:ring-2 focus:outline-none"
                placeholder="Type it again"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-rustic bg-grass-500 hover:bg-grass-500/90 w-full px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Reset Password"}
            </button>
          </form>

          <p className="text-wood-dark/70 mt-6 text-center text-sm">
            Link expired?{" "}
            <Link
              href="/forgot-password"
              className="text-grass-500 font-medium hover:underline"
            >
              Request a new one
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
