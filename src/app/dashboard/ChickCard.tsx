"use client";

import Link from "next/link";
import Image from "next/image";

interface ChickCardProps {
  chick: {
    id: string;
    name: string;
    breed: string | null;
    photoUrl: string | null;
    photos?: { thumbnailUrl: string }[];
  };
  flockId: string;
}

export default function ChickCard({
  chick,
  flockId: _flockId,
}: ChickCardProps) {
  // Use photoUrl (avatar) or first photo thumbnail, or placeholder
  const imageUrl = chick.photoUrl || chick.photos?.[0]?.thumbnailUrl || null;

  return (
    <Link href={`/dashboard/chicks/${chick.id}`} className="group block">
      <div className="rounded-rustic border-wood-dark/10 hover:border-grass-500/50 hover:shadow-rustic overflow-hidden border bg-white transition-all">
        {/* Photo */}
        <div className="bg-cream relative aspect-square">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={chick.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 150px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="text-wood-dark/20 h-12 w-12"
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
        <div className="p-3">
          <h3 className="font-display text-wood-dark group-hover:text-grass-600 truncate font-bold transition-colors">
            {chick.name}
          </h3>
          {chick.breed && (
            <p className="text-wood-dark/60 truncate text-sm">{chick.breed}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
