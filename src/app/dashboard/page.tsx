import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  findFlocksByUserId,
  getEffectiveCurrentWeek,
} from "@/lib/services/flocks";
import DashboardContent from "./DashboardContent";
import OfflineIndicator from "@/components/OfflineIndicator";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const flocks = await findFlocksByUserId(session.user.id);

  const flocksData = flocks.map((f) => ({
    id: f.id,
    name: f.name,
    status: f.status,
    startDate: f.startDate?.toISOString() ?? null,
    currentWeek: getEffectiveCurrentWeek(f),
  }));

  return (
    <div className="bg-cream min-h-screen">
      <OfflineIndicator />
      <DashboardContent flocks={flocksData} email={session.user.email ?? ""} />
    </div>
  );
}
