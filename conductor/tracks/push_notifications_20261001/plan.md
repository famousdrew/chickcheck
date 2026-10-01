# Implementation Plan: Push Notifications & Reminders

## Track Overview
- **Track ID:** push_notifications_20261001
- **Type:** Feature
- **Status:** In Progress

---

## Phase 1: Data Model & Push Infrastructure ✅

### Objective
Store push subscriptions and reminder preferences, and be able to send a push.

- [x] Task: Add schema
    - [x] PushSubscription model (endpoint, keys, user relation)
    - [x] ReminderSettings model, one row per user (morning/evening on + hour)
    - [x] ReminderLog model with unique (userId, kind, dayDate)
- [x] Task: Push sending service (src/lib/push.ts)
    - [x] Write tests: VAPID config detection, send, expired subscription cleanup
    - [x] Implement with the web-push package
    - [x] Script to generate VAPID keys (npm run vapid)
- [x] Task: Subscription & preferences API
    - [x] Write tests
    - [x] GET /api/push/config - public key + whether push is enabled
    - [x] POST/DELETE /api/push/subscriptions - save/remove this device
    - [x] GET/PATCH /api/reminder-settings - read/update preferences

---

## Phase 2: Service Worker & Client Subscription ✅

### Objective
Let users turn push on per device and manage reminder settings.

- [x] Task: Service worker push handler (worker/index.ts, bundled by next-pwa)
    - [x] Show notification on push
    - [x] Focus or open the dashboard on click
- [x] Task: usePushSubscription hook
    - [x] Write tests
    - [x] Detect support, subscribe/unsubscribe, sync with server
- [x] Task: UI
    - [x] Update "Enable reminders?" prompt to subscribe to push
    - [x] Reminder settings panel from the dashboard header
    - [x] iOS "Add to Home Screen" hint when push is unavailable
    - [x] Only run in-tab reminders when the device is not push-subscribed

---

## Phase 3: Reminder Scheduling ✅

### Objective
Send the right reminders at the right time, exactly once.

- [x] Task: Reminder content builder
    - [x] Write tests: morning, evening, new-week, nothing-to-send cases
    - [x] Count today's tasks per active flock
- [x] Task: Reminder job
    - [x] Write tests: time windows, preferences, dedupe via ReminderLog
    - [x] Send to all of a user's devices
- [x] Task: Scheduling
    - [x] Run every 15 minutes in-process via instrumentation.ts
    - [x] POST /api/cron/reminders protected by CRON_SECRET

---

## Phase 4: Docs & Verification

- [ ] Task: Document env vars (.env.example, CLAUDE.md)
- [ ] Task: Full test suite, type check, lint, production build
