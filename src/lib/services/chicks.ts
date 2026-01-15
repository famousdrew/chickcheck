import { prisma } from "../prisma";

export interface CreateChickInput {
  flockId: string;
  name: string;
  breed?: string;
  hatchDate?: Date;
  description?: string;
  photoUrl?: string;
}

export interface UpdateChickInput {
  name?: string;
  breed?: string | null;
  hatchDate?: Date | null;
  description?: string | null;
  photoUrl?: string | null;
}

export async function createChick(data: CreateChickInput) {
  return prisma.chick.create({
    data: {
      flockId: data.flockId,
      name: data.name,
      breed: data.breed,
      hatchDate: data.hatchDate,
      description: data.description,
      photoUrl: data.photoUrl,
    },
  });
}

export async function findChickById(id: string) {
  return prisma.chick.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { takenAt: "desc" },
      },
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function findChicksByFlockId(flockId: string) {
  return prisma.chick.findMany({
    where: { flockId },
    include: {
      photos: {
        orderBy: { takenAt: "desc" },
        take: 1, // Just get the most recent photo for the gallery
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function updateChick(id: string, data: UpdateChickInput) {
  return prisma.chick.update({
    where: { id },
    data,
  });
}

export async function deleteChick(id: string) {
  return prisma.chick.delete({
    where: { id },
  });
}

export async function countChicksByFlockId(flockId: string) {
  return prisma.chick.count({
    where: { flockId },
  });
}

// ChickPhoto functions
export interface CreateChickPhotoInput {
  chickId: string;
  imageUrl: string;
  thumbnailUrl: string;
  takenAt?: Date;
  weekNumber?: number;
}

export async function createChickPhoto(data: CreateChickPhotoInput) {
  return prisma.chickPhoto.create({
    data: {
      chickId: data.chickId,
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl,
      takenAt: data.takenAt || new Date(),
      weekNumber: data.weekNumber,
    },
  });
}

export async function findChickPhotoById(id: string) {
  return prisma.chickPhoto.findUnique({
    where: { id },
  });
}

export async function findPhotosByChickId(chickId: string) {
  return prisma.chickPhoto.findMany({
    where: { chickId },
    orderBy: { takenAt: "desc" },
  });
}

export async function deleteChickPhoto(id: string) {
  return prisma.chickPhoto.delete({
    where: { id },
  });
}

export async function countPhotosByChickId(chickId: string) {
  return prisma.chickPhoto.count({
    where: { chickId },
  });
}

// ChickNote functions
export interface CreateChickNoteInput {
  chickId: string;
  content: string;
  weekNumber?: number;
}

export interface UpdateChickNoteInput {
  content: string;
}

export async function createChickNote(data: CreateChickNoteInput) {
  return prisma.chickNote.create({
    data: {
      chickId: data.chickId,
      content: data.content,
      weekNumber: data.weekNumber,
    },
  });
}

export async function findChickNoteById(id: string) {
  return prisma.chickNote.findUnique({
    where: { id },
  });
}

export async function findNotesByChickId(chickId: string) {
  return prisma.chickNote.findMany({
    where: { chickId },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateChickNote(id: string, data: UpdateChickNoteInput) {
  return prisma.chickNote.update({
    where: { id },
    data: {
      content: data.content,
    },
  });
}

export async function deleteChickNote(id: string) {
  return prisma.chickNote.delete({
    where: { id },
  });
}

export async function countNotesByChickId(chickId: string) {
  return prisma.chickNote.count({
    where: { chickId },
  });
}
