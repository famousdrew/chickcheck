import { auth } from "@/lib/auth";
import {
  findFlockById,
  updateFlock,
  startFlock,
  deleteFlock,
} from "@/lib/services/flocks";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ flockId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId } = await params;
  const flock = await findFlockById(flockId);

  if (!flock) {
    return NextResponse.json({ error: "Flock not found" }, { status: 404 });
  }

  if (flock.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(flock);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ flockId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId } = await params;
  const flock = await findFlockById(flockId);

  if (!flock) {
    return NextResponse.json({ error: "Flock not found" }, { status: 404 });
  }

  if (flock.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  if (body.action === "start") {
    const updated = await startFlock(flockId, new Date());
    return NextResponse.json(updated);
  }

  const updated = await updateFlock(flockId, body);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ flockId: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { flockId } = await params;
  const flock = await findFlockById(flockId);

  if (!flock) {
    return NextResponse.json({ error: "Flock not found" }, { status: 404 });
  }

  if (flock.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteFlock(flockId);
  return NextResponse.json({ success: true });
}
