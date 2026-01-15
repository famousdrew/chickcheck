import { auth } from "@/lib/auth";
import { findFlockById } from "@/lib/services/flocks";
import {
  findChickById,
  findChickNoteById,
  updateChickNote,
  deleteChickNote,
} from "@/lib/services/chicks";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ flockId: string; chickId: string; noteId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId, chickId, noteId } = await params;
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

  const note = await findChickNoteById(noteId);

  if (!note || note.chickId !== chickId) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const body = await request.json();
  const { content } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > 1000) {
    return NextResponse.json(
      { error: "Note must be 1000 characters or less" },
      { status: 400 }
    );
  }

  const updatedNote = await updateChickNote(noteId, {
    content: content.trim(),
  });

  return NextResponse.json(updatedNote);
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: { params: Promise<{ flockId: string; chickId: string; noteId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId, chickId, noteId } = await params;
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

  const note = await findChickNoteById(noteId);

  if (!note || note.chickId !== chickId) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await deleteChickNote(noteId);

  return NextResponse.json({ success: true });
}
