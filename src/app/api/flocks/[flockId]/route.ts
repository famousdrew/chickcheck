import { FlockStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import {
  findFlockById,
  updateFlock,
  startFlock,
  deleteFlock,
} from "@/lib/services/flocks";
import { findPhotoUrlsByFlockId } from "@/lib/services/chicks";
import { deleteChickPhotos } from "@/lib/utils/storage";
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
      if (flock.status !== FlockStatus.PREPARING) {
        return NextResponse.json(
          { error: "Flock has already started" },
          { status: 400 }
        );
      }
      const updated = await startFlock(flockId, new Date());
      return NextResponse.json(updated);
    }

    const result = parseFlockUpdate(body, flock.status);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const updated = await updateFlock(flockId, result.data);
    return NextResponse.json(updated);
  }
);

// Status changes allowed via PATCH. PREPARING -> ACTIVE goes through the
// "start" action so startDate is set at the same time.
const ALLOWED_STATUS_TRANSITIONS: Record<FlockStatus, FlockStatus[]> = {
  PREPARING: [],
  ACTIVE: [FlockStatus.GRADUATED],
  GRADUATED: [FlockStatus.ACTIVE],
};

/**
 * Validates a PATCH body. Only name, startDate and status can be changed;
 * currentWeek is derived from startDate and is not writable.
 */
function parseFlockUpdate(
  body: Record<string, unknown>,
  currentStatus: FlockStatus
):
  | { data: { name?: string; startDate?: Date; status?: FlockStatus } }
  | { error: string } {
  const data: { name?: string; startDate?: Date; status?: FlockStatus } = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      return { error: "Flock name cannot be empty" };
    }
    if (body.name.trim().length > 100) {
      return { error: "Flock name must be 100 characters or less" };
    }
    data.name = body.name.trim();
  }

  if (body.startDate !== undefined) {
    if (currentStatus === FlockStatus.PREPARING) {
      return { error: "Start the flock before changing its start date" };
    }
    const startDate =
      typeof body.startDate === "string" ? new Date(body.startDate) : null;
    if (!startDate || isNaN(startDate.getTime())) {
      return { error: "startDate must be a valid date" };
    }
    if (startDate.getTime() > Date.now()) {
      return { error: "startDate cannot be in the future" };
    }
    data.startDate = startDate;
  }

  if (body.status !== undefined && body.status !== currentStatus) {
    const status = body.status as FlockStatus;
    if (!ALLOWED_STATUS_TRANSITIONS[currentStatus].includes(status)) {
      return {
        error: `Cannot change flock status from ${currentStatus} to ${String(body.status)}`,
      };
    }
    data.status = status;
  }

  if (Object.keys(data).length === 0 && body.status === undefined) {
    return { error: "No valid fields to update" };
  }

  return { data };
}

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

    // Collect photo URLs before the cascade delete removes the records
    const photoUrls = await findPhotoUrlsByFlockId(flockId);

    await deleteFlock(flockId);

    // Clean up cloud storage (non-blocking, errors are logged but don't fail the request)
    if (photoUrls.length > 0) {
      deleteChickPhotos(photoUrls).catch((err) => {
        console.error("Failed to clean up cloud storage:", err);
      });
    }

    return NextResponse.json({ success: true });
  }
);
