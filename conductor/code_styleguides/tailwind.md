# Tailwind CSS Style Guide

## Configuration

### Custom Theme (tailwind.config.js)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Rustic farmhouse palette
        barn: {
          50: '#fdf8f6',
          100: '#f9ede8',
          200: '#f3d9cf',
          300: '#e9bfad',
          400: '#db9a7f',
          500: '#c97856',  // Primary barn red
          600: '#b85f3d',
          700: '#9a4d32',
          800: '#7f412d',
          900: '#6a3829',
        },
        straw: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',  // Primary straw yellow
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        grass: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#5D8A48',  // Primary grass green
          600: '#4a7039',
          700: '#3d5c2f',
          800: '#345028',
          900: '#2d4423',
        },
        cream: '#FFFBF5',
        wood: {
          light: '#D4A574',
          DEFAULT: '#8B7355',
          dark: '#5C4A3A',
        },
      },
      fontFamily: {
        display: ['Merriweather', 'serif'],  // Headings
        body: ['Inter', 'sans-serif'],       // Body text
        hand: ['Caveat', 'cursive'],         // Handwritten accents
      },
      borderRadius: {
        'rustic': '0.5rem',
      },
      boxShadow: {
        'rustic': '0 4px 6px -1px rgba(139, 115, 85, 0.1), 0 2px 4px -1px rgba(139, 115, 85, 0.06)',
      },
    },
  },
};
```

## Class Organization

### Recommended Order
Follow a consistent order for Tailwind classes:

1. Layout (display, position, grid/flex)
2. Sizing (width, height, padding, margin)
3. Typography (font, text)
4. Visual (background, border, shadow)
5. Interactive (hover, focus, transition)

```typescript
// Good - organized class order
<div className="
  flex flex-col items-center
  w-full max-w-md p-6 mx-auto
  text-lg font-medium text-barn-800
  bg-cream rounded-rustic shadow-rustic
  hover:shadow-lg transition-shadow
">

// Avoid - random order
<div className="hover:shadow-lg text-lg p-6 flex bg-cream w-full shadow-rustic">
```

### Use Prettier Plugin
Install `prettier-plugin-tailwindcss` to auto-sort classes.

## Component Patterns

### Base + Variant Pattern
```typescript
// Define base styles and variants
const buttonBase = "inline-flex items-center justify-center rounded-rustic font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-barn-500 focus:ring-offset-2";

const buttonVariants = {
  primary: "bg-barn-500 text-white hover:bg-barn-600",
  secondary: "bg-straw-100 text-barn-800 hover:bg-straw-200",
  ghost: "hover:bg-barn-50 text-barn-600",
};

const buttonSizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

interface ButtonProps {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}
```

### Use clsx/cn for Conditional Classes
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  "p-4 rounded-rustic",
  isCompleted && "bg-grass-50 border-grass-500",
  !isCompleted && "bg-cream border-barn-200",
  className
)}>
```

## Responsive Design

### Mobile-First Approach
```typescript
// Start with mobile, add breakpoints for larger screens
<div className="
  flex flex-col        // Mobile: stack vertically
  md:flex-row          // Tablet+: horizontal
  lg:gap-8             // Desktop: more spacing
">
  <aside className="
    w-full             // Mobile: full width
    md:w-64            // Tablet+: fixed sidebar
    lg:w-80            // Desktop: wider sidebar
  ">
  </aside>
</div>
```

### Breakpoint Reference
- `sm`: 640px (large phones)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large screens)

## Spacing & Layout

### Consistent Spacing Scale
```typescript
// Use Tailwind's spacing scale consistently
// 4 = 1rem = 16px base unit

<div className="p-4">        // Standard padding
<div className="p-6">        // More breathing room
<div className="space-y-4">  // Consistent vertical rhythm
<div className="gap-4">      // Grid/flex gaps
```

### Container Pattern
```typescript
// Consistent page container
<main className="container mx-auto px-4 py-8 max-w-4xl">
  {children}
</main>

// Card container
<div className="bg-cream rounded-rustic shadow-rustic p-6">
  {children}
</div>
```

## Typography

### Heading Hierarchy
```typescript
// Consistent heading styles
<h1 className="font-display text-3xl md:text-4xl font-bold text-barn-800">
  Welcome, Chicken Keeper!
</h1>

<h2 className="font-display text-2xl font-semibold text-barn-700">
  Week 1: Getting Started
</h2>

<h3 className="font-display text-xl font-medium text-barn-600">
  Daily Tasks
</h3>
```

### Body Text
```typescript
// Standard body text
<p className="font-body text-base text-barn-700 leading-relaxed">
  Your chicks are settling in nicely!
</p>

// Secondary/muted text
<p className="text-sm text-barn-500">
  Last updated 2 hours ago
</p>

// Handwritten accent
<span className="font-hand text-xl text-grass-600">
  Nugget
</span>
```

## Interactive States

### Hover, Focus, Active
```typescript
<button className="
  bg-barn-500 text-white
  hover:bg-barn-600           // Hover state
  focus:outline-none          // Remove default outline
  focus:ring-2                // Custom focus ring
  focus:ring-barn-500
  focus:ring-offset-2
  active:bg-barn-700          // Active/pressed state
  disabled:opacity-50         // Disabled state
  disabled:cursor-not-allowed
  transition-colors           // Smooth transitions
">
```

### Transitions
```typescript
// Standard transition
<div className="transition-colors duration-200">

// Multiple properties
<div className="transition-all duration-300 ease-in-out">

// Transform transitions
<div className="transform hover:scale-105 transition-transform">
```

## Dark Mode (Future)

### Prepare for Dark Mode
```typescript
// Use semantic color names that can be themed
<div className="bg-cream dark:bg-barn-900">
<p className="text-barn-800 dark:text-barn-100">

// Or use CSS variables in tailwind.config.js
colors: {
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
}
```

## Avoiding Common Mistakes

### Don't Mix Arbitrary Values Unnecessarily
```typescript
// Avoid - arbitrary values when scale exists
<div className="p-[17px] text-[15px]">

// Good - use scale values
<div className="p-4 text-sm">
```

### Don't Repeat Utility Groups
```typescript
// Avoid - conflicting utilities
<div className="p-4 p-6">  // Which padding?

// Good - single source of truth
<div className="p-6">
```

### Extract Repeated Patterns
```typescript
// If you repeat the same classes 3+ times, extract to component
// Avoid
<div className="bg-cream rounded-rustic shadow-rustic p-4">Card 1</div>
<div className="bg-cream rounded-rustic shadow-rustic p-4">Card 2</div>
<div className="bg-cream rounded-rustic shadow-rustic p-4">Card 3</div>

// Good - extract to component
function Card({ children }) {
  return (
    <div className="bg-cream rounded-rustic shadow-rustic p-4">
      {children}
    </div>
  );
}
```
