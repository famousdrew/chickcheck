import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("../prisma", () => ({
  prisma: {
    chick: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    chickPhoto: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    chickNote: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from "../prisma";
import {
  createChick,
  findChickById,
  findChicksByFlockId,
  updateChick,
  deleteChick,
  countChicksByFlockId,
  createChickPhoto,
  findChickPhotoById,
  findPhotosByChickId,
  deleteChickPhoto,
  countPhotosByChickId,
  createChickNote,
  findChickNoteById,
  findNotesByChickId,
  updateChickNote,
  deleteChickNote,
  countNotesByChickId,
} from "./chicks";

describe("Chick Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createChick", () => {
    it("should create a chick with required fields", async () => {
      const mockChick = {
        id: "chick-123",
        flockId: "flock-123",
        name: "Henrietta",
        breed: null,
        hatchDate: null,
        description: null,
        photoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.chick.create).mockResolvedValue(mockChick);

      const result = await createChick({
        flockId: "flock-123",
        name: "Henrietta",
      });

      expect(prisma.chick.create).toHaveBeenCalledWith({
        data: {
          flockId: "flock-123",
          name: "Henrietta",
          breed: undefined,
          hatchDate: undefined,
          description: undefined,
          photoUrl: undefined,
        },
      });
      expect(result).toEqual(mockChick);
    });

    it("should create a chick with all fields", async () => {
      const hatchDate = new Date("2026-01-01");
      const mockChick = {
        id: "chick-123",
        flockId: "flock-123",
        name: "Goldie",
        breed: "Buff Orpington",
        hatchDate,
        description: "Golden feathers, very friendly",
        photoUrl: "https://example.com/goldie.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.chick.create).mockResolvedValue(mockChick);

      const result = await createChick({
        flockId: "flock-123",
        name: "Goldie",
        breed: "Buff Orpington",
        hatchDate,
        description: "Golden feathers, very friendly",
        photoUrl: "https://example.com/goldie.jpg",
      });

      expect(result.name).toBe("Goldie");
      expect(result.breed).toBe("Buff Orpington");
    });
  });

  describe("findChickById", () => {
    it("should find chick with photos and notes", async () => {
      const mockChick = {
        id: "chick-123",
        flockId: "flock-123",
        name: "Henrietta",
        breed: null,
        hatchDate: null,
        description: null,
        photoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [],
        notes: [],
      };
      vi.mocked(prisma.chick.findUnique).mockResolvedValue(mockChick);

      const result = await findChickById("chick-123");

      expect(prisma.chick.findUnique).toHaveBeenCalledWith({
        where: { id: "chick-123" },
        include: {
          photos: { orderBy: { takenAt: "desc" } },
          notes: { orderBy: { createdAt: "desc" } },
        },
      });
      expect(result).toEqual(mockChick);
    });

    it("should return null for non-existent chick", async () => {
      vi.mocked(prisma.chick.findUnique).mockResolvedValue(null);

      const result = await findChickById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("findChicksByFlockId", () => {
    it("should find all chicks in a flock", async () => {
      const mockChicks = [
        { id: "chick-1", name: "Henrietta", photos: [] },
        { id: "chick-2", name: "Goldie", photos: [] },
      ];
      vi.mocked(prisma.chick.findMany).mockResolvedValue(mockChicks as never);

      const result = await findChicksByFlockId("flock-123");

      expect(prisma.chick.findMany).toHaveBeenCalledWith({
        where: { flockId: "flock-123" },
        include: {
          photos: {
            orderBy: { takenAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "asc" },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe("updateChick", () => {
    it("should update chick name", async () => {
      const mockChick = {
        id: "chick-123",
        name: "New Name",
      };
      vi.mocked(prisma.chick.update).mockResolvedValue(mockChick as never);

      const result = await updateChick("chick-123", { name: "New Name" });

      expect(prisma.chick.update).toHaveBeenCalledWith({
        where: { id: "chick-123" },
        data: { name: "New Name" },
      });
      expect(result.name).toBe("New Name");
    });
  });

  describe("deleteChick", () => {
    it("should delete chick by id", async () => {
      const mockChick = { id: "chick-123", name: "Henrietta" };
      vi.mocked(prisma.chick.delete).mockResolvedValue(mockChick as never);

      const result = await deleteChick("chick-123");

      expect(prisma.chick.delete).toHaveBeenCalledWith({
        where: { id: "chick-123" },
      });
      expect(result.id).toBe("chick-123");
    });
  });

  describe("countChicksByFlockId", () => {
    it("should return count of chicks", async () => {
      vi.mocked(prisma.chick.count).mockResolvedValue(5);

      const result = await countChicksByFlockId("flock-123");

      expect(prisma.chick.count).toHaveBeenCalledWith({
        where: { flockId: "flock-123" },
      });
      expect(result).toBe(5);
    });
  });
});

describe("ChickPhoto Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createChickPhoto", () => {
    it("should create a photo with required fields", async () => {
      const mockPhoto = {
        id: "photo-123",
        chickId: "chick-123",
        imageUrl: "https://example.com/image.jpg",
        thumbnailUrl: "https://example.com/thumb.jpg",
        takenAt: new Date(),
        weekNumber: 2,
        createdAt: new Date(),
      };
      vi.mocked(prisma.chickPhoto.create).mockResolvedValue(mockPhoto);

      const result = await createChickPhoto({
        chickId: "chick-123",
        imageUrl: "https://example.com/image.jpg",
        thumbnailUrl: "https://example.com/thumb.jpg",
        weekNumber: 2,
      });

      expect(prisma.chickPhoto.create).toHaveBeenCalled();
      expect(result.imageUrl).toBe("https://example.com/image.jpg");
    });
  });

  describe("findChickPhotoById", () => {
    it("should find photo by id", async () => {
      const mockPhoto = {
        id: "photo-123",
        imageUrl: "https://example.com/image.jpg",
      };
      vi.mocked(prisma.chickPhoto.findUnique).mockResolvedValue(
        mockPhoto as never
      );

      const result = await findChickPhotoById("photo-123");

      expect(prisma.chickPhoto.findUnique).toHaveBeenCalledWith({
        where: { id: "photo-123" },
      });
      expect(result?.id).toBe("photo-123");
    });
  });

  describe("findPhotosByChickId", () => {
    it("should find all photos for a chick", async () => {
      const mockPhotos = [
        { id: "photo-1", imageUrl: "url1" },
        { id: "photo-2", imageUrl: "url2" },
      ];
      vi.mocked(prisma.chickPhoto.findMany).mockResolvedValue(
        mockPhotos as never
      );

      const result = await findPhotosByChickId("chick-123");

      expect(prisma.chickPhoto.findMany).toHaveBeenCalledWith({
        where: { chickId: "chick-123" },
        orderBy: { takenAt: "desc" },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe("deleteChickPhoto", () => {
    it("should delete photo by id", async () => {
      const mockPhoto = { id: "photo-123" };
      vi.mocked(prisma.chickPhoto.delete).mockResolvedValue(mockPhoto as never);

      await deleteChickPhoto("photo-123");

      expect(prisma.chickPhoto.delete).toHaveBeenCalledWith({
        where: { id: "photo-123" },
      });
    });
  });

  describe("countPhotosByChickId", () => {
    it("should return count of photos", async () => {
      vi.mocked(prisma.chickPhoto.count).mockResolvedValue(10);

      const result = await countPhotosByChickId("chick-123");

      expect(result).toBe(10);
    });
  });
});

describe("ChickNote Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createChickNote", () => {
    it("should create a note", async () => {
      const mockNote = {
        id: "note-123",
        chickId: "chick-123",
        content: "Very curious chick!",
        weekNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.chickNote.create).mockResolvedValue(mockNote);

      const result = await createChickNote({
        chickId: "chick-123",
        content: "Very curious chick!",
        weekNumber: 1,
      });

      expect(prisma.chickNote.create).toHaveBeenCalledWith({
        data: {
          chickId: "chick-123",
          content: "Very curious chick!",
          weekNumber: 1,
        },
      });
      expect(result.content).toBe("Very curious chick!");
    });
  });

  describe("findChickNoteById", () => {
    it("should find note by id", async () => {
      const mockNote = { id: "note-123", content: "Friendly!" };
      vi.mocked(prisma.chickNote.findUnique).mockResolvedValue(
        mockNote as never
      );

      const result = await findChickNoteById("note-123");

      expect(result?.id).toBe("note-123");
    });
  });

  describe("findNotesByChickId", () => {
    it("should find all notes for a chick", async () => {
      const mockNotes = [
        { id: "note-1", content: "Note 1" },
        { id: "note-2", content: "Note 2" },
      ];
      vi.mocked(prisma.chickNote.findMany).mockResolvedValue(
        mockNotes as never
      );

      const result = await findNotesByChickId("chick-123");

      expect(prisma.chickNote.findMany).toHaveBeenCalledWith({
        where: { chickId: "chick-123" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe("updateChickNote", () => {
    it("should update note content", async () => {
      const mockNote = { id: "note-123", content: "Updated content" };
      vi.mocked(prisma.chickNote.update).mockResolvedValue(mockNote as never);

      const result = await updateChickNote("note-123", {
        content: "Updated content",
      });

      expect(prisma.chickNote.update).toHaveBeenCalledWith({
        where: { id: "note-123" },
        data: { content: "Updated content" },
      });
      expect(result.content).toBe("Updated content");
    });
  });

  describe("deleteChickNote", () => {
    it("should delete note by id", async () => {
      const mockNote = { id: "note-123" };
      vi.mocked(prisma.chickNote.delete).mockResolvedValue(mockNote as never);

      await deleteChickNote("note-123");

      expect(prisma.chickNote.delete).toHaveBeenCalledWith({
        where: { id: "note-123" },
      });
    });
  });

  describe("countNotesByChickId", () => {
    it("should return count of notes", async () => {
      vi.mocked(prisma.chickNote.count).mockResolvedValue(3);

      const result = await countNotesByChickId("chick-123");

      expect(result).toBe(3);
    });
  });
});
