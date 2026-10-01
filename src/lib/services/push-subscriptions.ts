import { prisma } from "../prisma";

export interface PushSubscriptionInput {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/**
 * Saves a device's subscription. The endpoint identifies the device, so if
 * someone else signed in on it before, the subscription moves to this user.
 */
export async function savePushSubscription(
  userId: string,
  { endpoint, keys }: PushSubscriptionInput
) {
  return prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId, p256dh: keys.p256dh, auth: keys.auth },
    create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
  });
}

export async function deletePushSubscription(userId: string, endpoint: string) {
  return prisma.pushSubscription.deleteMany({
    where: { userId, endpoint },
  });
}
