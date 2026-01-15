import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { taskSeedData } from "./seed-data";

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("🐥 Starting seed...");

  // Clear existing tasks
  console.log("Clearing existing tasks...");
  await prisma.task.deleteMany();

  // Insert all tasks
  console.log(`Inserting ${taskSeedData.length} tasks...`);
  await prisma.task.createMany({
    data: taskSeedData,
  });

  // Verify
  const taskCount = await prisma.task.count();
  console.log(`✅ Seeded ${taskCount} tasks`);

  // Show breakdown by week
  const weekBreakdown = await prisma.task.groupBy({
    by: ["weekNumber"],
    _count: true,
    orderBy: { weekNumber: "asc" },
  });

  console.log("\nTasks by week:");
  for (const week of weekBreakdown) {
    console.log(`  Week ${week.weekNumber}: ${week._count} tasks`);
  }

  await prisma.$disconnect();
  await pool.end();

  console.log("\n🎉 Seed complete!");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
