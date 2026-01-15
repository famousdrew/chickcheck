"use client";

import { useState } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  takenAt: string;
  weekNumber: number | null;
}

interface PhotoGalleryProps {
  photos: Photo[];
  flockId: string;
  chickId: string;
  onPhotoDeleted: () => void;
}

export default function PhotoGallery({
  photos,
  flockId,
  chickId,
  onPhotoDeleted,
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (photoId: string) => {
    if (!confirm("Delete this photo?")) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/flocks/${flockId}/chicks/${chickId}/photos/${photoId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete photo");
      }

      setSelectedPhoto(null);
      onPhotoDeleted();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (photos.length === 0) {
    return (
      <div className="py-8 text-center">
        <svg
          className="text-wood-dark/20 mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-wood-dark/50 mt-2 text-sm">No photos yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group bg-cream focus:ring-grass-500 relative aspect-square overflow-hidden rounded-lg focus:ring-2 focus:outline-none"
          >
            <Image
              src={photo.thumbnailUrl}
              alt={`Photo from ${formatDate(photo.takenAt)}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 33vw, 150px"
            />
            {photo.weekNumber && (
              <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
                Week {photo.weekNumber}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Full-size photo modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80"
            onClick={() => setSelectedPhoto(null)}
          />

          <div className="relative max-h-[90vh] max-w-4xl">
            <img
              src={selectedPhoto.imageUrl}
              alt={`Photo from ${formatDate(selectedPhoto.takenAt)}`}
              className="max-h-[85vh] rounded-lg object-contain"
            />

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleDelete(selectedPhoto.id)}
                disabled={isDeleting}
                className="bg-barn-500 hover:bg-barn-600 rounded-full p-2 text-white disabled:opacity-50"
                aria-label="Delete photo"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-wood-dark rounded-full bg-white/90 p-2 hover:bg-white"
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

            <div className="absolute bottom-4 left-4 rounded bg-black/50 px-3 py-1.5 text-sm text-white">
              {formatDate(selectedPhoto.takenAt)}
              {selectedPhoto.weekNumber &&
                ` • Week ${selectedPhoto.weekNumber}`}
            </div>

            {deleteError && (
              <div className="bg-barn-500 absolute right-4 bottom-4 rounded px-3 py-1.5 text-sm text-white">
                {deleteError}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
