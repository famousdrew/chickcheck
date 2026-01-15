import { Suspense } from "react";
import LoginForm from "./LoginForm";

function LoginFormFallback() {
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
      <div className="space-y-4">
        <div className="rounded-rustic bg-wood-dark/10 h-10 animate-pulse" />
        <div className="rounded-rustic bg-wood-dark/10 h-10 animate-pulse" />
        <div className="rounded-rustic bg-grass-500/50 h-10 animate-pulse" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-cream flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
