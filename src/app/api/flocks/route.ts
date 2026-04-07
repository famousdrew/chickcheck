import { auth } from "@/lib/auth";
import { createFlock, findFlocksByUserId } from "@/lib/services/flocks";
import { withErrorHandler } from "@/lib/api-handler";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const flocks = await findFlocksByUserId(session.user.id);
  return NextResponse.json(flocks);
});

export const POST = withErrorHandler(async (request: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, startDate } = body;

  if (name && typeof name === "string" && name.length > 100) {
    return NextResponse.json(
      { error: "Flock name must be 100 characters or less" },
      { status: 400 }
    );
  }

  const flock = await createFlock(
    session.user.id,
    name || "My Flock",
    startDate ? new Date(startDate) : undefined
  );

  return NextResponse.json(flock, { status: 201 });
});
