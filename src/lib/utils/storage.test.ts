import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock @vercel/blob
vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
  del: vi.fn(),
}));

// Mock sharp
vi.mock("sharp", () => {
  const mockSharp = vi.fn(() => ({
    metadata: vi.fn().mockResolvedValue({ width: 1200, height: 800 }),
    resize: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from("processed")),
  }));
  return { default: mockSharp };
});

import { put, del } from "@vercel/blob";
import {
  validateImageFile,
  processImage,
  uploadChickPhoto,
  deleteChickPhotos,
  StorageError,
} from "./storage";

describe("validateImageFile", () => {
  it("should accept valid JPEG file", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("should accept valid PNG file", () => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("should accept valid WebP file", () => {
    const file = new File(["test"], "test.webp", { type: "image/webp" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("should reject invalid file type", () => {
    const file = new File(["test"], "test.gif", { type: "image/gif" });
    expect(() => validateImageFile(file)).toThrow(StorageError);
    expect(() => validateImageFile(file)).toThrow("Invalid file type");
  });

  it("should reject files over 5MB", () => {
    const largeContent = new Uint8Array(6 * 1024 * 1024); // 6MB
    const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });
    expect(() => validateImageFile(file)).toThrow(StorageError);
    expect(() => validateImageFile(file)).toThrow("File too large");
  });

  it("should use contentType parameter when provided", () => {
    const blob = new Blob(["test"]);
    expect(() => validateImageFile(blob, "image/jpeg")).not.toThrow();
  });
});

describe("processImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return processed buffers", async () => {
    const inputBuffer = Buffer.from("test image data");
    const result = await processImage(inputBuffer);

    expect(result).toHaveProperty("optimized");
    expect(result).toHaveProperty("thumbnail");
    expect(Buffer.isBuffer(result.optimized)).toBe(true);
    expect(Buffer.isBuffer(result.thumbnail)).toBe(true);
  });
});

describe("uploadChickPhoto", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(put).mockResolvedValue({
      url: "https://blob.vercel-storage.com/test.jpg",
      pathname: "test.jpg",
      contentType: "image/jpeg",
      contentDisposition: "",
      downloadUrl: "",
    });
  });

  it("should upload image and thumbnail", async () => {
    // Create a mock file-like object that works in Node
    const mockFile = {
      size: 1000,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    } as unknown as File;

    // Pass contentType as second argument
    const result = await uploadChickPhoto("chick-123", mockFile, "image/jpeg");

    expect(put).toHaveBeenCalledTimes(2);
    expect(result).toHaveProperty("imageUrl");
    expect(result).toHaveProperty("thumbnailUrl");
  });

  it("should validate file before upload", async () => {
    const mockFile = {
      size: 1000,
      arrayBuffer: vi.fn(),
    } as unknown as File;

    await expect(
      uploadChickPhoto("chick-123", mockFile, "image/gif")
    ).rejects.toThrow(StorageError);
    expect(put).not.toHaveBeenCalled();
  });
});

describe("deleteChickPhotos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(del).mockResolvedValue(undefined);
  });

  it("should delete all provided URLs", async () => {
    const urls = [
      "https://blob.vercel-storage.com/image1.jpg",
      "https://blob.vercel-storage.com/image2.jpg",
    ];

    await deleteChickPhotos(urls);

    expect(del).toHaveBeenCalledTimes(2);
    expect(del).toHaveBeenCalledWith(urls[0]);
    expect(del).toHaveBeenCalledWith(urls[1]);
  });

  it("should continue if one deletion fails", async () => {
    vi.mocked(del)
      .mockRejectedValueOnce(new Error("Delete failed"))
      .mockResolvedValueOnce(undefined);

    const urls = [
      "https://blob.vercel-storage.com/image1.jpg",
      "https://blob.vercel-storage.com/image2.jpg",
    ];

    // Should not throw
    await expect(deleteChickPhotos(urls)).resolves.toBeUndefined();
    expect(del).toHaveBeenCalledTimes(2);
  });

  it("should handle empty array", async () => {
    await deleteChickPhotos([]);
    expect(del).not.toHaveBeenCalled();
  });
});
