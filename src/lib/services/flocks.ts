import { FlockStatus } from "@prisma/client";
import { prisma } from "../prisma";

export async function createFlock(
  userId: string,
  name: string = "My Flock",
  startDate?: Date
) {
  return prisma.flock.create({
    data: {
      userId,
      name,
      startDate,
      status: startDate ? FlockStatus.ACTIVE : FlockStatus.PREPARING,
      currentWeek: startDate ? 1 : 0,
    },
  });
}

export async function findFlockById(id: string) {
  return prisma.flock.findUnique({
    where: { id },
    include: {
      taskCompletions: true,
    },
  });
}

export async function findFlocksByUserId(userId: string) {
  return prisma.flock.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateFlock(
  id: string,
  data: {
    name?: string;
    startDate?: Date;
    currentWeek?: number;
    status?: FlockStatus;
  }
) {
  return prisma.flock.update({
    where: { id },
    data,
  });
}

export async function startFlock(id: string, startDate: Date = new Date()) {
  return prisma.flock.update({
    where: { id },
    data: {
      startDate,
      status: FlockStatus.ACTIVE,
      currentWeek: 1,
    },
  });
}

export async function graduateFlock(id: string) {
  return prisma.flock.update({
    where: { id },
    data: {
      status: FlockStatus.GRADUATED,
    },
  });
}

export async function deleteFlock(id: string) {
  return prisma.flock.delete({
    where: { id },
  });
}

export function calculateCurrentWeek(startDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.floor(diffDays / 7) + 1, 8);
}

export function calculateCurrentDay(startDate: Date): number {
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}
