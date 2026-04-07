"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationPrompt() {
  const { supported, permission, requestPermission, isDismissed, dismiss } =
    useNotifications();
  const [isHidden, setIsHidden] = useState(false);

  // Don't show if: not supported, already granted/denied, dismissed, or hidden
  if (!supported || permission !== "default" || isDismissed() || isHidden) {
    return null;
  }

  async function handleEnable() {
    await requestPermission();
    setIsHidden(true);
  }

  function handleDismiss() {
    dismiss();
    setIsHidden(true);
  }

  return (
    <div className="rounded-rustic shadow-rustic border-grass-500/20 bg-grass-500/5 border p-4">
      <div className="flex items-start gap-3">
        <svg
          className="text-grass-600 mt-0.5 h-5 w-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <div className="flex-1">
          <p className="text-wood-dark text-sm font-medium">
            Enable reminders?
          </p>
          <p className="text-wood-dark/60 mt-0.5 text-xs">
            Get notified about pending chick care tasks while the app is open.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleEnable}
              className="bg-grass-500 hover:bg-grass-500/90 rounded-rustic px-3 py-1 text-xs font-medium text-white transition-colors"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="text-wood-dark/50 hover:text-wood-dark text-xs transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
