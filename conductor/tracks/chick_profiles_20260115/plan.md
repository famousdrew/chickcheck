# Implementation Plan: Chick Profiles & Photo Journal

## Track Overview
- **Track ID:** chick_profiles_20260115
- **Type:** Feature
- **Status:** In Progress

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

## Phase 2: Image Storage Setup

### Objective
Configure cloud storage for photo uploads and implement image processing.

- [ ] Task: Set up Vercel Blob storage
    - [ ] Install @vercel/blob package
    - [ ] Configure BLOB_READ_WRITE_TOKEN environment variable
    - [ ] Create upload utility function (src/lib/utils/storage.ts)
    - [ ] Test upload/delete operations

- [ ] Task: Implement image processing
    - [ ] Install sharp for image resizing
    - [ ] Create thumbnail generation function (200x200)
    - [ ] Create optimized image function (max 800px width)
    - [ ] Write tests for image processing

- [ ] Task: Create Photo API endpoints
    - [ ] Write tests for photo upload/delete
    - [ ] POST /api/flocks/[flockId]/chicks/[chickId]/photos - Upload photo
    - [ ] DELETE /api/flocks/[flockId]/chicks/[chickId]/photos/[photoId] - Delete photo
    - [ ] Handle file size validation (max 5MB)
    - [ ] Handle format validation (JPEG, PNG, WebP)

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Image Storage Setup' (Protocol in workflow.md)

---

## Phase 3: Chick Gallery UI

### Objective
Build the user interface for viewing and managing chicks in a flock.

- [ ] Task: Create ChickCard component
    - [ ] Write tests for ChickCard component
    - [ ] Display chick name, photo (or placeholder), breed
    - [ ] Style with rustic farmhouse theme
    - [ ] Add hover/tap state

- [ ] Task: Create ChickGallery component
    - [ ] Write tests for ChickGallery component
    - [ ] Grid layout for chick cards
    - [ ] Empty state with prompt to add first chick
    - [ ] Loading state with skeleton cards

- [ ] Task: Add "My Chicks" section to dashboard
    - [ ] Add ChickGallery below task list
    - [ ] "Add Chick" button to create new profile
    - [ ] Link to full chicks management page

- [ ] Task: Create AddChickForm component
    - [ ] Write tests for form validation
    - [ ] Form fields: name (required), breed, hatch date, description
    - [ ] Modal or slide-over presentation
    - [ ] Success feedback on creation

- [ ] Task: Conductor - User Manual Verification 'Phase 3: Chick Gallery UI' (Protocol in workflow.md)

---

## Phase 4: Chick Profile Page

### Objective
Build the detailed profile view for individual chicks with photo upload and notes.

- [ ] Task: Create chick profile page route
    - [ ] Create /dashboard/chicks/[chickId] page
    - [ ] Fetch chick data with photos and notes
    - [ ] Header with chick name, breed, age
    - [ ] Edit and delete actions

- [ ] Task: Build PhotoUpload component
    - [ ] Write tests for PhotoUpload component
    - [ ] File input with drag-and-drop support
    - [ ] Upload progress indicator
    - [ ] Preview before upload
    - [ ] Error handling for invalid files

- [ ] Task: Build PhotoGallery component
    - [ ] Write tests for PhotoGallery component
    - [ ] Grid of uploaded photos with thumbnails
    - [ ] Click to view full size in modal
    - [ ] Delete button on each photo
    - [ ] Date labels on photos

- [ ] Task: Build NotesList component
    - [ ] Write tests for NotesList component
    - [ ] Display notes in chronological order
    - [ ] Add new note form
    - [ ] Edit and delete actions on notes
    - [ ] Timestamps on each note

- [ ] Task: Build ChickTimeline component
    - [ ] Write tests for timeline view
    - [ ] Interleave photos and notes by date
    - [ ] Week markers showing chick's age
    - [ ] Toggle between timeline and separate views

- [ ] Task: Conductor - User Manual Verification 'Phase 4: Chick Profile Page' (Protocol in workflow.md)

---

## Phase 5: Edit & Delete Flows

### Objective
Implement editing and deletion of chicks, photos, and notes with proper confirmations.

- [ ] Task: Build EditChickForm component
    - [ ] Write tests for edit form
    - [ ] Pre-populate form with existing data
    - [ ] Save and cancel actions
    - [ ] Optimistic update with rollback on error

- [ ] Task: Implement chick deletion
    - [ ] Write tests for deletion flow
    - [ ] Confirmation dialog before delete
    - [ ] Cascade delete photos and notes
    - [ ] Clean up cloud storage images
    - [ ] Success feedback

- [ ] Task: Implement photo deletion
    - [ ] Confirmation before delete
    - [ ] Remove from cloud storage
    - [ ] Update UI optimistically

- [ ] Task: Implement note editing and deletion
    - [ ] Inline edit mode for notes
    - [ ] Delete with confirmation
    - [ ] Optimistic updates

- [ ] Task: Conductor - User Manual Verification 'Phase 5: Edit & Delete Flows' (Protocol in workflow.md)

---

## Phase 6: Polish & Integration

### Objective
Final polish, loading states, error handling, and integration testing.

- [ ] Task: Add loading states
    - [ ] Skeleton loaders for chick gallery
    - [ ] Skeleton loaders for chick profile
    - [ ] Upload progress animations
    - [ ] Optimistic UI for all mutations

- [ ] Task: Add error handling
    - [ ] Error states for failed uploads
    - [ ] Retry mechanism for uploads
    - [ ] Friendly error messages
    - [ ] Error boundaries for components

- [ ] Task: Mobile optimization
    - [ ] Test photo upload from mobile camera
    - [ ] Optimize touch targets
    - [ ] Test on various screen sizes
    - [ ] Ensure gallery scrolls smoothly

- [ ] Task: Integration testing
    - [ ] Test full flow: add chick → upload photos → add notes
    - [ ] Test deletion cascades
    - [ ] Test with multiple chicks
    - [ ] Verify storage cleanup

- [ ] Task: Conductor - User Manual Verification 'Phase 6: Polish & Integration' (Protocol in workflow.md)

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
