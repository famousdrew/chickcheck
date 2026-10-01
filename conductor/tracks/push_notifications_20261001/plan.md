# Implementation Plan: Push Notifications & Reminders

## Track Overview
- **Track ID:** push_notifications_20261001
- **Type:** Feature
- **Status:** In Progress

---

## Phase 1: Data Model & Push Infrastructure

### Objective
Store push subscriptions and reminder preferences, and be able to send a push.

- [ ] Task: Add schema
    - [ ] PushSubscription model (endpoint, keys, user relation)
    - [ ] Reminder preference fields on User (morning/evening on + hour)
    - [ ] ReminderLog model with unique (userId, kind, dayDate)
- [ ] Task: Push sending service (src/lib/push.ts)
    - [ ] Write tests: VAPID config detection, send, expired subscription cleanup
    - [ ] Implement with the web-push package
    - [ ] Script to generate VAPID keys (npm run vapid)
- [ ] Task: Subscription & preferences API
    - [ ] Write tests
    - [ ] GET /api/push/config - public key + whether push is enabled
    - [ ] POST/DELETE /api/push/subscriptions - save/remove this device
    - [ ] GET/PATCH /api/reminder-settings - read/update preferences

---

## Phase 2: Service Worker & Client Subscription

### Objective
Let users turn push on per device and manage reminder settings.

- [ ] Task: Service worker push handler (src/worker/index.ts)
    - [ ] Show notification on push
    - [ ] Focus or open the dashboard on click
- [ ] Task: usePushSubscription hook
    - [ ] Write tests
    - [ ] Detect support, subscribe/unsubscribe, sync with server
- [ ] Task: UI
    - [ ] Update "Enable reminders?" prompt to subscribe to push
    - [ ] Reminder settings panel from the dashboard header
    - [ ] iOS "Add to Home Screen" hint when push is unavailable
    - [ ] Only run in-tab reminders when the device is not push-subscribed

---

## Phase 3: Reminder Scheduling

### Objective
Send the right reminders at the right time, exactly once.

- [ ] Task: Reminder content builder
    - [ ] Write tests: morning, evening, new-week, nothing-to-send cases
    - [ ] Count today's tasks per active flock
- [ ] Task: Reminder job
    - [ ] Write tests: time windows, preferences, dedupe via ReminderLog
    - [ ] Send to all of a user's devices
- [ ] Task: Scheduling
    - [ ] Run every 15 minutes in-process via instrumentation.ts
    - [ ] POST /api/cron/reminders protected by CRON_SECRET

---

## Phase 4: Docs & Verification

- [ ] Task: Document env vars (.env.example, CLAUDE.md)
- [ ] Task: Full test suite, type check, lint, production build
