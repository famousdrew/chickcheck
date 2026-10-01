"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { usePushSubscription } from "@/hooks/usePushSubscription";

interface ReminderSettings {
  morningEnabled: boolean;
  morningHour: number;
  eveningEnabled: boolean;
  eveningHour: number;
}

interface ReminderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MORNING_HOURS = [5, 6, 7, 8, 9, 10, 11];
const EVENING_HOURS = [16, 17, 18, 19, 20, 21, 22];

export function formatHour(hour: number): string {
  const suffix = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display} ${suffix}`;
}

const DEVICE_MESSAGES: Record<string, string> = {
  "ios-needs-install":
    "To get reminders on iPhone or iPad, tap the Share button, choose “Add to Home Screen”, then open ChickCheck from your Home Screen.",
  unsupported: "This browser doesn't support push notifications.",
  disabled: "Push reminders haven't been set up on the server yet.",
  denied:
    "Notifications are blocked for ChickCheck. Allow them in your browser or phone settings, then come back here.",
};

export default function ReminderSettingsModal({
  isOpen,
  onClose,
}: ReminderSettingsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Reminder settings">
      {/* Mount contents only while open so state is fresh each time */}
      {isOpen && <ReminderSettingsContent onClose={onClose} />}
    </Modal>
  );
}

function ReminderSettingsContent({ onClose }: { onClose: () => void }) {
  const push = usePushSubscription();
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reminder-settings")
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(setSettings)
      .catch(() => setError("Couldn't load your reminder settings."));
  }, []);

  async function update(changes: Partial<ReminderSettings>) {
    if (!settings) return;
    const previous = settings;
    setSettings({ ...settings, ...changes });
    setError("");

    try {
      const response = await fetch("/api/reminder-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      if (!response.ok) throw new Error();
    } catch {
      setSettings(previous);
      setError("Couldn't save that change. Please try again.");
    }
  }

  return (
    <>
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
        Reminders
      </h2>

      <section className="border-wood-dark/10 mb-4 border-b pb-4">
        <h3 className="text-wood-dark mb-2 text-sm font-semibold">
          This device
        </h3>
        {push.status === "loading" ? (
          <p className="text-wood-dark/60 text-sm">Checking…</p>
        ) : push.status === "subscribed" ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-wood-dark/80 text-sm">
              Reminders are on for this device.
            </p>
            <button
              onClick={push.unsubscribe}
              className="rounded-rustic bg-barn-500/10 text-barn-500 hover:bg-barn-500/20 shrink-0 px-3 py-1.5 text-sm font-medium transition-colors"
            >
              Turn off
            </button>
          </div>
        ) : push.status === "unsubscribed" ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-wood-dark/80 text-sm">
              Get reminders here, even when ChickCheck is closed.
            </p>
            <button
              onClick={push.subscribe}
              className="rounded-rustic bg-grass-500 hover:bg-grass-500/90 shrink-0 px-3 py-1.5 text-sm font-medium text-white transition-colors"
            >
              Turn on
            </button>
          </div>
        ) : (
          <p className="text-wood-dark/80 text-sm">
            {DEVICE_MESSAGES[push.status]}
          </p>
        )}
        {push.error && (
          <p className="text-barn-500 mt-2 text-sm">{push.error}</p>
        )}
      </section>

      <section>
        <h3 className="text-wood-dark mb-1 text-sm font-semibold">
          When to remind me
        </h3>
        <p className="text-wood-dark/60 mb-3 text-xs">
          Applies to all your devices. Times are Pacific.
        </p>

        {settings ? (
          <div className="space-y-3">
            <ReminderRow
              id="morning"
              label="Morning"
              description="Today's tasks, plus brooder temperature at the start of each week"
              enabled={settings.morningEnabled}
              hour={settings.morningHour}
              hours={MORNING_HOURS}
              onToggle={(morningEnabled) => update({ morningEnabled })}
              onHourChange={(morningHour) => update({ morningHour })}
            />
            <ReminderRow
              id="evening"
              label="Evening"
              description="Only if tasks are still unfinished"
              enabled={settings.eveningEnabled}
              hour={settings.eveningHour}
              hours={EVENING_HOURS}
              onToggle={(eveningEnabled) => update({ eveningEnabled })}
              onHourChange={(eveningHour) => update({ eveningHour })}
            />
          </div>
        ) : (
          !error && <p className="text-wood-dark/60 text-sm">Loading…</p>
        )}

        {error && <p className="text-barn-500 mt-2 text-sm">{error}</p>}
      </section>
    </>
  );
}

interface ReminderRowProps {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  hour: number;
  hours: number[];
  onToggle: (enabled: boolean) => void;
  onHourChange: (hour: number) => void;
}

function ReminderRow({
  id,
  label,
  description,
  enabled,
  hour,
  hours,
  onToggle,
  onHourChange,
}: ReminderRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <label htmlFor={`${id}-enabled`} className="flex flex-1 gap-2">
        <input
          id={`${id}-enabled`}
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="accent-grass-500 mt-1 h-4 w-4"
        />
        <span>
          <span className="text-wood-dark block text-sm font-medium">
            {label}
          </span>
          <span className="text-wood-dark/60 block text-xs">{description}</span>
        </span>
      </label>
      <select
        aria-label={`${label} reminder time`}
        value={hour}
        disabled={!enabled}
        onChange={(e) => onHourChange(Number(e.target.value))}
        className="rounded-rustic border-wood-dark/20 border bg-white px-2 py-1 text-sm disabled:opacity-50"
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {formatHour(h)}
          </option>
        ))}
      </select>
    </div>
  );
}
