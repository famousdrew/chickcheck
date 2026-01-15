"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center">
      <p className="text-sm text-amber-800">
        <span className="mr-2">📡</span>
        You&apos;re offline. Some features may be limited.
      </p>
    </div>
  );
}
