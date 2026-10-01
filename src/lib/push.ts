import webpush from "web-push";
import { prisma } from "./prisma";

export interface PushPayload {
  title: string;
  body: string;
  /** Page to open when the notification is tapped */
  url?: string;
  /** Notifications with the same tag replace each other on the device */
  tag?: string;
}

// How long the push service holds a message for an offline device
const PUSH_TTL_SECONDS = 4 * 60 * 60;

export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY || null;
}

/**
 * Push needs a VAPID key pair (generate one with `npm run vapid`).
 * Without it the push UI is hidden and reminders are skipped.
 */
export function isPushConfigured(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configureVapid() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:noreply@chickcheck.app",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

/**
 * Sends a notification to every device the user has subscribed. Devices
 * whose subscription has expired (404/410 from the push service) are removed.
 */
export async function sendPushToUser(userId: string, payload: PushPayload) {
  const result = { sent: 0, failed: 0, removed: 0 };

  if (!isPushConfigured()) {
    return result;
  }
  configureVapid();

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
          { TTL: PUSH_TTL_SECONDS }
        );
        result.sent++;
      } catch (error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.deleteMany({ where: { id: sub.id } });
          result.removed++;
        } else {
          console.error(`Push to ${sub.endpoint} failed:`, error);
          result.failed++;
        }
      }
    })
  );

  return result;
}
