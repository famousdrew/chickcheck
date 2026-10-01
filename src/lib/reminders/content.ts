import type { PushPayload } from "../push";
import { getRecommendedTemperature } from "../utils/temperature";

/** Today's state for one active flock */
export interface FlockDay {
  name: string;
  currentWeek: number;
  currentDay: number;
  remainingTasks: number;
}

interface TaskLike {
  id: string;
  frequency: string;
  dayNumber: number | null;
}

/**
 * Tasks due today: every daily task plus anything scheduled for this day.
 * Matches what the dashboard shows under "today".
 */
export function getTodaysTasks<T extends TaskLike>(
  tasks: T[],
  currentDay: number
): T[] {
  return tasks.filter(
    (t) => t.frequency === "DAILY" || t.dayNumber === currentDay
  );
}

/**
 * The new brooder temperature if today is the first day of a week where it
 * changes, otherwise null.
 */
export function getNewWeekTemperature(flock: FlockDay): number | null {
  const isFirstDayOfWeek = flock.currentDay > 1 && flock.currentDay % 7 === 1;
  if (!isFirstDayOfWeek) return null;

  const temperature = getRecommendedTemperature(flock.currentWeek);
  const previous = getRecommendedTemperature(flock.currentWeek - 1);
  return temperature !== previous ? temperature : null;
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function newWeekNote(flock: FlockDay, temperature: number): string {
  return temperature <= 70
    ? `Week ${flock.currentWeek} starts today - ${flock.name} can go without the heat lamp if the room stays above 65°F.`
    : `Week ${flock.currentWeek} starts today - lower the brooder to ${temperature}°F for ${flock.name}.`;
}

export function buildMorningReminder(flocks: FlockDay[]): PushPayload | null {
  const lines: string[] = [];

  for (const flock of flocks) {
    const temperature = getNewWeekTemperature(flock);
    if (flock.remainingTasks === 0 && temperature === null) continue;

    if (flock.remainingTasks > 0) {
      lines.push(
        flocks.length === 1
          ? `${plural(flock.remainingTasks, "task")} for ${flock.name} today (Week ${flock.currentWeek}, Day ${flock.currentDay}).`
          : `${flock.name}: ${plural(flock.remainingTasks, "task")} today.`
      );
    }
    if (temperature !== null) {
      lines.push(newWeekNote(flock, temperature));
    }
  }

  if (lines.length === 0) return null;

  return {
    title: "Good morning! Time to check on your chicks",
    body: lines.join(" "),
    url: "/dashboard",
    tag: "chickcheck-morning",
  };
}

export function buildEveningReminder(flocks: FlockDay[]): PushPayload | null {
  const pending = flocks.filter((f) => f.remainingTasks > 0);
  if (pending.length === 0) return null;

  const body =
    pending.length === 1
      ? `${plural(pending[0].remainingTasks, "task")} left for ${pending[0].name} today.`
      : pending
          .map((f) => `${f.name}: ${plural(f.remainingTasks, "task")} left.`)
          .join(" ");

  return {
    title: "Still to do today",
    body,
    url: "/dashboard",
    tag: "chickcheck-evening",
  };
}
