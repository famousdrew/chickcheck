# TypeScript Style Guide

## General Principles

- **Strict mode enabled** - All TypeScript strict flags should be on
- **Explicit over implicit** - Prefer explicit types for function parameters and return values
- **Type safety first** - Avoid `any`; use `unknown` when type is truly unknown

## Naming Conventions

### Variables & Functions
- Use `camelCase` for variables and functions
- Use descriptive names that indicate purpose
- Boolean variables should start with `is`, `has`, `can`, `should`

```typescript
// Good
const isLoading = true;
const hasCompletedTask = false;
const chickCount = 6;
function calculateProgress(completedTasks: number): number {}

// Avoid
const loading = true;
const flag = false;
const x = 6;
function calc(n: number): number {}
```

### Types & Interfaces
- Use `PascalCase` for types, interfaces, and enums
- Prefix interfaces with `I` only when necessary to distinguish from classes
- Use `type` for unions, intersections, and simple aliases
- Use `interface` for object shapes that may be extended

```typescript
// Types
type TaskStatus = 'pending' | 'completed' | 'skipped';
type ChickId = string;

// Interfaces
interface Chick {
  id: ChickId;
  name: string;
  hatchDate: Date;
  photos: Photo[];
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  weekNumber: number;
  dayNumber?: number;
}
```

### Constants & Enums
- Use `SCREAMING_SNAKE_CASE` for true constants
- Use `PascalCase` for enum names, `PascalCase` for enum values

```typescript
const MAX_CHICKS_PER_FLOCK = 25;
const DEFAULT_TEMPERATURE_WEEK_1 = 95;

enum WeekMilestone {
  FirstFeathers = 'FIRST_FEATHERS',
  FirstPerch = 'FIRST_PERCH',
  OutdoorIntro = 'OUTDOOR_INTRO',
  CoopGraduate = 'COOP_GRADUATE',
}
```

## Type Definitions

### Prefer Type Inference Where Clear
```typescript
// Let TypeScript infer when obvious
const name = 'Nugget'; // string inferred
const tasks = [task1, task2]; // Task[] inferred if task1/task2 are typed

// Explicitly type when not obvious or for documentation
const config: AppConfig = loadConfig();
function getChick(id: string): Promise<Chick | null> {}
```

### Use Utility Types
```typescript
// Partial for optional updates
function updateChick(id: string, updates: Partial<Chick>): Promise<Chick> {}

// Pick/Omit for derived types
type ChickSummary = Pick<Chick, 'id' | 'name' | 'hatchDate'>;
type ChickInput = Omit<Chick, 'id' | 'createdAt'>;

// Record for dictionaries
type TasksByWeek = Record<number, Task[]>;
```

### Avoid `any`
```typescript
// Bad
function processData(data: any) {}

// Good - use unknown and narrow
function processData(data: unknown) {
  if (isChick(data)) {
    // data is now typed as Chick
  }
}

// Good - use generics
function processData<T>(data: T): T {}
```

## Functions

### Parameter and Return Types
```typescript
// Always type parameters; type returns for public APIs
function calculateTemperature(weekNumber: number): number {
  return 95 - (weekNumber - 1) * 5;
}

// Use object params for 3+ parameters
function createTask({
  title,
  weekNumber,
  dayNumber,
  description,
}: {
  title: string;
  weekNumber: number;
  dayNumber?: number;
  description?: string;
}): Task {}
```

### Async Functions
```typescript
// Always return Promise<T> explicitly for async functions
async function fetchChick(id: string): Promise<Chick | null> {
  // ...
}

// Handle errors appropriately
async function saveChick(chick: Chick): Promise<Chick> {
  try {
    return await db.chick.create({ data: chick });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new ValidationError('Failed to save chick');
    }
    throw error;
  }
}
```

## Null Handling

### Prefer `null` over `undefined` for intentional absence
```typescript
// Use null for "no value"
function findChick(id: string): Chick | null {}

// Use undefined for optional properties
interface Task {
  id: string;
  notes?: string; // may or may not exist
}
```

### Use Optional Chaining and Nullish Coalescing
```typescript
// Optional chaining
const chickName = flock?.chicks?.[0]?.name;

// Nullish coalescing (prefer over ||)
const displayName = chick.nickname ?? chick.name ?? 'Unnamed Chick';
```

## Imports & Exports

### Organize Imports
```typescript
// 1. External packages
import { useState, useEffect } from 'react';
import { prisma } from '@prisma/client';

// 2. Internal aliases (@/)
import { Button } from '@/components/ui/Button';
import { useChick } from '@/hooks/useChick';

// 3. Relative imports
import { formatDate } from './utils';
import type { ChickFormData } from './types';
```

### Use Type-Only Imports
```typescript
// When importing only types
import type { Chick, Task } from '@/types';

// Mixed imports
import { createChick, type ChickInput } from '@/lib/chicks';
```

## Error Handling

### Use Custom Error Classes
```typescript
class ChickNotFoundError extends Error {
  constructor(chickId: string) {
    super(`Chick not found: ${chickId}`);
    this.name = 'ChickNotFoundError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Type Guard Functions
```typescript
function isChick(value: unknown): value is Chick {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'hatchDate' in value
  );
}
```
