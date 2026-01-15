export default function LoginLoading() {
  return (
    <div className="bg-cream flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 h-8 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="rounded-rustic shadow-rustic bg-white p-8">
          <div className="space-y-6">
            <div>
              <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
            </div>
            <div>
              <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
