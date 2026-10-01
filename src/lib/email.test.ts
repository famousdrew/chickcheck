import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getAppUrl, sendEmail } from "./email";

const request = new Request(
  "https://evil.example.com/api/auth/forgot-password"
);

describe("email", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("APP_URL", "");
    vi.stubEnv("NEXTAUTH_URL", "");
    vi.stubEnv("RAILWAY_PUBLIC_DOMAIN", "");
    vi.stubEnv("RESEND_API_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("getAppUrl", () => {
    it("should prefer APP_URL and strip a trailing slash", () => {
      vi.stubEnv("APP_URL", "https://chickcheck.app/");
      vi.stubEnv("RAILWAY_PUBLIC_DOMAIN", "chickcheck.up.railway.app");
      expect(getAppUrl(request)).toBe("https://chickcheck.app");
    });

    it("should fall back to the Railway public domain", () => {
      vi.stubEnv("RAILWAY_PUBLIC_DOMAIN", "chickcheck.up.railway.app");
      expect(getAppUrl(request)).toBe("https://chickcheck.up.railway.app");
    });

    it("should never trust the request host in production", () => {
      vi.stubEnv("NODE_ENV", "production");
      expect(getAppUrl(request)).toBeNull();
    });

    it("should use the request origin in development", () => {
      vi.stubEnv("NODE_ENV", "development");
      expect(getAppUrl(request)).toBe("https://evil.example.com");
    });
  });

  describe("sendEmail", () => {
    it("should log instead of sending when RESEND_API_KEY is not set", async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

      await sendEmail({ to: "a@example.com", subject: "Hi", text: "Body" });

      expect(fetchMock).not.toHaveBeenCalled();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("Body"));
    });

    it("should send through Resend when configured", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test");
      vi.stubEnv("EMAIL_FROM", "ChickCheck <hi@chickcheck.app>");
      const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
      vi.stubGlobal("fetch", fetchMock);

      await sendEmail({ to: "a@example.com", subject: "Hi", text: "Body" });

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.resend.com/emails");
      expect(init.headers.Authorization).toBe("Bearer re_test");
      expect(JSON.parse(init.body)).toMatchObject({
        from: "ChickCheck <hi@chickcheck.app>",
        to: "a@example.com",
        subject: "Hi",
        text: "Body",
      });
    });

    it("should throw when Resend rejects the email", async () => {
      vi.stubEnv("RESEND_API_KEY", "re_test");
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response("bad", { status: 422 }))
      );

      await expect(
        sendEmail({ to: "a@example.com", subject: "Hi", text: "Body" })
      ).rejects.toThrow("422");
    });
  });
});
