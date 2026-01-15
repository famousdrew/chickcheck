"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Redirect to login on success
      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-rustic shadow-rustic bg-white p-8">
          <div className="mb-6 text-center">
            <h1 className="font-display text-wood-dark text-3xl font-bold">
              Join ChickCheck
            </h1>
            <p className="text-wood-dark/70 mt-2">
              Start your chick-raising journey today
            </p>
          </div>

          {error && (
            <div className="rounded-rustic bg-barn-500/10 text-barn-500 mb-4 p-3 text-sm">
              {error}
            </div>
          )}

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

            <div>
              <label
                htmlFor="password"
                className="text-wood-dark mb-1 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-4 py-2 focus:ring-2 focus:outline-none"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-wood-dark mb-1 block text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-4 py-2 focus:ring-2 focus:outline-none"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-rustic bg-grass-500 hover:bg-grass-500/90 w-full px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-wood-dark/70 mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-grass-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
