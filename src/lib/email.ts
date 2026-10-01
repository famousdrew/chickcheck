interface Email {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Sends an email through Resend (https://resend.com) when RESEND_API_KEY is
 * set. Without a key the email is written to the server log instead, which
 * keeps local development working and lets an admin relay a message by hand.
 */
export async function sendEmail({ to, subject, text, html }: Email) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY is not set, so this email was not sent.\n` +
        `To: ${to}\nSubject: ${subject}\n\n${text}`
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "ChickCheck <onboarding@resend.dev>",
      to,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to send email (${response.status}): ${await response.text()}`
    );
  }
}

/**
 * The public base URL for links in emails. Never derived from the request's
 * Host header in production, since that would let an attacker point reset
 * links at their own domain.
 */
export function getAppUrl(request: Request): string | null {
  const configured = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }

  if (process.env.NODE_ENV !== "production") {
    return new URL(request.url).origin;
  }

  return null;
}
