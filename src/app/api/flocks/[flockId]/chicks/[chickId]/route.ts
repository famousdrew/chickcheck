import { auth } from "@/lib/auth";
import { findFlockById } from "@/lib/services/flocks";
import { findChickById, updateChick, deleteChick } from "@/lib/services/chicks";
import { NextResponse } from "next/server";

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

  if (!chick) {
    return NextResponse.json({ error: "Chick not found" }, { status: 404 });
  }

  if (chick.flockId !== flockId) {
    return NextResponse.json(
      { error: "Chick not in this flock" },
      { status: 404 }
    );
  }

  return NextResponse.json(chick);
}

export async function PATCH(
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

  if (!chick) {
    return NextResponse.json({ error: "Chick not found" }, { status: 404 });
  }

  if (chick.flockId !== flockId) {
    return NextResponse.json(
      { error: "Chick not in this flock" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { name, breed, hatchDate, description, photoUrl } = body;

  // Validate name if provided
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 }
      );
    }
    if (name.length > 50) {
      return NextResponse.json(
        { error: "Name must be 50 characters or less" },
        { status: 400 }
      );
    }
  }

  const updateData: {
    name?: string;
    breed?: string | null;
    hatchDate?: Date | null;
    description?: string | null;
    photoUrl?: string | null;
  } = {};

  if (name !== undefined) updateData.name = name.trim();
  if (breed !== undefined) updateData.breed = breed?.trim() || null;
  if (hatchDate !== undefined)
    updateData.hatchDate = hatchDate ? new Date(hatchDate) : null;
  if (description !== undefined)
    updateData.description = description?.trim() || null;
  if (photoUrl !== undefined) updateData.photoUrl = photoUrl || null;

  const updatedChick = await updateChick(chickId, updateData);
  return NextResponse.json(updatedChick);
}

export async function DELETE(
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

  if (!chick) {
    return NextResponse.json({ error: "Chick not found" }, { status: 404 });
  }

  if (chick.flockId !== flockId) {
    return NextResponse.json(
      { error: "Chick not in this flock" },
      { status: 404 }
    );
  }

  // Note: Photos will be cascade deleted from DB, but cloud storage cleanup
  // should be handled separately (in Phase 2 with storage setup)
  await deleteChick(chickId);

  return NextResponse.json({ success: true });
}
