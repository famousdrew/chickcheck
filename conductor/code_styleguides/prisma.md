# Prisma Style Guide

## Schema Organization

### File Structure
```prisma
// prisma/schema.prisma

// 1. Generator and datasource config
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 2. Core domain models (User, Flock, Chick)
// 3. Feature models (Task, Achievement)
// 4. Junction/relation tables
```

### Model Naming
```prisma
// Use PascalCase singular for model names
model User {}        // Not: Users, user
model Chick {}       // Not: Chicks, chick
model TaskCompletion {}  // Not: task_completions

// Use camelCase for fields
model Chick {
  id          String   @id
  name        String
  hatchDate   DateTime  // Not: hatch_date
  createdAt   DateTime
}
```

## Model Structure

### Standard Model Pattern
```prisma
model Chick {
  // 1. Primary key first
  id        String   @id @default(cuid())

  // 2. Required fields
  name      String
  hatchDate DateTime

  // 3. Optional fields
  nickname  String?
  notes     String?
  photoUrl  String?

  // 4. JSON fields for flexible data
  personality Json?    // { traits: [], observations: [] }

  // 5. Foreign keys
  flockId   String

  // 6. Relations
  flock     Flock     @relation(fields: [flockId], references: [id], onDelete: Cascade)
  photos    Photo[]

  // 7. Timestamps last
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // 8. Indexes
  @@index([flockId])
}
```

### ID Strategy
```prisma
// Use cuid() for primary keys (URL-safe, sortable)
id String @id @default(cuid())

// Use uuid() when needed for external systems
externalId String @default(uuid())

// Use autoincrement only for internal sequences
weekNumber Int @default(autoincrement())
```

## Relationships

### One-to-Many
```prisma
model Flock {
  id     String  @id @default(cuid())
  name   String
  chicks Chick[]  // One flock has many chicks
}

model Chick {
  id      String @id @default(cuid())
  flockId String
  flock   Flock  @relation(fields: [flockId], references: [id], onDelete: Cascade)

  @@index([flockId])
}
```

### Many-to-Many
```prisma
// Explicit junction table for additional fields
model TaskCompletion {
  id          String   @id @default(cuid())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  completedAt DateTime @default(now())
  notes       String?
  skipped     Boolean  @default(false)

  @@unique([userId, taskId])
  @@index([userId])
  @@index([taskId])
}
```

### Self-Relations
```prisma
// For hierarchical data like task dependencies
model Task {
  id           String  @id @default(cuid())
  title        String

  parentId     String?
  parent       Task?   @relation("TaskHierarchy", fields: [parentId], references: [id])
  subtasks     Task[]  @relation("TaskHierarchy")
}
```

## Enums

### Define Domain Enums
```prisma
enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  SKIPPED
}

enum TaskFrequency {
  DAILY
  WEEKLY
  ONCE
}

enum AchievementType {
  WEEK_COMPLETE
  STREAK
  MILESTONE
  SPECIAL
}

model Task {
  id        String        @id @default(cuid())
  status    TaskStatus    @default(PENDING)
  frequency TaskFrequency
}
```

## Indexes

### When to Add Indexes
```prisma
model Task {
  id         String   @id @default(cuid())
  weekNumber Int
  dayNumber  Int?
  flockId    String
  status     TaskStatus

  // Index foreign keys
  @@index([flockId])

  // Index frequently queried fields
  @@index([weekNumber])
  @@index([status])

  // Composite index for common query patterns
  @@index([flockId, weekNumber])
  @@index([flockId, status])
}
```

## Query Patterns

### Basic CRUD
```typescript
// Create
const chick = await prisma.chick.create({
  data: {
    name: 'Nugget',
    hatchDate: new Date(),
    flockId: flock.id,
  },
});

// Read with relations
const chick = await prisma.chick.findUnique({
  where: { id: chickId },
  include: {
    flock: true,
    photos: {
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
});

// Update
const chick = await prisma.chick.update({
  where: { id: chickId },
  data: { nickname: 'Nuggy' },
});

// Delete
await prisma.chick.delete({
  where: { id: chickId },
});
```

### Select Only What You Need
```typescript
// Good - select specific fields
const chicks = await prisma.chick.findMany({
  where: { flockId },
  select: {
    id: true,
    name: true,
    nickname: true,
    photoUrl: true,
  },
});

// Avoid - fetching everything when you need little
const chicks = await prisma.chick.findMany({
  where: { flockId },
  include: { photos: true, flock: true },  // Only if needed!
});
```

### Pagination
```typescript
// Cursor-based pagination (recommended)
const chicks = await prisma.chick.findMany({
  take: 10,
  skip: 1,  // Skip the cursor
  cursor: { id: lastChickId },
  orderBy: { createdAt: 'desc' },
});

// Offset pagination (simpler, less performant at scale)
const chicks = await prisma.chick.findMany({
  take: 10,
  skip: page * 10,
  orderBy: { createdAt: 'desc' },
});
```

### Transactions
```typescript
// Use transactions for related operations
const [flock, tasks] = await prisma.$transaction([
  prisma.flock.create({
    data: { name: 'Spring 2024 Batch', userId },
  }),
  prisma.task.createMany({
    data: getWeekOneTasks(flockId),
  }),
]);

// Interactive transactions for complex logic
await prisma.$transaction(async (tx) => {
  const completion = await tx.taskCompletion.create({
    data: { userId, taskId },
  });

  // Check if this completes a week
  const weekTasks = await tx.taskCompletion.count({
    where: { userId, task: { weekNumber: task.weekNumber } },
  });

  if (weekTasks === totalWeekTasks) {
    await tx.achievement.create({
      data: { userId, type: 'WEEK_COMPLETE', weekNumber: task.weekNumber },
    });
  }
});
```

## Migrations

### Migration Naming
```bash
# Use descriptive names
npx prisma migrate dev --name add_chick_personality_field
npx prisma migrate dev --name create_achievements_table
npx prisma migrate dev --name add_flock_status_index
```

### Safe Migration Practices
```prisma
// Adding nullable field (safe)
model Chick {
  nickname String?  // New optional field
}

// Adding required field with default (safe)
model Chick {
  status ChickStatus @default(HEALTHY)
}

// Renaming field (requires data migration)
// 1. Add new field
// 2. Migrate data
// 3. Remove old field
```

## Error Handling

### Handle Known Errors
```typescript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

try {
  await prisma.chick.create({ data });
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      throw new Error('A chick with this name already exists');
    }
    // Foreign key constraint
    if (error.code === 'P2003') {
      throw new Error('Invalid flock ID');
    }
    // Record not found
    if (error.code === 'P2025') {
      throw new Error('Chick not found');
    }
  }
  throw error;
}
```

## Database Client

### Singleton Pattern
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Logging in Development
```typescript
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
});
```
