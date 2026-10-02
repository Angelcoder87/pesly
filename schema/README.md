# Pesly Data Model

Entity schemas of the Pesly web app (v3, October 2026), reconstructed from the live production app's records. Every record also carries system fields: `id`, `created_date`, `updated_date`, `created_by`.

## Core design: the Evidence Model

Every financial figure carries two fields:

- **`log_source`** — where the data came from: `gmail_sync` (platform statement emails read via OAuth), `manual`, `photo_ocr`, `mpesa_sms`, `estimated`
- **`evidence_status`** — how trustworthy the figure is: `verified` | `supported` | `reported` | `estimated` | `disputed` | `unverified` | `reconciled`

## Reconciliation engine

Platform-reported figures (`platform_reported_ksh`) are cross-checked against driver-reported figures (`driver_reported_ksh`). Mismatches automatically generate `Alert` records of type `revenue_discrepancy` flagged `requires_review` — the engine never accuses, it only flags for human review.

## Entities

- `Vehicle` — fleet vehicle, subscription tier and status
- `Driver` — driver account, phone/PIN auth, streak tracking
- `TripLog` — per-trip earnings with dual-source figures
- `FuelLog` — fuel/expense records with evidence grading
- `Agreement` — driver–owner terms; every change is a new version (never overwritten)
- `PrivacyGrant` — per-source consent grants and revocations (audit trail, DPA 2019)
- `Alert` — review queue items, reconciliation flags

> Note: `PrivacyGrant` schema reflects the v3 design spec (entity exists, no records yet).
> The UI/backend source code lives in the Base44 editor; this repo carries the data model, business documents and brand assets.
