import { put, del } from "@vercel/blob";
import sharp from "sharp";

export interface UploadResult {
  imageUrl: string;
  thumbnailUrl: string;
}

export interface ProcessedImage {
  optimized: Buffer;
  thumbnail: Buffer;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const OPTIMIZED_MAX_WIDTH = 800;
const THUMBNAIL_SIZE = 200;

export class StorageError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export function validateImageFile(
  file: File | Blob,
  contentType?: string
): void {
  const type = contentType || (file instanceof File ? file.type : "");

  if (!ALLOWED_TYPES.includes(type)) {
    throw new StorageError(
      "Invalid file type. Allowed types: JPEG, PNG, WebP",
      "INVALID_TYPE"
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new StorageError(
      `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      "FILE_TOO_LARGE"
    );
  }
}

export async function processImage(buffer: Buffer): Promise<ProcessedImage> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  // Create optimized version (max 800px width, maintain aspect ratio)
  let optimized: Buffer;
  if (metadata.width && metadata.width > OPTIMIZED_MAX_WIDTH) {
    optimized = await image
      .resize(OPTIMIZED_MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  } else {
    optimized = await image.jpeg({ quality: 85 }).toBuffer();
  }

  // Create thumbnail (200x200, cover/crop to square)
  const thumbnail = await sharp(buffer)
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  return { optimized, thumbnail };
}

export async function uploadChickPhoto(
  chickId: string,
  file: File | Blob,
  contentType?: string
): Promise<UploadResult> {
  validateImageFile(file, contentType);

  const buffer = Buffer.from(await file.arrayBuffer());
  const { optimized, thumbnail } = await processImage(buffer);

  const timestamp = Date.now();
  const basePath = `chicks/${chickId}/${timestamp}`;

  // Upload optimized image
  const imageBlob = await put(`${basePath}.jpg`, optimized, {
    access: "public",
    contentType: "image/jpeg",
  });

  // Upload thumbnail
  const thumbnailBlob = await put(`${basePath}-thumb.jpg`, thumbnail, {
    access: "public",
    contentType: "image/jpeg",
  });

  return {
    imageUrl: imageBlob.url,
    thumbnailUrl: thumbnailBlob.url,
  };
}

export async function deleteChickPhotos(urls: string[]): Promise<void> {
  await Promise.all(
    urls.map(async (url) => {
      try {
        await del(url);
      } catch (error) {
        // Log but don't fail if deletion fails
        console.error(`Failed to delete blob: ${url}`, error);
      }
    })
  );
}
