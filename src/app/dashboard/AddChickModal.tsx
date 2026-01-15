"use client";

import { useState, useEffect, useRef } from "react";

interface AddChickModalProps {
  flockId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddChickModal({
  flockId,
  isOpen,
  onClose,
  onSuccess,
}: AddChickModalProps) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setName("");
      setBreed("");
      setDescription("");
      setError("");
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/flocks/${flockId}/chicks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          breed: breed.trim() || undefined,
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add chick");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="rounded-rustic shadow-rustic relative w-full max-w-md bg-white p-6">
        <button
          onClick={onClose}
          className="text-wood-dark/50 hover:text-wood-dark absolute top-4 right-4"
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

        <h2 className="font-display text-wood-dark mb-4 text-xl font-bold">
          Add a Chick
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="chickName"
              className="text-wood-dark mb-1 block text-sm font-medium"
            >
              Name <span className="text-barn-500">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              id="chickName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="Henrietta"
              maxLength={50}
            />
          </div>

          <div>
            <label
              htmlFor="chickBreed"
              className="text-wood-dark mb-1 block text-sm font-medium"
            >
              Breed
            </label>
            <input
              type="text"
              id="chickBreed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="Buff Orpington"
              maxLength={100}
            />
          </div>

          <div>
            <label
              htmlFor="chickDescription"
              className="text-wood-dark mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="chickDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-3 py-2 focus:ring-2 focus:outline-none"
              placeholder="Golden feathers, very curious..."
              rows={3}
              maxLength={500}
            />
          </div>

          {error && <p className="text-barn-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border-wood-dark/20 text-wood-dark hover:bg-wood-dark/5 rounded-rustic flex-1 border px-4 py-2 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-grass-500 hover:bg-grass-500/90 disabled:bg-grass-500/50 rounded-rustic flex-1 px-4 py-2 font-medium text-white transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Chick"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
