import { prisma } from "../prisma";

export async function completeTask(
  flockId: string,
  taskId: string,
  dayDate: Date,
  notes?: string
) {
  return prisma.taskCompletion.upsert({
    where: {
      flockId_taskId_dayDate: {
        flockId,
        taskId,
        dayDate,
      },
    },
    update: {
      completedAt: new Date(),
      undoneAt: null,
      notes,
    },
    create: {
      flockId,
      taskId,
      dayDate,
      notes,
    },
  });
}

export async function undoTaskCompletion(
  flockId: string,
  taskId: string,
  dayDate: Date
) {
  return prisma.taskCompletion.update({
    where: {
      flockId_taskId_dayDate: {
        flockId,
        taskId,
        dayDate,
      },
    },
    data: {
      undoneAt: new Date(),
    },
  });
}

export async function findCompletionsByFlock(flockId: string) {
  return prisma.taskCompletion.findMany({
    where: {
      flockId,
      undoneAt: null,
    },
    include: {
      task: true,
    },
    orderBy: { completedAt: "desc" },
  });
}

export async function findCompletionsByFlockAndDate(
  flockId: string,
  dayDate: Date
) {
  return prisma.taskCompletion.findMany({
    where: {
      flockId,
      dayDate,
      undoneAt: null,
    },
    include: {
      task: true,
    },
  });
}

export async function findCompletionsByFlockAndTask(
  flockId: string,
  taskId: string
) {
  return prisma.taskCompletion.findMany({
    where: {
      flockId,
      taskId,
      undoneAt: null,
    },
    orderBy: { dayDate: "desc" },
  });
}

export async function isTaskCompletedForDay(
  flockId: string,
  taskId: string,
  dayDate: Date
): Promise<boolean> {
  const completion = await prisma.taskCompletion.findUnique({
    where: {
      flockId_taskId_dayDate: {
        flockId,
        taskId,
        dayDate,
      },
    },
  });
  return completion !== null && completion.undoneAt === null;
}

export async function getCompletionStats(flockId: string) {
  const completions = await prisma.taskCompletion.findMany({
    where: {
      flockId,
      undoneAt: null,
    },
    include: {
      task: true,
    },
  });

  const totalCompleted = completions.length;
  const byCategory = completions.reduce(
    (acc, c) => {
      acc[c.task.category] = (acc[c.task.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalCompleted,
    byCategory,
  };
}
