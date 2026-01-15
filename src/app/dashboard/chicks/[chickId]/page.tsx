import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { findFlocksByUserId } from "@/lib/services/flocks";
import { findChickById } from "@/lib/services/chicks";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ChickProfilePageProps {
  params: Promise<{ chickId: string }>;
}

export default async function ChickProfilePage({
  params,
}: ChickProfilePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { chickId } = await params;
  const chick = await findChickById(chickId);

  if (!chick) {
    notFound();
  }

  // Verify user owns the flock this chick belongs to
  const flocks = await findFlocksByUserId(session.user.id);
  const ownsChick = flocks.some((f) => f.id === chick.flockId);

  if (!ownsChick) {
    notFound();
  }

  return (
    <div className="bg-cream min-h-screen">
      <header className="border-wood-dark/10 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4">
          <Link
            href="/dashboard"
            className="text-wood-dark/60 hover:text-wood-dark transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="font-display text-wood-dark text-2xl font-bold">
            {chick.name}
          </h1>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-rustic shadow-rustic bg-white p-6">
          <div className="text-center">
            <h2 className="font-display text-wood-dark text-xl font-bold">
              {chick.name}
            </h2>
            {chick.breed && (
              <p className="text-wood-dark/60 mt-1">{chick.breed}</p>
            )}
            {chick.description && (
              <p className="text-wood-dark/70 mt-4">{chick.description}</p>
            )}
            <p className="text-wood-dark/50 mt-8 text-sm">
              Photo upload and timeline coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
