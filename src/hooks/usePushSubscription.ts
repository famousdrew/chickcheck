"use client";

import { useCallback, useEffect, useState } from "react";

export type PushStatus =
  | "loading"
  /** Browser can't do Web Push */
  | "unsupported"
  /** iPhone/iPad Safari: push only works once added to the Home Screen */
  | "ios-needs-install"
  /** Server has no VAPID keys configured */
  | "disabled"
  /** User blocked notifications for the site */
  | "denied"
  | "subscribed"
  | "unsubscribed";

function isIos(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isPushSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/** VAPID keys are base64url; PushManager wants raw bytes */
function urlBase64ToUint8Array(base64Url: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes;
}

async function getRegistration() {
  // next-pwa only registers the service worker in production builds
  return (await navigator.serviceWorker.getRegistration()) ?? null;
}

async function saveSubscription(subscription: PushSubscription) {
  const response = await fetch("/api/push/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });
  if (!response.ok) {
    throw new Error("Failed to save push subscription");
  }
}

/**
 * Web Push state for this device, with actions to turn it on or off.
 */
export function usePushSubscription() {
  const [status, setStatus] = useState<PushStatus>("loading");
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function detect(): Promise<PushStatus> {
      if (!isPushSupported()) {
        return isIos() && !isStandalone() ? "ios-needs-install" : "unsupported";
      }

      const response = await fetch("/api/push/config");
      const config = await response.json();
      if (!config.enabled || !config.publicKey) {
        return "disabled";
      }
      if (!cancelled) setPublicKey(config.publicKey);

      if (Notification.permission === "denied") {
        return "denied";
      }

      const registration = await getRegistration();
      if (!registration) {
        return "unsupported";
      }

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        return "unsubscribed";
      }

      // Re-save in case another account last used this device
      await saveSubscription(subscription);
      return "subscribed";
    }

    detect()
      .then((result) => {
        if (!cancelled) setStatus(result);
      })
      .catch(() => {
        if (!cancelled) setStatus("unsupported");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** Returns true if this device is now subscribed */
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!publicKey) return false;
    setError("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "unsubscribed");
        return false;
      }

      const registration = await getRegistration();
      if (!registration) {
        setStatus("unsupported");
        return false;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await saveSubscription(subscription);
      setStatus("subscribed");
      return true;
    } catch {
      setError("Couldn't turn on reminders. Please try again.");
      return false;
    }
  }, [publicKey]);

  const unsubscribe = useCallback(async () => {
    setError("");

    try {
      const registration = await getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/push/subscriptions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch {
      setError("Couldn't turn off reminders. Please try again.");
    }
  }, []);

  return { status, error, subscribe, unsubscribe };
}

/**
 * True if this device is already getting push reminders, so in-tab
 * reminders would be duplicates.
 */
export async function hasActivePushSubscription(): Promise<boolean> {
  if (typeof window === "undefined" || !isPushSupported()) return false;
  try {
    const registration = await getRegistration();
    return Boolean(await registration?.pushManager.getSubscription());
  } catch {
    return false;
  }
}
