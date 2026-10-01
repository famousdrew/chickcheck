# Specification: Push Notifications & Reminders

## Overview
Today ChickCheck only shows reminders while the dashboard tab is open
(`useTaskReminder`). The product definition promises morning and evening care
reminders and weekly temperature alerts, which only work if they arrive when
the app is closed. This track adds standards-based Web Push so installed and
browser users get reminders on their phone or desktop.

## Goals
- Reminders arrive when ChickCheck is closed
- Users control which reminders they get and when
- No extra infrastructure required to run on Railway

## Functional Requirements

### Subscribing
- Users can turn on push reminders for the current device from the dashboard
  (the existing "Enable reminders?" prompt and a Reminder settings panel)
- A user can have several subscribed devices; each is stored separately
- Turning reminders off on a device removes that device's subscription
- On iPhone/iPad, push only works once ChickCheck is added to the Home Screen
  (iOS 16.4+); show a hint explaining this when push is unavailable there

### Reminder types (all times Pacific, matching the rest of the app)
| Reminder | Default | Sent when |
|----------|---------|-----------|
| Morning | 8:00 AM, on | Any active flock has tasks today |
| Evening | 7:00 PM, on | Any active flock still has unfinished tasks today |
| New week | Part of the morning reminder | Day 1 of weeks 2-8 - includes the new brooder temperature |

- Only ACTIVE flocks generate reminders (not PREPARING or GRADUATED)
- One notification per reminder slot per user per day, covering all their
  active flocks
- Tapping a notification opens the dashboard

### Settings
- Morning reminder on/off and hour (5 AM - 11 AM)
- Evening reminder on/off and hour (4 PM - 10 PM)
- Settings are per user and apply to all their devices

### Scheduling
- A reminder job runs every 15 minutes inside the app server (no separate
  cron service needed on Railway)
- The job is idempotent: a log of sent reminders guarantees at most one of
  each per user per day, even if the job runs twice or the server restarts
- Optional `POST /api/cron/reminders` endpoint, protected by `CRON_SECRET`,
  for triggering the job from an external scheduler

## Non-Functional Requirements
- VAPID keys come from environment variables; push is disabled (and the UI
  hides it) when they are not set
- Expired subscriptions (HTTP 404/410 from the push service) are deleted
- Existing in-tab reminders keep working for devices without push

## Out of Scope
- Per-user timezone (tracked separately; uses Pacific like the rest of the app)
- Milestone-approaching notifications (belongs with the Achievements track)
- Email or SMS reminders
