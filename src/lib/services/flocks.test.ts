import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("../prisma", () => ({
  prisma: {
    flock: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import {
  calculateCurrentDay,
  calculateCurrentWeek,
  getEffectiveCurrentWeek,
} from "./flocks";

// Noon UTC is early morning in Pacific, so the Pacific date matches the UTC date
const START = new Date("2026-03-01T20:00:00Z");

function setToday(isoDate: string) {
  vi.setSystemTime(new Date(`${isoDate}T20:00:00Z`));
}

describe("Flock week calculations", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("calculateCurrentWeek", () => {
    it("should be week 1 on the start date", () => {
      setToday("2026-03-01");
      expect(calculateCurrentWeek(START)).toBe(1);
    });

    it("should still be week 1 on day 7", () => {
      setToday("2026-03-07");
      expect(calculateCurrentWeek(START)).toBe(1);
    });

    it("should advance to week 2 on day 8", () => {
      setToday("2026-03-08");
      expect(calculateCurrentWeek(START)).toBe(2);
    });

    it("should cap at week 8", () => {
      setToday("2026-06-01");
      expect(calculateCurrentWeek(START)).toBe(8);
    });

    it("should not go below week 1 for a future start date", () => {
      setToday("2026-02-20");
      expect(calculateCurrentWeek(START)).toBe(1);
    });
  });

  describe("calculateCurrentDay", () => {
    it("should be day 1 on the start date and count up", () => {
      setToday("2026-03-01");
      expect(calculateCurrentDay(START)).toBe(1);
      setToday("2026-03-10");
      expect(calculateCurrentDay(START)).toBe(10);
    });
  });

  describe("getEffectiveCurrentWeek", () => {
    it("should use the stored week for a flock that has not started", () => {
      expect(getEffectiveCurrentWeek({ startDate: null, currentWeek: 0 })).toBe(
        0
      );
    });

    it("should derive the week from startDate, ignoring a stale stored week", () => {
      setToday("2026-03-20");
      expect(
        getEffectiveCurrentWeek({ startDate: START, currentWeek: 1 })
      ).toBe(3);
    });
  });
});
