import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/services/users";
import { createPasswordResetToken } from "@/lib/services/password-reset";
import { getAppUrl, sendEmail } from "@/lib/email";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;

// Same response whether or not the account exists, so this endpoint can't
// be used to discover which emails are registered
const SENT_MESSAGE =
  "If an account exists for that email, we've sent a link to reset your password.";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);
    if (!rateLimit(`forgot-password:ip:${ip}`, 5, WINDOW_MS).allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Quietly cap emails per address so nobody can flood an inbox
    if (!rateLimit(`forgot-password:email:${email}`, 3, WINDOW_MS).allowed) {
      return NextResponse.json({ message: SENT_MESSAGE });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: SENT_MESSAGE });
    }

    const appUrl = getAppUrl(request);
    if (!appUrl) {
      console.error(
        "Password reset: set APP_URL so reset links can be generated"
      );
      return NextResponse.json({ message: SENT_MESSAGE });
    }

    const token = await createPasswordResetToken(user.id);
    const link = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your ChickCheck password",
        text:
          `Someone asked to reset the password for your ChickCheck account.\n\n` +
          `Reset it here (link expires in 1 hour):\n${link}\n\n` +
          `If you didn't ask for this, you can ignore this email.`,
        html:
          `<p>Someone asked to reset the password for your ChickCheck account.</p>` +
          `<p><a href="${link}">Reset your password</a> (link expires in 1 hour)</p>` +
          `<p>If you didn't ask for this, you can ignore this email.</p>`,
      });
    } catch (error) {
      console.error("Password reset email failed:", error);
    }

    return NextResponse.json({ message: SENT_MESSAGE });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
