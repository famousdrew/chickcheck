import { auth } from "@/lib/auth";
import { findFlockById } from "@/lib/services/flocks";
import {
  findChickById,
  createChickNote,
  findNotesByChickId,
  countNotesByChickId,
} from "@/lib/services/chicks";
import { NextResponse } from "next/server";

const MAX_NOTES_PER_CHICK = 50;

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

  const notes = await findNotesByChickId(chickId);
  return NextResponse.json(notes);
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

  // Check note limit
  const noteCount = await countNotesByChickId(chickId);
  if (noteCount >= MAX_NOTES_PER_CHICK) {
    return NextResponse.json(
      { error: `Maximum of ${MAX_NOTES_PER_CHICK} notes per chick` },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { content, weekNumber } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > 1000) {
    return NextResponse.json(
      { error: "Note must be 1000 characters or less" },
      { status: 400 }
    );
  }

  const note = await createChickNote({
    chickId,
    content: content.trim(),
    weekNumber: weekNumber ?? undefined,
  });

  return NextResponse.json(note, { status: 201 });
}
