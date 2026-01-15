import { auth } from "@/lib/auth";
import { findFlockById } from "@/lib/services/flocks";
import {
  createChick,
  findChicksByFlockId,
  countChicksByFlockId,
} from "@/lib/services/chicks";
import { NextResponse } from "next/server";

const MAX_CHICKS_PER_FLOCK = 50;

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

  const chicks = await findChicksByFlockId(flockId);
  return NextResponse.json(chicks);
}

export async function POST(
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

  // Check chick limit
  const chickCount = await countChicksByFlockId(flockId);
  if (chickCount >= MAX_CHICKS_PER_FLOCK) {
    return NextResponse.json(
      { error: `Maximum of ${MAX_CHICKS_PER_FLOCK} chicks per flock` },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { name, breed, hatchDate, description } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (name.length > 50) {
    return NextResponse.json(
      { error: "Name must be 50 characters or less" },
      { status: 400 }
    );
  }

  const chick = await createChick({
    flockId,
    name: name.trim(),
    breed: breed?.trim() || undefined,
    hatchDate: hatchDate ? new Date(hatchDate) : undefined,
    description: description?.trim() || undefined,
  });

  return NextResponse.json(chick, { status: 201 });
}
