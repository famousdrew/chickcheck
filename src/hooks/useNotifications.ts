"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

type NotifPermission = "default" | "granted" | "denied";

function getSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

function getPermission(): NotifPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "default";
  }
  return Notification.permission;
}

// useSyncExternalStore requires subscribe + getSnapshot
function subscribeToNothing(callback: () => void) {
  // Permission doesn't fire events, so nothing to subscribe to
  void callback;
  return () => {};
}

export function useNotifications() {
  const supported = useSyncExternalStore(
    subscribeToNothing,
    getSupported,
    () => false
  );
  const [permission, setPermission] = useState<NotifPermission>(getPermission);

  const requestPermission = useCallback(async () => {
    if (!supported) return "denied" as NotifPermission;

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [supported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!supported || permission !== "granted") return null;

      return new Notification(title, {
        icon: "/icons/icon-192.png",
        ...options,
      });
    },
    [supported, permission]
  );

  const isDismissed = useCallback(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("chickcheck-notif-dismissed") === "true";
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem("chickcheck-notif-dismissed", "true");
  }, []);

  return {
    supported,
    permission,
    requestPermission,
    sendNotification,
    isDismissed,
    dismiss,
  };
}
