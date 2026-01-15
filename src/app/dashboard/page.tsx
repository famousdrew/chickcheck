import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { findFlocksByUserId } from "@/lib/services/flocks";
import SignOutButton from "./SignOutButton";
import CreateFlockForm from "./CreateFlockForm";
import FlockHeader from "./FlockHeader";
import TaskList from "./TaskList";
import ChickGallery from "./ChickGallery";
import OfflineIndicator from "@/components/OfflineIndicator";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const flocks = await findFlocksByUserId(session.user.id);
  const activeFlock = flocks[0]; // For now, just use the first flock

  return (
    <div className="bg-cream min-h-screen">
      <OfflineIndicator />
      <header className="border-wood-dark/10 border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-wood-dark text-2xl font-bold">
            ChickCheck
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-wood-dark/70 text-sm">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8">
        {!activeFlock ? (
          <CreateFlockForm />
        ) : (
          <div className="space-y-6">
            <FlockHeader
              flock={{
                id: activeFlock.id,
                name: activeFlock.name,
                status: activeFlock.status,
                startDate: activeFlock.startDate?.toISOString() ?? null,
                currentWeek: activeFlock.currentWeek,
              }}
            />
            <TaskList flockId={activeFlock.id} />
            <ChickGallery flockId={activeFlock.id} />
          </div>
        )}
      </main>
    </div>
  );
}
