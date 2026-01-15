"use client";

import { useMemo } from "react";
import Image from "next/image";

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

interface TimelineItem {
  type: "photo" | "note";
  date: Date;
  data: Photo | Note;
}

interface ChickTimelineProps {
  photos: Photo[];
  notes: Note[];
  hatchDate?: string | null;
  onPhotoClick: (photo: Photo) => void;
}

export default function ChickTimeline({
  photos,
  notes,
  hatchDate,
  onPhotoClick,
}: ChickTimelineProps) {
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [
      ...photos.map((photo) => ({
        type: "photo" as const,
        date: new Date(photo.takenAt),
        data: photo,
      })),
      ...notes.map((note) => ({
        type: "note" as const,
        date: new Date(note.createdAt),
        data: note,
      })),
    ];

    // Sort by date, newest first
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [photos, notes]);

  const getWeekNumber = (date: Date): number | null => {
    if (!hatchDate) return null;
    const hatch = new Date(hatchDate);
    const diffTime = date.getTime() - hatch.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return null;
    return Math.floor(diffDays / 7) + 1;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (timelineItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="text-wood-dark/20 mx-auto h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="font-display text-wood-dark mt-4 font-bold">
          No timeline yet
        </h3>
        <p className="text-wood-dark/60 mt-1 text-sm">
          Upload photos and add notes to build the timeline!
        </p>
      </div>
    );
  }

  // Group items by date
  const groupedItems: { date: string; items: TimelineItem[] }[] = [];
  let currentDateStr = "";

  timelineItems.forEach((item) => {
    const dateStr = item.date.toDateString();
    if (dateStr !== currentDateStr) {
      currentDateStr = dateStr;
      groupedItems.push({ date: dateStr, items: [item] });
    } else {
      groupedItems[groupedItems.length - 1].items.push(item);
    }
  });

  return (
    <div className="space-y-6">
      {groupedItems.map((group) => {
        const groupDate = new Date(group.date);
        const weekNum = getWeekNumber(groupDate);

        return (
          <div key={group.date} className="relative">
            {/* Date header */}
            <div className="sticky top-0 z-10 mb-3 flex items-center gap-2 bg-white py-2">
              <span className="font-display text-wood-dark font-bold">
                {formatDate(groupDate)}
              </span>
              {weekNum && (
                <span className="bg-grass-100 text-grass-700 rounded-full px-2 py-0.5 text-xs font-medium">
                  Week {weekNum}
                </span>
              )}
            </div>

            {/* Timeline items */}
            <div className="border-wood-dark/10 space-y-3 border-l-2 pl-4">
              {group.items.map((item) => (
                <div key={`${item.type}-${item.data.id}`} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute top-2 -left-[21px] h-3 w-3 rounded-full border-2 border-white ${
                      item.type === "photo" ? "bg-grass-500" : "bg-sky-400"
                    }`}
                  />

                  {item.type === "photo" ? (
                    <button
                      onClick={() => onPhotoClick(item.data as Photo)}
                      className="group focus:ring-grass-500 block overflow-hidden rounded-lg focus:ring-2 focus:outline-none"
                    >
                      <div className="relative aspect-video w-48 sm:w-64">
                        <Image
                          src={(item.data as Photo).thumbnailUrl}
                          alt="Timeline photo"
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="256px"
                        />
                      </div>
                      <span className="text-wood-dark/50 mt-1 block text-xs">
                        {formatTime(item.date)}
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-rustic border-wood-dark/10 bg-cream/50 max-w-md border p-3">
                      <p className="text-wood-dark text-sm whitespace-pre-wrap">
                        {(item.data as Note).content}
                      </p>
                      <span className="text-wood-dark/50 mt-1 block text-xs">
                        {formatTime(item.date)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
