import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-cream flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-barn-500 mb-4 text-6xl font-bold">
          404
        </h1>
        <h2 className="font-display text-wood-dark mb-2 text-2xl font-bold">
          Page not found
        </h2>
        <p className="text-wood-dark/70 mb-8">
          Looks like this chick has wandered off! The page you&apos;re looking
          for doesn&apos;t exist.
        </p>
        <Link
          href="/dashboard"
          className="bg-barn-500 hover:bg-barn-500/90 rounded-rustic inline-block px-6 py-3 font-medium text-white transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
