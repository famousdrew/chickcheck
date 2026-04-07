export default function ChickProfileLoading() {
  return (
    <div className="bg-cream min-h-screen">
      <header className="border-wood-dark/10 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* Profile header skeleton */}
          <div className="rounded-rustic shadow-rustic bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="bg-cream h-20 w-20 animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-7 w-36 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="border-wood-dark/10 mt-4 flex gap-6 border-t pt-4">
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="rounded-rustic shadow-rustic bg-white">
            <div className="border-wood-dark/10 flex border-b">
              <div className="flex-1 px-4 py-3">
                <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex-1 px-4 py-3">
                <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="flex-1 px-4 py-3">
                <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="h-20 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
