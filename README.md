# Pesly 🚗📊

**Financial intelligence for vehicle-based work.**

Pesly reads the receipts so nobody has to trust anybody. AI collects the evidence (platform statements, M-Pesa records, receipts) independently of the driver, grades every figure by evidence status, and reconciles machine sources against each other — ending owner–driver money disputes at the evidence.

## Why it exists

Owners and drivers in Kenya's ride-hailing economy argue about money because every number is self-reported. Pesly makes AI the primary data collector, so both sides see the same verified, evidence-backed record.

## Repository contents

- `Pesly-Business-Plan-Sept-2026.docx` — current business plan (editable source)
- `pesly-business-plan-final.pdf` / `.html` — **FINAL plan (Oct 2026, v4)**: evidence model, reconciliation engine, trust architecture (consent-default-private), pilot plan
- `pesly-business-plan-v3.pdf` / `.html` — AI-first business plan (Sept 2026, historical)
- `pesly-business-plan-v2.pdf` — earlier v2 plan (historical, shows the pivot to financial intelligence)
- `pesly-legal-starter-pack.pdf` / `.html` — Terms of Service, Privacy Policy (DPA 2019 aligned), Owner Subscription Agreement, driver consent language, Driver–Owner Agreement template
- `pitch_deck.html` — investor pitch deck (web)
- `peslyPitch_function.ts` — deployed pitch deck backend function
- `schema/` — the app data model as JSON: entities, evidence statuses, log sources, reconciliation design
- `pesly_logo.png` / `Peslylogo.png` — brand assets

## Progress log

- **Oct 2026** — Final business plan v4 (trust architecture added). Futuristic UI rebuild completed (11 screens, light/dark emerald themes, logo system). Demo fleet seeded (3 vehicles, 3 drivers). Automated reconciliation engine live: platform vs driver figures cross-checked, discrepancies auto-flagged for review. Legal starter pack drafted for advocate review.
- **Sept 2026** — Business plan v3 (AI-first data collection). Gmail OAuth statement ingestion + smart capture built. Evidence statuses across all entities. Agreement versioning + privacy grants.
- **Aug–Sept 2026** — Concept validation, v2 pivot to financial intelligence, pitch deck deployed.

## Roadmap

1. Pilot: 3–5 vehicles, Nairobi (Nov–Dec 2026)
2. First 10 paying owners (H1 2027)
3. Android app: M-Pesa SMS + notification capture (Phase 2)
4. WhatsApp capture channel

## Business model

Owners pay per vehicle (KSh 300–500/vehicle/month). Drivers free, with optional Pesly Plus (KSh 100/month) for dispute evidence packs and verified income certificates.

---

Founded by [Angela Odhiambo](https://github.com/Angelcoder87) · Nairobi, Kenya
