import { auth } from "@/lib/auth";
import { findFlockById } from "@/lib/services/flocks";
import {
  findChickById,
  createChickPhoto,
  findPhotosByChickId,
  countPhotosByChickId,
} from "@/lib/services/chicks";
import { uploadChickPhoto, StorageError } from "@/lib/utils/storage";
import { NextResponse } from "next/server";

const MAX_PHOTOS_PER_CHICK = 100;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ flockId: string; chickId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId, chickId } = await params;
  const flock = await findFlockById(flockId);

  if (!flock) {
    return NextResponse.json({ error: "Flock not found" }, { status: 404 });
  }

  if (flock.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const chick = await findChickById(chickId);

  if (!chick || chick.flockId !== flockId) {
    return NextResponse.json({ error: "Chick not found" }, { status: 404 });
  }

  const photos = await findPhotosByChickId(chickId);
  return NextResponse.json(photos);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ flockId: string; chickId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId, chickId } = await params;
  const flock = await findFlockById(flockId);

  if (!flock) {
    return NextResponse.json({ error: "Flock not found" }, { status: 404 });
  }

  if (flock.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const chick = await findChickById(chickId);

  if (!chick || chick.flockId !== flockId) {
    return NextResponse.json({ error: "Chick not found" }, { status: 404 });
  }

  // Check photo limit
  const photoCount = await countPhotosByChickId(chickId);
  if (photoCount >= MAX_PHOTOS_PER_CHICK) {
    return NextResponse.json(
      { error: `Maximum of ${MAX_PHOTOS_PER_CHICK} photos per chick` },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Calculate week number if flock has started
    let weekNumber: number | undefined;
    if (flock.startDate) {
      const diffDays = Math.floor(
        (Date.now() - flock.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      weekNumber = Math.min(Math.floor(diffDays / 7) + 1, 8);
    }

    // Upload to storage
    const { imageUrl, thumbnailUrl } = await uploadChickPhoto(
      chickId,
      file,
      file.type
    );

    // Create database record
    const photo = await createChickPhoto({
      chickId,
      imageUrl,
      thumbnailUrl,
      weekNumber,
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    if (error instanceof StorageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
