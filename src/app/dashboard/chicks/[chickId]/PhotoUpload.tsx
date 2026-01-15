"use client";

import { useState, useRef, useCallback } from "react";

interface PhotoUploadProps {
  chickId: string;
  flockId: string;
  onUploadComplete: () => void;
}

export default function PhotoUpload({
  chickId,
  flockId,
  onUploadComplete,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    setError("");

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a JPEG, PNG, or WebP image");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Simulate progress since fetch doesn't support progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(
        `/api/flocks/${flockId}/chicks/${chickId}/photos`,
        {
          method: "POST",
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload photo");
      }

      // Reset state
      setSelectedFile(null);
      setPreview(null);
      setUploadProgress(0);
      onUploadComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setError("");
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-rustic cursor-pointer border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-grass-500 bg-grass-50"
              : "border-wood-dark/20 hover:border-grass-500/50 hover:bg-cream/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
          <svg
            className="text-wood-dark/30 mx-auto h-12 w-12"
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
          <p className="text-wood-dark/60 mt-2 text-sm">
            {isDragging
              ? "Drop your photo here"
              : "Drag and drop a photo, or click to select"}
          </p>
          <p className="text-wood-dark/40 mt-1 text-xs">
            JPEG, PNG, or WebP up to 5MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-rustic bg-cream relative aspect-video overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="bg-wood-dark/10 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-grass-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-wood-dark/60 text-center text-sm">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUploading}
              className="border-wood-dark/20 text-wood-dark hover:bg-wood-dark/5 rounded-rustic flex-1 border px-4 py-2 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-grass-500 hover:bg-grass-500/90 disabled:bg-grass-500/50 rounded-rustic flex-1 px-4 py-2 font-medium text-white transition-colors"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-barn-500 text-center text-sm">{error}</p>}
    </div>
  );
}
