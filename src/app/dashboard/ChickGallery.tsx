"use client";

import { useState, useEffect, useCallback } from "react";
import ChickCard from "./ChickCard";
import AddChickModal from "./AddChickModal";

interface Chick {
  id: string;
  name: string;
  breed: string | null;
  photoUrl: string | null;
  photos?: { thumbnailUrl: string }[];
}

interface ChickGalleryProps {
  flockId: string;
}

export default function ChickGallery({ flockId }: ChickGalleryProps) {
  const [chicks, setChicks] = useState<Chick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchChicks = useCallback(async () => {
    try {
      const response = await fetch(`/api/flocks/${flockId}/chicks`);
      if (!response.ok) throw new Error("Failed to fetch chicks");
      const data = await response.json();
      setChicks(data);
    } catch {
      setError("Failed to load chicks");
    } finally {
      setIsLoading(false);
    }
  }, [flockId]);

  useEffect(() => {
    fetchChicks();
  }, [fetchChicks]);

  function handleChickAdded() {
    setIsModalOpen(false);
    fetchChicks();
  }

  if (isLoading) {
    return (
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-cream aspect-square rounded-t-lg" />
              <div className="space-y-2 rounded-b-lg bg-white p-3">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <p className="text-barn-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-rustic shadow-rustic bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-wood-dark text-lg font-bold">
            My Chicks
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-grass-500 hover:bg-grass-500/90 rounded-rustic flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Chick
          </button>
        </div>

        {chicks.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-wood-dark/30 mx-auto mb-4 h-16 w-16">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-display text-wood-dark mb-1 font-bold">
              No chicks yet
            </h3>
            <p className="text-wood-dark/60 mb-4 text-sm">
              Add your chicks to track their growth and personalities!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-grass-500 hover:text-grass-600 text-sm font-medium"
            >
              Add your first chick
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {chicks.map((chick) => (
              <ChickCard key={chick.id} chick={chick} flockId={flockId} />
            ))}
          </div>
        )}
      </div>

      <AddChickModal
        flockId={flockId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleChickAdded}
      />
    </>
  );
}
