import { compare } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { prisma } from "./prisma";
import { getClientIp, rateLimit } from "./rate-limit";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_PER_EMAIL = 10;
const MAX_ATTEMPTS_PER_IP = 30;

/**
 * Thrown when sign-in attempts exceed the rate limit. NextAuth passes
 * `code` back to the client as `result.code` from signIn().
 */
export class TooManyLoginAttempts extends CredentialsSignin {
  code = "rate_limited";
}

/**
 * Verifies email/password credentials for the NextAuth Credentials provider.
 * Attempts are rate limited per email (slows guessing one account) and per
 * IP (slows spraying many accounts).
 */
export async function authorizeCredentials(
  credentials: Partial<Record<"email" | "password", unknown>> | undefined,
  request?: Request
): Promise<{ id: string; email: string } | null> {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const email = String(credentials.email).toLowerCase().trim();
  const password = String(credentials.password);
  const ip = request ? getClientIp(request.headers) : "unknown";

  const byEmail = rateLimit(
    `login:email:${email}`,
    MAX_ATTEMPTS_PER_EMAIL,
    LOGIN_WINDOW_MS
  );
  const byIp = rateLimit(
    `login:ip:${ip}`,
    MAX_ATTEMPTS_PER_IP,
    LOGIN_WINDOW_MS
  );
  if (!byEmail.allowed || !byIp.allowed) {
    throw new TooManyLoginAttempts();
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}
