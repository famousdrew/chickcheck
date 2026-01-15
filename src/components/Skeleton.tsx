export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function TaskItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="h-5 w-5 flex-shrink-0 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Week Selector Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-16 flex-shrink-0" />
        ))}
      </div>

      {/* Progress Header Skeleton */}
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="text-right">
            <Skeleton className="ml-auto h-8 w-12" />
            <Skeleton className="mt-1 ml-auto h-3 w-16" />
          </div>
        </div>
        <Skeleton className="mt-4 h-2 w-full rounded-full" />
      </div>

      {/* Temperature Card Skeleton */}
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Tasks Skeleton */}
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-3">
          <TaskItemSkeleton />
          <TaskItemSkeleton />
          <TaskItemSkeleton />
          <TaskItemSkeleton />
        </div>
      </div>
    </div>
  );
}

export function FlockHeaderSkeleton() {
  return (
    <div className="rounded-rustic shadow-rustic bg-white p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <FlockHeaderSkeleton />
      <TaskListSkeleton />
    </div>
  );
}
