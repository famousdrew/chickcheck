"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

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
  const [hatchDate, setHatchDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setBreed("");
      setHatchDate("");
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
          hatchDate: hatchDate || undefined,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Add a chick">
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
            htmlFor="chickHatchDate"
            className="text-wood-dark mb-1 block text-sm font-medium"
          >
            Hatch Date
          </label>
          <input
            type="date"
            id="chickHatchDate"
            value={hatchDate}
            onChange={(e) => setHatchDate(e.target.value)}
            className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full border px-3 py-2 focus:ring-2 focus:outline-none"
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

        {error && (
          <p className="text-barn-500 text-sm" role="alert">
            {error}
          </p>
        )}

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
    </Modal>
  );
}
