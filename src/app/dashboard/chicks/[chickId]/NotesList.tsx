"use client";

import { useState } from "react";

interface Note {
  id: string;
  content: string;
  weekNumber: number | null;
  createdAt: string;
}

interface NotesListProps {
  notes: Note[];
  flockId: string;
  chickId: string;
  onNoteAdded: () => void;
  onNoteUpdated: () => void;
  onNoteDeleted: () => void;
}

export default function NotesList({
  notes,
  flockId,
  chickId,
  onNoteAdded,
  onNoteUpdated,
  onNoteDeleted,
}: NotesListProps) {
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState("");

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsAdding(true);
    setError("");

    try {
      const response = await fetch(
        `/api/flocks/${flockId}/chicks/${chickId}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newNote.trim() }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add note");
      }

      setNewNote("");
      onNoteAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    setError("");

    try {
      const response = await fetch(
        `/api/flocks/${flockId}/chicks/${chickId}/notes/${noteId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContent.trim() }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update note");
      }

      setEditingId(null);
      setEditContent("");
      onNoteUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Delete this note?")) return;

    setError("");

    try {
      const response = await fetch(
        `/api/flocks/${flockId}/chicks/${chickId}/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete note");
      }

      onNoteDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note");
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this chick..."
          className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full resize-none border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          rows={2}
          maxLength={1000}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAdding || !newNote.trim()}
            className="bg-grass-500 hover:bg-grass-500/90 disabled:bg-grass-500/50 rounded-rustic px-4 py-1.5 text-sm font-medium text-white transition-colors"
          >
            {isAdding ? "Adding..." : "Add Note"}
          </button>
        </div>
      </form>

      {error && <p className="text-barn-500 text-sm">{error}</p>}

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="py-6 text-center">
          <svg
            className="text-wood-dark/20 mx-auto h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-wood-dark/50 mt-2 text-sm">No notes yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-rustic border-wood-dark/10 bg-cream/50 border p-3"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="rounded-rustic border-wood-dark/20 focus:border-grass-500 focus:ring-grass-500/20 w-full resize-none border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    rows={3}
                    maxLength={1000}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEditing}
                      className="text-wood-dark/60 hover:text-wood-dark text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditNote(note.id)}
                      disabled={!editContent.trim()}
                      className="text-grass-600 hover:text-grass-700 text-sm font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-wood-dark text-sm whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-wood-dark/50 text-xs">
                      {formatDate(note.createdAt)} at{" "}
                      {formatTime(note.createdAt)}
                      {note.weekNumber && ` • Week ${note.weekNumber}`}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(note)}
                        className="text-wood-dark/40 hover:text-wood-dark text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-wood-dark/40 hover:text-barn-500 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
