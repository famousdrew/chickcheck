"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteChickButtonProps {
  chickId: string;
  chickName: string;
  flockId: string;
}

export default function DeleteChickButton({
  chickId,
  chickName,
  flockId,
}: DeleteChickButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/flocks/${flockId}/chicks/${chickId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete chick");
      }

      // Navigate back to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setIsDeleting(false);
    }
  };

  if (!isConfirming) {
    return (
      <button
        onClick={() => setIsConfirming(true)}
        className="text-barn-500 hover:text-barn-600 text-sm font-medium transition-colors"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isDeleting && setIsConfirming(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="rounded-rustic shadow-rustic relative w-full max-w-sm bg-white p-6">
        <h2 className="font-display text-wood-dark mb-2 text-lg font-bold">
          Delete {chickName}?
        </h2>
        <p className="text-wood-dark/70 mb-4 text-sm">
          This will permanently delete {chickName} along with all their photos
          and notes. This action cannot be undone.
        </p>

        {error && <p className="text-barn-500 mb-4 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            disabled={isDeleting}
            className="border-wood-dark/20 text-wood-dark hover:bg-wood-dark/5 rounded-rustic flex-1 border px-4 py-2 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-barn-500 hover:bg-barn-600 disabled:bg-barn-500/50 rounded-rustic flex-1 px-4 py-2 font-medium text-white transition-colors"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
