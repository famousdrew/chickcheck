import { describe, expect, it, vi, beforeEach } from "vitest";
import { FlockStatus } from "@prisma/client";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/services/flocks", () => ({
  findFlockById: vi.fn(),
  updateFlock: vi.fn(),
  startFlock: vi.fn(),
  deleteFlock: vi.fn(),
}));

vi.mock("@/lib/services/chicks", () => ({
  findPhotoUrlsByFlockId: vi.fn(),
}));

vi.mock("@/lib/utils/storage", () => ({
  deleteChickPhotos: vi.fn(),
}));

import { auth } from "@/lib/auth";
import {
  findFlockById,
  updateFlock,
  startFlock,
  deleteFlock,
} from "@/lib/services/flocks";
import { findPhotoUrlsByFlockId } from "@/lib/services/chicks";
import { deleteChickPhotos } from "@/lib/utils/storage";
import { PATCH, DELETE } from "./route";

const params = { params: Promise.resolve({ flockId: "flock-1" }) };

function mockFlock(status: FlockStatus, overrides = {}) {
  vi.mocked(findFlockById).mockResolvedValue({
    id: "flock-1",
    name: "My Flock",
    startDate: status === FlockStatus.PREPARING ? null : new Date("2026-01-01"),
    currentWeek: 1,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "user-1",
    ...overrides,
  });
}

function patch(body: unknown) {
  return PATCH(
    new Request("http://localhost/api/flocks/flock-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    params
  );
}

describe("/api/flocks/[flockId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user-1", email: "test@example.com" },
      expires: "",
    } as never);
    vi.mocked(updateFlock).mockImplementation(
      async (id, data) => ({ id, ...data }) as never
    );
    vi.mocked(deleteChickPhotos).mockResolvedValue();
  });

  describe("PATCH", () => {
    it("should return 403 for another user's flock", async () => {
      mockFlock(FlockStatus.ACTIVE, { userId: "someone-else" });

      const response = await patch({ name: "Mine now" });

      expect(response.status).toBe(403);
      expect(updateFlock).not.toHaveBeenCalled();
    });

    it("should rename a flock, trimming whitespace", async () => {
      mockFlock(FlockStatus.ACTIVE);

      const response = await patch({ name: "  Spring Hatch  " });

      expect(response.status).toBe(200);
      expect(updateFlock).toHaveBeenCalledWith("flock-1", {
        name: "Spring Hatch",
      });
    });

    it("should reject an empty or overlong name", async () => {
      mockFlock(FlockStatus.ACTIVE);

      expect((await patch({ name: "   " })).status).toBe(400);
      expect((await patch({ name: "x".repeat(101) })).status).toBe(400);
      expect((await patch({ name: 42 })).status).toBe(400);
      expect(updateFlock).not.toHaveBeenCalled();
    });

    it("should graduate an active flock", async () => {
      mockFlock(FlockStatus.ACTIVE);

      const response = await patch({ status: "GRADUATED" });

      expect(response.status).toBe(200);
      expect(updateFlock).toHaveBeenCalledWith("flock-1", {
        status: FlockStatus.GRADUATED,
      });
    });

    it("should allow un-graduating back to active", async () => {
      mockFlock(FlockStatus.GRADUATED);

      const response = await patch({ status: "ACTIVE" });

      expect(response.status).toBe(200);
    });

    it("should not graduate a flock that has not started", async () => {
      mockFlock(FlockStatus.PREPARING);

      const response = await patch({ status: "GRADUATED" });

      expect(response.status).toBe(400);
      expect(updateFlock).not.toHaveBeenCalled();
    });

    it("should reject an unknown status", async () => {
      mockFlock(FlockStatus.ACTIVE);

      const response = await patch({ status: "HATCHING" });

      expect(response.status).toBe(400);
      expect(updateFlock).not.toHaveBeenCalled();
    });

    it("should not allow writing currentWeek, which is derived from startDate", async () => {
      mockFlock(FlockStatus.ACTIVE);

      const response = await patch({ currentWeek: 7 });

      expect(response.status).toBe(400);
      expect(updateFlock).not.toHaveBeenCalled();
    });

    it("should accept a past startDate for a started flock", async () => {
      mockFlock(FlockStatus.ACTIVE);

      const response = await patch({ startDate: "2026-01-05T00:00:00.000Z" });

      expect(response.status).toBe(200);
      expect(updateFlock).toHaveBeenCalledWith("flock-1", {
        startDate: new Date("2026-01-05T00:00:00.000Z"),
      });
    });

    it("should reject an invalid or future startDate", async () => {
      mockFlock(FlockStatus.ACTIVE);
      const future = new Date(Date.now() + 7 * 86400000).toISOString();

      expect((await patch({ startDate: "not-a-date" })).status).toBe(400);
      expect((await patch({ startDate: future })).status).toBe(400);
      expect(updateFlock).not.toHaveBeenCalled();
    });

    it("should start a preparing flock", async () => {
      mockFlock(FlockStatus.PREPARING);
      vi.mocked(startFlock).mockResolvedValue({ id: "flock-1" } as never);

      const response = await patch({ action: "start" });

      expect(response.status).toBe(200);
      expect(startFlock).toHaveBeenCalledWith("flock-1", expect.any(Date));
    });

    it("should not restart a flock that already started", async () => {
      mockFlock(FlockStatus.ACTIVE);

      const response = await patch({ action: "start" });

      expect(response.status).toBe(400);
      expect(startFlock).not.toHaveBeenCalled();
    });
  });

  describe("DELETE", () => {
    it("should delete the flock and clean up its photos in storage", async () => {
      mockFlock(FlockStatus.ACTIVE);
      vi.mocked(findPhotoUrlsByFlockId).mockResolvedValue([
        "https://blob/a.jpg",
        "https://blob/a-thumb.jpg",
      ]);

      const response = await DELETE(
        new Request("http://localhost/api/flocks/flock-1", {
          method: "DELETE",
        }),
        params
      );

      expect(response.status).toBe(200);
      expect(findPhotoUrlsByFlockId).toHaveBeenCalledWith("flock-1");
      expect(deleteFlock).toHaveBeenCalledWith("flock-1");
      expect(deleteChickPhotos).toHaveBeenCalledWith([
        "https://blob/a.jpg",
        "https://blob/a-thumb.jpg",
      ]);
    });

    it("should skip storage cleanup when there are no photos", async () => {
      mockFlock(FlockStatus.ACTIVE);
      vi.mocked(findPhotoUrlsByFlockId).mockResolvedValue([]);

      await DELETE(
        new Request("http://localhost/api/flocks/flock-1", {
          method: "DELETE",
        }),
        params
      );

      expect(deleteFlock).toHaveBeenCalled();
      expect(deleteChickPhotos).not.toHaveBeenCalled();
    });

    it("should not delete another user's flock", async () => {
      mockFlock(FlockStatus.ACTIVE, { userId: "someone-else" });

      const response = await DELETE(
        new Request("http://localhost/api/flocks/flock-1", {
          method: "DELETE",
        }),
        params
      );

      expect(response.status).toBe(403);
      expect(deleteFlock).not.toHaveBeenCalled();
      expect(deleteChickPhotos).not.toHaveBeenCalled();
    });
  });
});
