"use client";

import { useState, useCallback } from "react";
import PhotoUpload from "./PhotoUpload";
import PhotoGallery from "./PhotoGallery";
import NotesList from "./NotesList";
import ChickTimeline from "./ChickTimeline";
import EditChickModal from "./EditChickModal";
import DeleteChickButton from "./DeleteChickButton";

interface Photo {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  takenAt: string;
  weekNumber: number | null;
}

interface Note {
  id: string;
  content: string;
  weekNumber: number | null;
  createdAt: string;
}

interface ChickData {
  id: string;
  name: string;
  breed: string | null;
  hatchDate: string | null;
  description: string | null;
  photoUrl: string | null;
  flockId: string;
  photos: Photo[];
  notes: Note[];
}

interface ChickProfileProps {
  initialChick: ChickData;
  flockId: string;
}

type ViewMode = "timeline" | "photos" | "notes";

export default function ChickProfile({
  initialChick,
  flockId,
}: ChickProfileProps) {
  const [chick, setChick] = useState(initialChick);
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const refreshChick = useCallback(async () => {
    try {
      const response = await fetch(`/api/flocks/${flockId}/chicks/${chick.id}`);
      if (response.ok) {
        const data = await response.json();
        setChick(data);
      }
    } catch (error) {
      console.error("Failed to refresh chick data:", error);
    }
  }, [flockId, chick.id]);

  const handlePhotoUploaded = () => {
    setIsUploadOpen(false);
    refreshChick();
  };

  const handleChickUpdated = () => {
    setIsEditOpen(false);
    refreshChick();
  };

  const getAge = () => {
    if (!chick.hatchDate) return null;
    const hatch = new Date(chick.hatchDate);
    const now = new Date();
    const diffTime = now.getTime() - hatch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} old`;

    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? "s" : ""} old`;
  };

  const age = getAge();

  return (
    <div className="space-y-6">
      {/* Chick info header */}
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="bg-cream relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
            {chick.photoUrl || chick.photos[0]?.thumbnailUrl ? (
              <img
                src={chick.photoUrl || chick.photos[0]?.thumbnailUrl}
                alt={chick.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  className="text-wood-dark/20 h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-wood-dark text-2xl font-bold">
                  {chick.name}
                </h2>
                <div className="text-wood-dark/60 mt-1 flex flex-wrap items-center gap-2 text-sm">
                  {chick.breed && <span>{chick.breed}</span>}
                  {chick.breed && age && <span>•</span>}
                  {age && <span>{age}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="text-wood-dark/60 hover:text-wood-dark text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <DeleteChickButton
                  chickId={chick.id}
                  chickName={chick.name}
                  flockId={flockId}
                />
              </div>
            </div>
            {chick.description && (
              <p className="text-wood-dark/70 mt-2 text-sm">
                {chick.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="border-wood-dark/10 mt-4 flex gap-6 border-t pt-4">
          <div className="text-center">
            <span className="font-display text-wood-dark block text-lg font-bold">
              {chick.photos.length}
            </span>
            <span className="text-wood-dark/60 text-xs">Photos</span>
          </div>
          <div className="text-center">
            <span className="font-display text-wood-dark block text-lg font-bold">
              {chick.notes.length}
            </span>
            <span className="text-wood-dark/60 text-xs">Notes</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-grass-500 hover:bg-grass-500/90 rounded-rustic flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Add Photo
        </button>
      </div>

      {/* Upload section */}
      {isUploadOpen && (
        <div className="rounded-rustic shadow-rustic bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-wood-dark font-bold">
              Upload Photo
            </h3>
            <button
              onClick={() => setIsUploadOpen(false)}
              className="text-wood-dark/50 hover:text-wood-dark"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <PhotoUpload
            chickId={chick.id}
            flockId={flockId}
            onUploadComplete={handlePhotoUploaded}
          />
        </div>
      )}

      {/* View mode tabs */}
      <div className="rounded-rustic shadow-rustic bg-white">
        <div className="border-wood-dark/10 flex border-b">
          {(["timeline", "photos", "notes"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                viewMode === mode
                  ? "border-grass-500 text-grass-600 border-b-2"
                  : "text-wood-dark/60 hover:text-wood-dark"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {viewMode === "timeline" && (
            <ChickTimeline
              photos={chick.photos}
              notes={chick.notes}
              hatchDate={chick.hatchDate}
              onPhotoClick={setSelectedPhoto}
            />
          )}
          {viewMode === "photos" && (
            <PhotoGallery
              photos={chick.photos}
              flockId={flockId}
              chickId={chick.id}
              onPhotoDeleted={refreshChick}
            />
          )}
          {viewMode === "notes" && (
            <NotesList
              notes={chick.notes}
              flockId={flockId}
              chickId={chick.id}
              onNoteAdded={refreshChick}
              onNoteUpdated={refreshChick}
              onNoteDeleted={refreshChick}
            />
          )}
        </div>
      </div>

      {/* Full-size photo modal from timeline */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setSelectedPhoto(null)}
          />
          <div className="relative max-h-[90vh] max-w-4xl">
            <img
              src={selectedPhoto.imageUrl}
              alt="Full size photo"
              className="max-h-[85vh] rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="text-wood-dark absolute top-4 right-4 rounded-full bg-white/90 p-2 hover:bg-white"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Edit chick modal */}
      <EditChickModal
        chick={chick}
        flockId={flockId}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleChickUpdated}
      />
    </div>
  );
}
