import { TaskCategory, TaskFrequency } from "@prisma/client";
import { prisma } from "../prisma";

export async function findTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function findTasksByWeek(weekNumber: number) {
  return prisma.task.findMany({
    where: { weekNumber },
    orderBy: [{ dayNumber: "asc" }, { sortOrder: "asc" }],
  });
}

export async function findTasksByWeekAndDay(
  weekNumber: number,
  dayNumber: number
) {
  return prisma.task.findMany({
    where: {
      weekNumber,
      OR: [{ dayNumber }, { dayNumber: null, frequency: TaskFrequency.DAILY }],
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findDailyTasks(weekNumber: number) {
  return prisma.task.findMany({
    where: {
      weekNumber,
      frequency: TaskFrequency.DAILY,
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findWeeklyTasks(weekNumber: number) {
  return prisma.task.findMany({
    where: {
      weekNumber,
      frequency: TaskFrequency.WEEKLY,
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findOneTimeTasks(weekNumber: number) {
  return prisma.task.findMany({
    where: {
      weekNumber,
      frequency: TaskFrequency.ONCE,
    },
    orderBy: [{ dayNumber: "asc" }, { sortOrder: "asc" }],
  });
}

export async function findAllTasks() {
  return prisma.task.findMany({
    orderBy: [
      { weekNumber: "asc" },
      { dayNumber: "asc" },
      { sortOrder: "asc" },
    ],
  });
}

export async function findTasksByCategory(category: TaskCategory) {
  return prisma.task.findMany({
    where: { category },
    orderBy: [
      { weekNumber: "asc" },
      { dayNumber: "asc" },
      { sortOrder: "asc" },
    ],
  });
}

export async function createTask(data: {
  title: string;
  description: string;
  detailedContent: string;
  weekNumber: number;
  dayNumber?: number;
  frequency: TaskFrequency;
  category: TaskCategory;
  sortOrder?: number;
}) {
  return prisma.task.create({
    data,
  });
}

export async function createManyTasks(
  tasks: Array<{
    title: string;
    description: string;
    detailedContent: string;
    weekNumber: number;
    dayNumber?: number;
    frequency: TaskFrequency;
    category: TaskCategory;
    sortOrder?: number;
  }>
) {
  return prisma.task.createMany({
    data: tasks,
  });
}

export async function deleteAllTasks() {
  return prisma.task.deleteMany();
}
