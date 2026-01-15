# Specification: Chick Profiles & Photo Journal

## Overview
Add the ability for users to create individual profiles for each chick in their flock, upload photos to document growth, and add personality notes. This creates a memorable record of each chick's journey from fluffball to chicken.

## User Stories

### US-1: Create Chick Profile
**As a** user with a flock
**I want to** create a profile for each chick
**So that** I can track and remember each bird individually

**Acceptance Criteria:**
- User can add a new chick to their flock
- Required field: name
- Optional fields: breed, hatch date, color/markings description
- Profile shows in a list on the flock page
- Maximum 50 chicks per flock (reasonable limit)

### US-2: Upload Chick Photos
**As a** user documenting my chicks
**I want to** upload photos of each chick
**So that** I can see how they've grown over time

**Acceptance Criteria:**
- User can upload photos to a chick's profile
- Photos are tagged with upload date (auto-populated)
- Photos display in chronological order (newest first or oldest first toggle)
- Supported formats: JPEG, PNG, WebP
- Max file size: 5MB per photo
- Photos are resized/compressed on upload for storage efficiency
- User can delete photos they've uploaded

### US-3: Add Notes to Chicks
**As a** user observing my chicks
**I want to** add personality notes and observations
**So that** I can remember each chick's unique traits

**Acceptance Criteria:**
- User can add text notes to a chick's profile
- Notes are timestamped
- Notes can be edited or deleted
- Example notes: "Very curious, always first to investigate", "Loves to perch on my shoulder"

### US-4: View Chick Timeline
**As a** user reviewing my flock's growth
**I want to** see a timeline of photos and notes for each chick
**So that** I can appreciate their transformation

**Acceptance Criteria:**
- Timeline view shows photos and notes in chronological order
- Photos display with date taken
- Notes display with date written
- Visual week markers showing chick's age when photo/note was added

### US-5: Chick Gallery View
**As a** user browsing my flock
**I want to** see all my chicks in a visual gallery
**So that** I can quickly browse and select individual chicks

**Acceptance Criteria:**
- Gallery shows grid of chick cards
- Each card shows: name, most recent photo (or placeholder), breed if set
- Tapping a card opens the chick's full profile
- Empty state prompts user to add their first chick

### US-6: Edit and Delete Chicks
**As a** user managing my flock records
**I want to** edit or remove chick profiles
**So that** I can keep my records accurate

**Acceptance Criteria:**
- User can edit chick name, breed, and other details
- User can delete a chick profile (with confirmation)
- Deleting a chick removes all associated photos and notes
- Soft delete preferred (can restore within 30 days - future enhancement)

## Functional Requirements

### Data Model

**Chick**
- id: string (UUID)
- flockId: string (FK to Flock)
- name: string (required, max 50 chars)
- breed: string (optional, max 100 chars)
- hatchDate: Date (optional)
- description: string (optional, max 500 chars - color/markings)
- photoUrl: string (optional - profile/avatar photo)
- createdAt: DateTime
- updatedAt: DateTime

**ChickPhoto**
- id: string (UUID)
- chickId: string (FK to Chick)
- imageUrl: string (required - stored in cloud storage)
- thumbnailUrl: string (required - smaller version for gallery)
- takenAt: Date (defaults to upload date)
- weekNumber: number (calculated from flock start date)
- createdAt: DateTime

**ChickNote**
- id: string (UUID)
- chickId: string (FK to Chick)
- content: string (required, max 1000 chars)
- weekNumber: number (calculated from flock start date)
- createdAt: DateTime
- updatedAt: DateTime

### Image Storage
- Use cloud storage (consider: Cloudflare R2, AWS S3, or Vercel Blob)
- Generate thumbnails on upload (200x200 for gallery, 800px max for detail view)
- Store original for potential future use
- Implement cleanup for orphaned images

### API Endpoints

**Chicks**
- GET /api/flocks/[flockId]/chicks - List all chicks in flock
- POST /api/flocks/[flockId]/chicks - Create new chick
- GET /api/flocks/[flockId]/chicks/[chickId] - Get chick details with photos/notes
- PATCH /api/flocks/[flockId]/chicks/[chickId] - Update chick
- DELETE /api/flocks/[flockId]/chicks/[chickId] - Delete chick

**Photos**
- POST /api/flocks/[flockId]/chicks/[chickId]/photos - Upload photo
- DELETE /api/flocks/[flockId]/chicks/[chickId]/photos/[photoId] - Delete photo

**Notes**
- POST /api/flocks/[flockId]/chicks/[chickId]/notes - Add note
- PATCH /api/flocks/[flockId]/chicks/[chickId]/notes/[noteId] - Update note
- DELETE /api/flocks/[flockId]/chicks/[chickId]/notes/[noteId] - Delete note

### UI/UX Requirements
- Consistent with existing rustic farmhouse theme
- Mobile-first design for easy photo uploads from phone
- Large tap targets for photo selection
- Swipe gestures for browsing photos (future enhancement)
- Loading states while photos upload
- Optimistic UI updates where appropriate

## Non-Functional Requirements

### Performance
- Photo uploads show progress indicator
- Thumbnails load within 500ms
- Gallery view loads incrementally (lazy loading for large flocks)

### Storage Limits
- Max 100 photos per chick
- Max 50 notes per chick
- Total storage quota per user: 500MB (future consideration)

### Accessibility
- Alt text for photos (auto-generated: "[Chick name] photo from [date]")
- Keyboard navigation for gallery
- Screen reader support for timeline view

## Out of Scope (Future Enhancements)
- AI-powered breed detection from photos
- Automatic photo organization by detected chick
- Social sharing of chick photos
- Photo filters/editing
- Video uploads
- Export/backup of photos
