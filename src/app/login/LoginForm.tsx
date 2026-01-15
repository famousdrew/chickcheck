"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/dashboard");
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
          Welcome Back
        </h1>
        <p className="text-wood-dark/70 mt-2">
          Sign in to continue your journey
        </p>
      </div>

      {registered && (
        <div className="rounded-rustic bg-grass-500/10 text-grass-500 mb-4 p-3 text-sm">
          Account created successfully! Please sign in.
        </div>
      )}

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
            className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-4 py-2 focus:ring-2 focus:outline-none"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-rustic bg-grass-500 hover:bg-grass-500/90 w-full px-4 py-2 font-medium text-white transition-colors disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-wood-dark/70 mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-grass-500 font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
