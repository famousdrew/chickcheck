# React & Next.js Style Guide

## Component Structure

### File Organization
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups for auth pages
│   ├── dashboard/         # Dashboard routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── features/          # Feature-specific components
│   └── layouts/           # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions, API clients
├── types/                 # TypeScript type definitions
└── styles/                # Global styles, Tailwind config
```

### Component File Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Chick } from '@/types';

// 2. Types (if not imported)
interface ChickCardProps {
  chick: Chick;
  onSelect?: (chick: Chick) => void;
}

// 3. Component
export function ChickCard({ chick, onSelect }: ChickCardProps) {
  // Hooks first
  const [isExpanded, setIsExpanded] = useState(false);

  // Derived state
  const displayName = chick.nickname ?? chick.name;

  // Event handlers
  const handleClick = () => {
    onSelect?.(chick);
  };

  // Render
  return (
    <div onClick={handleClick}>
      {/* ... */}
    </div>
  );
}
```

## Component Patterns

### Prefer Function Components
```typescript
// Good - function component with explicit return type
export function TaskList({ tasks }: TaskListProps): JSX.Element {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

// Avoid - class components (unless needed for error boundaries)
```

### Use Named Exports
```typescript
// Good - named exports for better refactoring support
export function ChickCard() {}
export function ChickList() {}

// Avoid - default exports (except for pages)
export default function ChickCard() {} // Only for page.tsx, layout.tsx
```

### Props Interface Naming
```typescript
// Name props interface after component + "Props"
interface ChickCardProps {
  chick: Chick;
  variant?: 'compact' | 'full';
}

export function ChickCard({ chick, variant = 'full' }: ChickCardProps) {}
```

## Next.js App Router

### Server vs Client Components
```typescript
// Server Component (default) - for data fetching, no interactivity
// app/dashboard/page.tsx
import { getChicks } from '@/lib/chicks';

export default async function DashboardPage() {
  const chicks = await getChicks();
  return <ChickList chicks={chicks} />;
}

// Client Component - for interactivity, hooks, browser APIs
// components/features/ChickCard.tsx
'use client';

import { useState } from 'react';

export function ChickCard({ chick }: ChickCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  // ...
}
```

### Data Fetching
```typescript
// Server Component data fetching
export default async function ChickPage({ params }: { params: { id: string } }) {
  const chick = await prisma.chick.findUnique({
    where: { id: params.id },
  });

  if (!chick) {
    notFound();
  }

  return <ChickProfile chick={chick} />;
}

// Use loading.tsx for Suspense boundaries
// app/dashboard/loading.tsx
export default function Loading() {
  return <ChickListSkeleton />;
}
```

### Server Actions
```typescript
// lib/actions/chicks.ts
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createChick(formData: FormData) {
  const name = formData.get('name') as string;

  await prisma.chick.create({
    data: { name },
  });

  revalidatePath('/dashboard');
}
```

## Hooks

### Custom Hook Naming
```typescript
// Prefix with "use"
function useChick(id: string) {}
function useTaskCompletion() {}
function useLocalStorage<T>(key: string) {}
```

### Hook Organization
```typescript
export function useChick(id: string) {
  // 1. Other hooks
  const [chick, setChick] = useState<Chick | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 2. Effects
  useEffect(() => {
    fetchChick(id)
      .then(setChick)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  // 3. Callbacks (memoized if passed to children)
  const refresh = useCallback(() => {
    setIsLoading(true);
    fetchChick(id).then(setChick).finally(() => setIsLoading(false));
  }, [id]);

  // 4. Return object
  return { chick, isLoading, error, refresh };
}
```

## State Management

### Local State First
```typescript
// Prefer local state for component-specific data
function TaskItem({ task }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // ...
}
```

### Lift State When Needed
```typescript
// Lift state to common ancestor when sharing between siblings
function TaskList() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <>
      <TaskSidebar
        selectedId={selectedTaskId}
        onSelect={setSelectedTaskId}
      />
      <TaskDetail taskId={selectedTaskId} />
    </>
  );
}
```

### Context for Global State
```typescript
// contexts/FlockContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface FlockContextValue {
  flock: Flock | null;
  setFlock: (flock: Flock) => void;
}

const FlockContext = createContext<FlockContextValue | null>(null);

export function FlockProvider({ children }: { children: React.ReactNode }) {
  const [flock, setFlock] = useState<Flock | null>(null);
  return (
    <FlockContext.Provider value={{ flock, setFlock }}>
      {children}
    </FlockContext.Provider>
  );
}

export function useFlock() {
  const context = useContext(FlockContext);
  if (!context) {
    throw new Error('useFlock must be used within FlockProvider');
  }
  return context;
}
```

## Event Handlers

### Naming Convention
```typescript
// Prefix with "handle" for internal handlers
function ChickCard({ onSelect }: ChickCardProps) {
  const handleClick = () => {
    onSelect?.(chick);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSelect?.(chick);
    }
  };

  return <div onClick={handleClick} onKeyDown={handleKeyDown} />;
}

// Prefix with "on" for props
interface ChickCardProps {
  onSelect?: (chick: Chick) => void;
  onDelete?: (chickId: string) => void;
}
```

## Conditional Rendering

### Prefer Early Returns
```typescript
function ChickProfile({ chick }: { chick: Chick | null }) {
  if (!chick) {
    return <EmptyState message="No chick selected" />;
  }

  return (
    <div>
      <h1>{chick.name}</h1>
      {/* ... */}
    </div>
  );
}
```

### Use Logical AND for Simple Conditions
```typescript
function TaskItem({ task }: TaskItemProps) {
  return (
    <div>
      <span>{task.title}</span>
      {task.isCompleted && <CheckIcon />}
      {task.notes && <p>{task.notes}</p>}
    </div>
  );
}
```

## Accessibility

### Semantic HTML
```typescript
// Use semantic elements
<nav>...</nav>
<main>...</main>
<article>...</article>
<button onClick={...}>Click me</button>  // Not <div onClick={...}>

// Add ARIA labels where needed
<button aria-label="Close dialog">
  <XIcon />
</button>
```

### Keyboard Navigation
```typescript
// Ensure interactive elements are keyboard accessible
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Interactive content
</div>
```
