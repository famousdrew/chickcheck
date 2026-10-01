"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { usePushSubscription } from "@/hooks/usePushSubscription";

function isTooEarlyForPrompt(): boolean {
  if (typeof window === "undefined") return true;
  const created = localStorage.getItem("chickcheck:flockCreatedAt");
  if (!created) {
    localStorage.setItem("chickcheck:flockCreatedAt", Date.now().toString());
    return true;
  }
  return Date.now() - parseInt(created, 10) < 24 * 60 * 60 * 1000;
}

export default function NotificationPrompt() {
  const { supported, permission, requestPermission, isDismissed, dismiss } =
    useNotifications();
  const push = usePushSubscription();
  const [isHidden, setIsHidden] = useState(false);
  const [tooEarly] = useState(isTooEarlyForPrompt);

  if (push.status === "loading" || isDismissed() || isHidden || tooEarly) {
    return null;
  }

  // Push works here: offer real reminders (also upgrades in-tab-only users)
  const offerPush = push.status === "unsubscribed";
  const offerInstall = push.status === "ios-needs-install";
  // No push: fall back to in-tab notifications
  const offerInTab =
    (push.status === "disabled" || push.status === "unsupported") &&
    supported &&
    permission === "default";

  if (!offerPush && !offerInstall && !offerInTab) {
    return null;
  }

  async function handleEnable() {
    if (offerPush) {
      // Stay visible on failure so the error can be shown
      if (await push.subscribe()) setIsHidden(true);
      return;
    }
    await requestPermission();
    setIsHidden(true);
  }

  function handleDismiss() {
    dismiss();
    setIsHidden(true);
  }

  const description = offerPush
    ? "Get a nudge each morning and evening about your chicks' care tasks, even when ChickCheck is closed."
    : offerInstall
      ? "To get reminders on iPhone or iPad, tap the Share button, choose “Add to Home Screen”, then open ChickCheck from your Home Screen."
      : "Get notified about pending chick care tasks while the app is open.";

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
          <p className="text-wood-dark/60 mt-0.5 text-xs">{description}</p>
          {push.error && (
            <p className="text-barn-500 mt-1 text-xs">{push.error}</p>
          )}
          <div className="mt-2 flex gap-2">
            {!offerInstall && (
              <button
                onClick={handleEnable}
                className="bg-grass-500 hover:bg-grass-500/90 rounded-rustic px-3 py-1 text-xs font-medium text-white transition-colors"
              >
                Enable
              </button>
            )}
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
