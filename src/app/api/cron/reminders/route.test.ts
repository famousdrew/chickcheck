import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/reminders/job", () => ({
  runReminderJob: vi.fn(),
}));

import { runReminderJob } from "@/lib/reminders/job";
import { POST } from "./route";

function request(authorization?: string) {
  return new Request("http://localhost/api/cron/reminders", {
    method: "POST",
    headers: authorization ? { authorization } : {},
  });
}

describe("POST /api/cron/reminders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("CRON_SECRET", "s3cret");
    vi.mocked(runReminderJob).mockResolvedValue({
      usersChecked: 2,
      remindersSent: 1,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should run the job with the right secret", async () => {
    const response = await POST(request("Bearer s3cret"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      usersChecked: 2,
      remindersSent: 1,
    });
  });

  it("should reject a missing or wrong secret", async () => {
    expect((await POST(request())).status).toBe(401);
    expect((await POST(request("Bearer wrong"))).status).toBe(401);
    expect(runReminderJob).not.toHaveBeenCalled();
  });

  it("should be disabled when CRON_SECRET is not set", async () => {
    vi.stubEnv("CRON_SECRET", "");

    const response = await POST(request("Bearer "));

    expect(response.status).toBe(401);
    expect(runReminderJob).not.toHaveBeenCalled();
  });
});
