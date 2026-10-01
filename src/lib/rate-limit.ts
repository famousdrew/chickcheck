/**
 * Simple in-memory rate limiter.
 * Not suitable for multi-instance deployments — use Redis for that.
 */

const requests = new Map<string, { count: number; resetAt: number }>();

// Clean up stale entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of requests) {
      if (now > value.resetAt) {
        requests.delete(key);
      }
    }
  },
  5 * 60 * 1000
);

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

/**
 * Best-effort client IP from proxy headers (Railway sets x-forwarded-for).
 */
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Clear all rate limit state. Intended for tests.
 */
export function resetRateLimits(): void {
  requests.clear();
}
