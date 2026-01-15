import { auth } from "@/lib/auth";
import { createFlock, findFlocksByUserId } from "@/lib/services/flocks";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const flocks = await findFlocksByUserId(session.user.id);
  return NextResponse.json(flocks);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, startDate } = body;

  const flock = await createFlock(
    session.user.id,
    name || "My Flock",
    startDate ? new Date(startDate) : undefined
  );

  return NextResponse.json(flock, { status: 201 });
}
