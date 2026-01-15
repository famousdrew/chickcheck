import { DashboardSkeleton } from "@/components/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <header className="border-wood-dark/10 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-wood-dark text-2xl font-bold">
            ChickCheck
          </h1>
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
