# Technology Stack

## Overview
ChickCheck is built as a Progressive Web App (PWA) using a modern, Railway-native stack. This architecture prioritizes simplicity, maintainability, and keeping all infrastructure on a single platform.

## Frontend

### Framework: Next.js (React)
- **Version:** Latest stable (15.x)
- **Rationale:** Industry-standard React framework with excellent PWA support, server-side rendering for SEO, and seamless Railway deployment
- **Key Features Used:**
  - App Router for file-based routing
  - Server Components for improved performance
  - API Routes for backend endpoints
  - next-pwa for Progressive Web App functionality

### Styling: Tailwind CSS
- **Version:** Latest stable (3.x)
- **Rationale:** Utility-first CSS framework ideal for implementing custom design systems
- **Configuration:**
  - Custom color palette matching rustic farmhouse theme
  - Custom typography scale
  - Component-friendly with @apply directives where needed

### PWA Features
- **Service Worker:** Workbox via next-pwa
- **Offline Support:** Cache task data and educational content for offline access
- **Push Notifications:** Web Push API for task reminders
- **Install Prompt:** Custom install banner for mobile users

## Backend

### Runtime: Node.js
- **Version:** LTS (20.x or later)
- **Rationale:** Native Next.js runtime, excellent ecosystem support

### API Layer: Next.js API Routes
- RESTful endpoints for CRUD operations
- Server Actions for form submissions
- Middleware for authentication checks

## Database

### Database: PostgreSQL
- **Hosting:** Railway managed PostgreSQL
- **Rationale:** Robust relational database, excellent for structured data like tasks, chicks, and user progress
- **Features Used:**
  - JSONB columns for flexible data (task metadata, chick personality notes)
  - Timestamps for tracking progress over time
  - Foreign key relationships for data integrity

### ORM: Prisma
- **Version:** Latest stable (5.x)
- **Rationale:** Type-safe database access, excellent developer experience, auto-generated migrations
- **Features Used:**
  - Prisma Client for type-safe queries
  - Prisma Migrate for schema management
  - Prisma Studio for development debugging

## Authentication

### Auth Solution: NextAuth.js (Auth.js)
- **Version:** Latest stable (5.x)
- **Rationale:** Native Next.js integration, flexible provider support, session management
- **Providers (MVP):**
  - Email/Password (Credentials provider)
  - Google OAuth (optional, for easy onboarding)
- **Session Strategy:** JWT stored in HTTP-only cookies

## File Storage

### Storage: Railway Volumes
- **Use Case:** User-uploaded chick photos
- **Rationale:** Keeps infrastructure on single platform, simple billing
- **Implementation:**
  - Volume mounted to Next.js app
  - Custom API routes for upload/retrieval
  - Image processing via Sharp for optimization/thumbnails

## Infrastructure

### Hosting: Railway
- **Services:**
  - Next.js application (web service)
  - PostgreSQL database (managed database)
  - Volume storage (persistent storage)
- **Rationale:** Simple deployment, integrated services, predictable pricing, excellent Next.js support
- **Features Used:**
  - Automatic deployments from Git
  - Environment variable management
  - Built-in SSL/HTTPS

### Domain & DNS
- Railway-provided subdomain for MVP
- Custom domain support when ready

## Development Tools

### Package Manager: npm or pnpm
- pnpm recommended for faster installs and disk efficiency

### Type Checking: TypeScript
- Strict mode enabled
- End-to-end type safety from database to UI

### Code Quality
- **ESLint:** Next.js default config + custom rules
- **Prettier:** Consistent code formatting
- **Husky:** Pre-commit hooks for linting

### Testing
- **Unit Tests:** Vitest or Jest
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright (optional for MVP)

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "next-pwa": "^5.x",
    "@prisma/client": "^5.x",
    "next-auth": "^5.x",
    "tailwindcss": "^3.x",
    "sharp": "^0.33.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "typescript": "^5.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Railway                             │
│  ┌─────────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │   Next.js App   │  │ PostgreSQL│  │Railway Volume │  │
│  │  (PWA + API)    │◄─┤ Database  │  │ (Photo Store) │  │
│  │                 │  └──────────┘  └───────────────┘  │
│  │  - App Router   │        ▲              ▲           │
│  │  - API Routes   │        │              │           │
│  │  - NextAuth.js  │────────┴──────────────┘           │
│  │  - Prisma       │                                   │
│  └────────┬────────┘                                   │
└───────────┼─────────────────────────────────────────────┘
            │
            ▼
    ┌───────────────┐
    │  PWA Client   │
    │  (Browser)    │
    │               │
    │ - Offline     │
    │ - Push Notify │
    │ - Installable │
    └───────────────┘
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://chickcheck.up.railway.app"

# Optional OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Storage
UPLOAD_DIR="/app/uploads"
```
