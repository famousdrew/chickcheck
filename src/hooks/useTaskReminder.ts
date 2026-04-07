"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "./useNotifications";

const REMINDER_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours
const LAST_REMINDER_KEY = "chickcheck-last-reminder";

interface UseTaskReminderOptions {
  flockId: string | null;
  pendingCount: number;
  overdueCount: number;
  isActive: boolean;
}

/**
 * Periodically sends browser notifications about pending/overdue tasks
 * while the app tab is open. Fires at most once per REMINDER_INTERVAL.
 */
export function useTaskReminder({
  flockId,
  pendingCount,
  overdueCount,
  isActive,
}: UseTaskReminderOptions) {
  const { permission, sendNotification } = useNotifications();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive || permission !== "granted" || !flockId) {
      return;
    }

    function shouldRemind(): boolean {
      const lastReminder = localStorage.getItem(LAST_REMINDER_KEY);
      if (!lastReminder) return true;
      return Date.now() - parseInt(lastReminder, 10) > REMINDER_INTERVAL;
    }

    function checkAndNotify() {
      if (!shouldRemind()) return;

      const total = pendingCount + overdueCount;
      if (total === 0) return;

      let body: string;
      if (overdueCount > 0 && pendingCount > 0) {
        body = `${overdueCount} overdue and ${pendingCount} pending tasks need attention.`;
      } else if (overdueCount > 0) {
        body = `${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} from earlier this week.`;
      } else {
        body = `${pendingCount} task${pendingCount > 1 ? "s" : ""} still to do today.`;
      }

      sendNotification("ChickCheck Reminder", {
        body,
        tag: "task-reminder", // Replaces previous reminder notification
      });

      localStorage.setItem(LAST_REMINDER_KEY, Date.now().toString());
    }

    // Check once after a short delay (let tasks load first)
    const initialTimeout = setTimeout(checkAndNotify, 5000);

    // Then check periodically
    intervalRef.current = setInterval(checkAndNotify, REMINDER_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isActive,
    permission,
    flockId,
    pendingCount,
    overdueCount,
    sendNotification,
  ]);
}
