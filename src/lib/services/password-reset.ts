import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../prisma";
import { updateUser } from "./users";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Only a SHA-256 hash of each token is stored, so a database leak does not
 * expose usable reset links.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a single-use reset token for a user and returns the raw token to
 * put in the emailed link. Any earlier tokens for the user stop working.
 */
export async function createPasswordResetToken(userId: string) {
  const token = randomBytes(32).toString("base64url");

  await prisma.passwordResetToken.deleteMany({ where: { userId } });
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  return token;
}

/**
 * Sets a new password if the token is valid, unused and unexpired.
 * Returns false otherwise.
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<boolean> {
  const tokenHash = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record) {
    return false;
  }

  // Claim the token atomically so it can't be used twice concurrently
  const now = new Date();
  const claimed = await prisma.passwordResetToken.updateMany({
    where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
    data: { usedAt: now },
  });

  if (claimed.count === 0) {
    return false;
  }

  await updateUser(record.userId, { password: newPassword });
  await prisma.passwordResetToken.deleteMany({
    where: { userId: record.userId, id: { not: record.id } },
  });

  return true;
}
