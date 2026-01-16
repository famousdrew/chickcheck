# ChickCheck - Project Context

ChickCheck is a Progressive Web App (PWA) for tracking baby chick care during the first 8 weeks of raising. Built with Next.js 16, deployed on Railway.

## Quick Reference

- **Database**: PostgreSQL on Railway (use `railway variables` to get DATABASE_URL)
- **Image Storage**: Vercel Blob (BLOB_READ_WRITE_TOKEN in .env)
- **Timezone**: App uses Pacific Time (PST/PDT) for task completions - see `src/lib/utils/timezone.ts`
- **User**: Drew is in PST timezone

## Key Features Implemented

1. **Task Management System** (MVP)
   - Week 0-8 task schedules with daily/weekly tasks
   - Task completion tracking per day
   - Temperature recommendations by week
   - Flock status (Preparing → Active → Graduated)

2. **Chick Profiles & Photo Journal**
   - Individual chick profiles with name, breed, hatch date
   - Photo upload with drag-and-drop (Vercel Blob storage)
   - Notes/observations per chick
   - Timeline view (photos + notes interleaved by date)

## Important Files

- `src/app/dashboard/` - Main dashboard components
- `src/lib/services/` - Database service layer (Prisma)
- `src/lib/utils/storage.ts` - Vercel Blob upload utilities
- `src/lib/utils/timezone.ts` - Pacific timezone helpers
- `prisma/schema.prisma` - Database schema

## Deployment Notes

- Railway auto-deploys from `main` branch on GitHub
- Build command: `prisma generate && next build --webpack`
- Start command: `npm run start`
- If schema changes, run: `DATABASE_URL="<railway_url>" npx prisma db push`

## Known Issues / Future Work

- Timezone is hardcoded to Pacific - could add user preference
- No offline support for photo uploads yet
- Could add chick avatar/profile photo distinct from gallery

---

# Conductor Context

This project uses [Conductor](https://github.com/gagarinyury/claude_conductor) for spec-driven development.

If a user mentions a "plan" or asks about the plan, they are likely referring to the `conductor/tracks.md` file or one of the track plans (`conductor/tracks/<track_id>/plan.md`).

## Universal File Resolution Protocol

**PROTOCOL: How to locate files.**
To find a file (e.g., "**Product Definition**") within a specific context (Project Root or a specific Track):

1.  **Identify Index:** Determine the relevant index file:
    -   **Project Context:** `conductor/index.md`
    -   **Track Context:**
        a. Resolve and read the **Tracks Registry** (via Project Context).
        b. Find the entry for the specific `<track_id>`.
        c. Follow the link provided in the registry to locate the track's folder. The index file is `<track_folder>/index.md`.
        d. **Fallback:** If the track is not yet registered (e.g., during creation) or the link is broken:
            1. Resolve the **Tracks Directory** (via Project Context).
            2. The index file is `<Tracks Directory>/<track_id>/index.md`.

2.  **Check Index:** Read the index file and look for a link with a matching or semantically similar label.

3.  **Resolve Path:** If a link is found, resolve its path **relative to the directory containing the `index.md` file**.
    -   *Example:* If `conductor/index.md` links to `./workflow.md`, the full path is `conductor/workflow.md`.

4.  **Fallback:** If the index file is missing or the link is absent, use the **Default Path** keys below.

5.  **Verify:** You MUST verify the resolved file actually exists on the disk.

**Standard Default Paths (Project):**
- **Product Definition**: `conductor/product.md`
- **Tech Stack**: `conductor/tech-stack.md`
- **Workflow**: `conductor/workflow.md`
- **Product Guidelines**: `conductor/product-guidelines.md`
- **Tracks Registry**: `conductor/tracks.md`
- **Tracks Directory**: `conductor/tracks/`

**Standard Default Paths (Track):**
- **Specification**: `conductor/tracks/<track_id>/spec.md`
- **Implementation Plan**: `conductor/tracks/<track_id>/plan.md`
- **Metadata**: `conductor/tracks/<track_id>/metadata.json`

## Core Rules

1.  **Context First:** Always check `conductor/` files before answering questions about the project domain or tech stack.
2.  **Specs over Chat:** When asked to build a feature, ALWAYS suggest creating a **Track** (`/conductor:new`) first, rather than coding immediately.
3.  **Plan Compliance:** When implementing (`/conductor:implement`), NEVER deviate from the `plan.md` without explicit user approval.
4.  **Workflow Adherence:** Follow the rules in `conductor/workflow.md` (e.g. TDD, commit message format) strictly.

## Available Commands

- `/conductor:setup` - Initialize Conductor in a new project
- `/conductor:new <description>` - Create a new feature track
- `/conductor:implement [track_name]` - Execute a track's plan
- `/conductor:status` - View project progress
- `/conductor:revert` - Revert previous work
