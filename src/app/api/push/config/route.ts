import { NextResponse } from "next/server";
import { getVapidPublicKey, isPushConfigured } from "@/lib/push";

export const dynamic = "force-dynamic";

/**
 * Tells the client whether push is available and which key to subscribe with.
 */
export async function GET() {
  return NextResponse.json({
    enabled: isPushConfigured(),
    publicKey: isPushConfigured() ? getVapidPublicKey() : null,
  });
}
