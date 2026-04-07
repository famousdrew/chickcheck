import { auth } from "@/lib/auth";
import {
  findFlockById,
  updateFlock,
  startFlock,
  deleteFlock,
} from "@/lib/services/flocks";
import { withErrorHandler } from "@/lib/api-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ flockId: string }> }
  ) => {
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
);

export const PATCH = withErrorHandler(
  async (
    request: Request,
    { params }: { params: Promise<{ flockId: string }> }
  ) => {
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

    // Only allow known fields to prevent mass assignment
    const { name, startDate, currentWeek, status } = body;

    if (name && typeof name === "string" && name.length > 100) {
      return NextResponse.json(
        { error: "Flock name must be 100 characters or less" },
        { status: 400 }
      );
    }

    const updated = await updateFlock(flockId, {
      name,
      startDate,
      currentWeek,
      status,
    });
    return NextResponse.json(updated);
  }
);

export const DELETE = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ flockId: string }> }
  ) => {
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
);
