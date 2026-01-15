import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="bg-cream min-h-screen">
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

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-rustic shadow-rustic bg-white p-8">
          <h2 className="font-display text-wood-dark text-xl font-bold">
            Welcome to ChickCheck!
          </h2>
          <p className="text-wood-dark/70 mt-2">
            Your chick-raising journey starts here. Soon you&apos;ll be able to
            track your flock&apos;s progress through their first 8 weeks.
          </p>

          <div className="rounded-rustic bg-straw-400/20 mt-6 p-4">
            <p className="text-wood-dark text-sm">
              <strong>Coming soon:</strong> Create your first flock and start
              tracking daily tasks, weekly milestones, and more!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
