import { auth } from "@/lib/auth";
import { findFlockById } from "@/lib/services/flocks";
import {
  findChickById,
  findChickPhotoById,
  deleteChickPhoto,
} from "@/lib/services/chicks";
import { deleteChickPhotos } from "@/lib/utils/storage";
import { withErrorHandler } from "@/lib/api-handler";
import { NextResponse } from "next/server";

export const DELETE = withErrorHandler(
  async (
    _request: Request,
    {
      params,
    }: {
      params: Promise<{ flockId: string; chickId: string; photoId: string }>;
    }
  ) => {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { flockId, chickId, photoId } = await params;
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

    const photo = await findChickPhotoById(photoId);

    if (!photo || photo.chickId !== chickId) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Delete from database first, then clean up storage
    await deleteChickPhoto(photoId);

    // Clean up cloud storage (non-blocking)
    deleteChickPhotos([photo.imageUrl, photo.thumbnailUrl]).catch((err) => {
      console.error("Failed to clean up cloud storage:", err);
    });

    return NextResponse.json({ success: true });
  }
);
