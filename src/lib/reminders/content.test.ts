import { describe, expect, it } from "vitest";
import {
  buildEveningReminder,
  buildMorningReminder,
  getNewWeekTemperature,
  getTodaysTasks,
  type FlockDay,
} from "./content";

const flock = (overrides: Partial<FlockDay> = {}): FlockDay => ({
  name: "Spring Hatch",
  currentWeek: 1,
  currentDay: 3,
  remainingTasks: 4,
  ...overrides,
});

describe("reminder content", () => {
  describe("getTodaysTasks", () => {
    it("should include daily tasks and tasks scheduled for today", () => {
      const tasks = [
        { id: "daily", frequency: "DAILY", dayNumber: null },
        { id: "today", frequency: "ONCE", dayNumber: 3 },
        { id: "tomorrow", frequency: "ONCE", dayNumber: 4 },
        { id: "weekly", frequency: "WEEKLY", dayNumber: null },
      ];

      expect(getTodaysTasks(tasks, 3).map((t) => t.id)).toEqual([
        "daily",
        "today",
      ]);
    });
  });

  describe("getNewWeekTemperature", () => {
    it("should return the new temperature on the first day of weeks 2-6", () => {
      expect(
        getNewWeekTemperature(flock({ currentWeek: 2, currentDay: 8 }))
      ).toBe(90);
      expect(
        getNewWeekTemperature(flock({ currentWeek: 6, currentDay: 36 }))
      ).toBe(70);
    });

    it("should return null on other days or when the temperature is unchanged", () => {
      expect(
        getNewWeekTemperature(flock({ currentWeek: 1, currentDay: 1 }))
      ).toBeNull();
      expect(
        getNewWeekTemperature(flock({ currentWeek: 2, currentDay: 9 }))
      ).toBeNull();
      expect(
        getNewWeekTemperature(flock({ currentWeek: 7, currentDay: 43 }))
      ).toBeNull();
    });
  });

  describe("buildMorningReminder", () => {
    it("should summarize today's tasks for a single flock", () => {
      const payload = buildMorningReminder([flock()]);

      expect(payload).toMatchObject({
        body: "4 tasks for Spring Hatch today (Week 1, Day 3).",
        url: "/dashboard",
        tag: "chickcheck-morning",
      });
    });

    it("should mention the new brooder temperature at the start of a week", () => {
      const payload = buildMorningReminder([
        flock({ currentWeek: 3, currentDay: 15, remainingTasks: 1 }),
      ]);

      expect(payload?.body).toBe(
        "1 task for Spring Hatch today (Week 3, Day 15). Week 3 starts today - lower the brooder to 85°F for Spring Hatch."
      );
    });

    it("should say the heat can come off in week 6", () => {
      const payload = buildMorningReminder([
        flock({ currentWeek: 6, currentDay: 36, remainingTasks: 0 }),
      ]);

      expect(payload?.body).toMatch(/without the heat lamp/);
    });

    it("should list each flock when there are several", () => {
      const payload = buildMorningReminder([
        flock(),
        flock({ name: "Bantams", remainingTasks: 1 }),
      ]);

      expect(payload?.body).toBe(
        "Spring Hatch: 4 tasks today. Bantams: 1 task today."
      );
    });

    it("should send nothing when there is nothing to do", () => {
      expect(buildMorningReminder([flock({ remainingTasks: 0 })])).toBeNull();
      expect(buildMorningReminder([])).toBeNull();
    });
  });

  describe("buildEveningReminder", () => {
    it("should list only flocks with unfinished tasks", () => {
      const payload = buildEveningReminder([
        flock({ remainingTasks: 2 }),
        flock({ name: "Bantams", remainingTasks: 0 }),
      ]);

      expect(payload).toMatchObject({
        title: "Still to do today",
        body: "2 tasks left for Spring Hatch today.",
        tag: "chickcheck-evening",
      });
    });

    it("should send nothing when everything is done", () => {
      expect(buildEveningReminder([flock({ remainingTasks: 0 })])).toBeNull();
    });
  });
});
