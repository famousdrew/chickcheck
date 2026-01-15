# Implementation Plan: Chick Profiles & Photo Journal

## Track Overview
- **Track ID:** chick_profiles_20260115
- **Type:** Feature
- **Status:** Complete

---

## Phase 1: Data Model & API Foundation ✅

### Objective
Extend the database schema to support chick profiles, photos, and notes. Create the core API endpoints.

- [x] Task: Add Chick model to Prisma schema
    - [x] Define Chick model with fields: id, flockId, name, breed, hatchDate, description, photoUrl
    - [x] Add relation to Flock model
    - [x] Run migration (prisma generate)
    - [x] Create Chick service functions (src/lib/services/chicks.ts)

- [x] Task: Add ChickPhoto model to Prisma schema
    - [x] Define ChickPhoto model with fields: id, chickId, imageUrl, thumbnailUrl, takenAt, weekNumber
    - [x] Add relation to Chick model
    - [x] Run migration
    - [x] Create ChickPhoto service functions

- [x] Task: Add ChickNote model to Prisma schema
    - [x] Define ChickNote model with fields: id, chickId, content, weekNumber
    - [x] Add relation to Chick model
    - [x] Run migration
    - [x] Create ChickNote service functions

- [x] Task: Create Chick API endpoints
    - [x] Write tests for chick CRUD operations (19 tests)
    - [x] POST /api/flocks/[flockId]/chicks - Create chick
    - [x] GET /api/flocks/[flockId]/chicks - List chicks
    - [x] GET /api/flocks/[flockId]/chicks/[chickId] - Get chick with photos/notes
    - [x] PATCH /api/flocks/[flockId]/chicks/[chickId] - Update chick
    - [x] DELETE /api/flocks/[flockId]/chicks/[chickId] - Delete chick

- [x] Task: Create Notes API endpoints
    - [x] Write tests for notes CRUD operations (included in 19 tests)
    - [x] POST /api/flocks/[flockId]/chicks/[chickId]/notes - Add note
    - [x] PATCH /api/flocks/[flockId]/chicks/[chickId]/notes/[noteId] - Update note
    - [x] DELETE /api/flocks/[flockId]/chicks/[chickId]/notes/[noteId] - Delete note

- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Model & API Foundation' (Protocol in workflow.md)

---

## Phase 2: Image Storage Setup ✅

### Objective
Configure cloud storage for photo uploads and implement image processing.

- [x] Task: Set up Vercel Blob storage
    - [x] Install @vercel/blob package
    - [x] Configure BLOB_READ_WRITE_TOKEN environment variable
    - [x] Create upload utility function (src/lib/utils/storage.ts)
    - [x] Test upload/delete operations

- [x] Task: Implement image processing
    - [x] Install sharp for image resizing
    - [x] Create thumbnail generation function (200x200)
    - [x] Create optimized image function (max 800px width)
    - [x] Write tests for image processing (12 tests)

- [x] Task: Create Photo API endpoints
    - [x] Write tests for photo upload/delete
    - [x] POST /api/flocks/[flockId]/chicks/[chickId]/photos - Upload photo
    - [x] DELETE /api/flocks/[flockId]/chicks/[chickId]/photos/[photoId] - Delete photo
    - [x] Handle file size validation (max 5MB)
    - [x] Handle format validation (JPEG, PNG, WebP)

- [x] Task: Conductor - User Manual Verification 'Phase 2: Image Storage Setup' (Protocol in workflow.md)

---

## Phase 3: Chick Gallery UI ✅

### Objective
Build the user interface for viewing and managing chicks in a flock.

- [x] Task: Create ChickCard component
    - [x] Display chick name, photo (or placeholder), breed
    - [x] Style with rustic farmhouse theme
    - [x] Add hover/tap state

- [x] Task: Create ChickGallery component
    - [x] Grid layout for chick cards
    - [x] Empty state with prompt to add first chick
    - [x] Loading state with skeleton cards

- [x] Task: Add "My Chicks" section to dashboard
    - [x] Add ChickGallery below task list
    - [x] "Add Chick" button to create new profile
    - [x] Link to chick profile pages

- [x] Task: Create AddChickModal component
    - [x] Form fields: name (required), breed, description
    - [x] Modal presentation
    - [x] Success feedback on creation

- [x] Task: Conductor - User Manual Verification 'Phase 3: Chick Gallery UI' (Protocol in workflow.md)

---

## Phase 4: Chick Profile Page ✅

### Objective
Build the detailed profile view for individual chicks with photo upload and notes.

- [x] Task: Create chick profile page route
    - [x] Create /dashboard/chicks/[chickId] page
    - [x] Fetch chick data with photos and notes
    - [x] Header with chick name, breed, age
    - [x] Edit and delete actions

- [x] Task: Build PhotoUpload component
    - [x] File input with drag-and-drop support
    - [x] Upload progress indicator
    - [x] Preview before upload
    - [x] Error handling for invalid files

- [x] Task: Build PhotoGallery component
    - [x] Grid of uploaded photos with thumbnails
    - [x] Click to view full size in modal
    - [x] Delete button on each photo
    - [x] Date labels on photos

- [x] Task: Build NotesList component
    - [x] Display notes in chronological order
    - [x] Add new note form
    - [x] Edit and delete actions on notes
    - [x] Timestamps on each note

- [x] Task: Build ChickTimeline component
    - [x] Interleave photos and notes by date
    - [x] Week markers showing chick's age
    - [x] Toggle between timeline, photos, and notes views

- [x] Task: Conductor - User Manual Verification 'Phase 4: Chick Profile Page' (Protocol in workflow.md)

---

## Phase 5: Edit & Delete Flows ✅

### Objective
Implement editing and deletion of chicks, photos, and notes with proper confirmations.

- [x] Task: Build EditChickModal component
    - [x] Pre-populate form with existing data
    - [x] Save and cancel actions
    - [x] Refresh data on success

- [x] Task: Implement chick deletion
    - [x] Confirmation dialog before delete
    - [x] Cascade delete photos and notes (database)
    - [x] Clean up cloud storage images
    - [x] Navigate back to dashboard on success

- [x] Task: Implement photo deletion
    - [x] Confirmation before delete
    - [x] Remove from cloud storage
    - [x] Refresh UI after delete

- [x] Task: Implement note editing and deletion
    - [x] Inline edit mode for notes
    - [x] Delete with confirmation
    - [x] Refresh UI after changes

- [x] Task: Conductor - User Manual Verification 'Phase 5: Edit & Delete Flows' (Protocol in workflow.md)

---

## Phase 6: Polish & Integration ✅

### Objective
Final polish, loading states, error handling, and integration testing.

- [x] Task: Add loading states
    - [x] Skeleton loaders for chick gallery
    - [x] Loading spinner for profile data refresh
    - [x] Upload progress animations
    - [x] Refresh indicator on content updates

- [x] Task: Add error handling
    - [x] Error states for failed uploads
    - [x] Friendly error messages throughout
    - [x] Error display in modals and forms

- [x] Task: Mobile optimization
    - [x] Responsive grid layouts
    - [x] Touch-friendly button sizes
    - [x] Mobile-appropriate spacing

- [x] Task: Integration testing
    - [x] 98 automated tests passing
    - [x] Build succeeds without errors

- [x] Task: Conductor - User Manual Verification 'Phase 6: Polish & Integration' (Protocol in workflow.md)

---

## Completion Criteria

This track is complete when:
1. Users can create chick profiles with name and optional details
2. Users can upload photos to chick profiles
3. Photos are stored in cloud storage with thumbnails
4. Users can add, edit, and delete notes on chicks
5. Timeline view shows photos and notes chronologically
6. Gallery view shows all chicks in a flock
7. Users can edit and delete chick profiles
8. All tests pass with >80% coverage
9. Feature works on mobile devices
