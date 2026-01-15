import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-cream flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-barn-500 mb-4 text-4xl font-bold">
        Welcome to ChickCheck
      </h1>
      <p className="text-wood-dark mb-8 max-w-md text-center text-lg">
        Your 8-week guide to raising healthy, happy chicks.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-grass-500 hover:bg-grass-500/90 rounded-rustic shadow-rustic px-6 py-3 font-medium text-white transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="bg-straw-400/20 text-wood-dark hover:bg-straw-400/30 rounded-rustic px-6 py-3 font-medium transition-colors"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
