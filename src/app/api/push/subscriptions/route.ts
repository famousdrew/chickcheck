import { auth } from "@/lib/auth";
import {
  deletePushSubscription,
  savePushSubscription,
} from "@/lib/services/push-subscriptions";
import { withErrorHandler } from "@/lib/api-handler";
import { NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 1000;

function isValidEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length > MAX_FIELD_LENGTH) {
    return false;
  }
  try {
    return new URL(endpoint).protocol === "https:";
  } catch {
    return false;
  }
}

function isValidKey(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_FIELD_LENGTH
  );
}

/**
 * Saves the push subscription for the current device.
 * Body: the browser's PushSubscription JSON ({ endpoint, keys: { p256dh, auth } }).
 */
export const POST = withErrorHandler(async (request: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { endpoint, keys } = body ?? {};

  if (
    !isValidEndpoint(endpoint) ||
    !isValidKey(keys?.p256dh) ||
    !isValidKey(keys?.auth)
  ) {
    return NextResponse.json(
      { error: "Invalid push subscription" },
      { status: 400 }
    );
  }

  await savePushSubscription(session.user.id, {
    endpoint,
    keys: { p256dh: keys.p256dh, auth: keys.auth },
  });

  return NextResponse.json({ success: true }, { status: 201 });
});

/**
 * Removes the push subscription for the current device. Body: { endpoint }.
 */
export const DELETE = withErrorHandler(async (request: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!isValidEndpoint(body?.endpoint)) {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  await deletePushSubscription(session.user.id, body.endpoint);
  return NextResponse.json({ success: true });
});
