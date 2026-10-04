# Pesly — Full Claude Code Build Prompt Pack
*Rebuilds the exact Pesly app currently running on Base44, feature-for-feature.*

**How to use:** Work through these prompts in order, one per session (or paste them one at a time into Claude Code at the project root). Each prompt is self-contained and tells Claude Code exactly what to build. Prompts 1–2 set up the skeleton and database; 3–5 build the backend; 6–7 the frontend; 8 seeds demo data; 9 polishes.

---

## PROMPT 0 — Master context (paste this FIRST, before any other prompt)

```
I am building "Pesly" — a financial intelligence web app for the Kenyan ride-hailing
economy. Read this whole context before doing anything.

WHAT PESLY IS:
An AI-first reconciliation layer between vehicle owners and drivers. Owners supply
cars to drivers; drivers remit a fixed daily/weekly fee or a percentage. Today every
number in that relationship is self-reported, which causes constant money disputes.
Pesly collects evidence automatically (platform statement emails via Gmail, M-Pesa
records, receipt photos), grades every figure by evidence status, cross-checks the
platform's reported figures against the driver's reported figures, and flags any
mismatch for human review. It NEVER accuses — every alert says "requires review".
It is deliberately two-sided: the owner sees the driver's costs (fuel, data, idle
days) as clearly as the driver's earnings.

CORE PHILOSOPHY (apply to every feature):
Collect evidence → Reconcile reality → Explain it → Create intelligence.
- AI is the PRIMARY data collector; driver manual entry is a small fallback only.
- Consent-default-private: the DRIVER controls what flows to the owner. Owners must
  sell Pesly to drivers, not mandate it. Privacy is a design constraint, not a feature.
- The engine never accuses. Neutral language everywhere ("requires review", never
  "theft" or "fraud").

EVIDENCE MODEL (the heart of the data design — every money figure carries these):
- log_source (where data came from): gmail_sync | mpesa_sms | photo_ocr | manual | estimated
- evidence_status (how much it can be trusted):
  verified | supported | reported | estimated | disputed | unverified | reconciled
- A figure becomes "reconciled" when independent machine sources agree.
- When platform vs driver figures disagree → status "disputed" + auto-generate an Alert.

RECONCILIATION ENGINE:
Continuously compares platform_reported_ksh vs driver_reported_ksh (and M-Pesa
movement where available) per trip/day. Any gap > KSh 0 generates an Alert of type
"revenue_discrepancy", severity based on gap size, with a message in EXACTLY this
format (real production output — keep the format):
"KSh 2044 discrepancy on 2026-09-04 for KCA 234B: platform reported KSh 3684, driver reported KSh 5728."
with requires_review = true. The engine is a scheduled job + runs on new data.

AGREEMENT ENGINE:
Owner-driver terms: type = fixed_daily | fixed_weekly | percentage | hybrid | custom,
with amount_ksh (fixed) and/or percentage. EVERY change creates a new versioned record
(version increments per vehicle+driver pair; old versions stay, is_active flips).
Never overwrite history.

PRIVACY GRANTS (consent audit trail):
Per driver, per source: grant_type = gmail | mpesa_sms | notifications | photos,
granted boolean, granted_date, revoked_date, and the exact consent_wording shown
when consent was given. Aligned with the Kenya Data Protection Act 2019.

USERS & ROLES:
- Owner (account email/password): dashboard, fleet, subscriptions (KSh 300–500/vehicle/mo).
- Driver (phone + 4-digit PIN auth): their own records, dispute button, privacy center.
- Drivers link to an owner by entering the owner's linked_owner_code at signup.

BUSINESS RULES:
- Drivers are free forever. Optional "Pesly Plus" (KSh 100/mo): dispute evidence pack,
  verified income certificate, 12-month history.
- Owner side shows: verified earnings per vehicle, reconciliation alerts, agreement
  management, a review queue.

BRAND:
Name: Pesly. Light theme: white surfaces + emerald green (#065f46 primary,
#10b981 accent, #ecfdf5 tint). Dark theme: deep forest/emerald (#022c22 deepest,
#064e3b surfaces, #10b981 accent). Georgia serif for headings in documents;
Inter/sans for the app UI. Logo: pesly_logo.png — dark logo on light surfaces only.
Tagline: "The money never lies. Now everybody can see it."

NON-GOALS (do not build): GPS live-tracking, dispatch, ride booking, payments
processing (a later phase), multi-tenant SaaS admin beyond a simple owner signup.
```

---

## PROMPT 1 — Stack scaffold

```
Set up the Pesly project with this exact stack:
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL via Prisma ORM (structure for Supabase compatibility)
- NextAuth for owner accounts (email/password). Simple custom phone+PIN auth for
  drivers (store PIN hashed with bcrypt).
- react-query for data fetching, recharts for charts, react-hook-form + zod for forms.
- Folder structure:
  /src/app        (routes/pages)
  /src/components (shared UI)
  /src/lib        (db, auth, utils)
  /src/server     (server actions, services: reconciliation, ingestion, agreements)
  /prisma         (schema, seed)
  /public         (logo: pesly_logo.png)
- Set up the emerald theme in tailwind.config: primary #065f46, accent #10b981,
  tint #ecfdf5, plus a dark-mode palette (deep forest #022c22, surfaces #064e3b).
  Theme toggle (light/dark) persisted in localStorage.
- .env.example with: DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN (system), NEXTAUTH_SECRET, CRON_SECRET.
Do not build pages yet — just a clean scaffold that runs with `npm run dev`.
```

---

## PROMPT 2 — Database schema (Prisma)

```
Write the complete Prisma schema for Pesly. These are the EXACT production schemas —
do not rename fields. Every model gets id (cuid), created_date, updated_date.

model Vehicle {
  plate              String   @unique
  make_model         String?
  driver             Driver?  @relation("VehicleDriver")
  driverId           String?  @unique
  owner              Owner     @relation("OwnerVehicles")
  ownerId            String
  monthlyFeeKsh      Float     @default(0)
  subscriptionStatus String   @default("active") // active | trial | past_due | cancelled
  isDemo             Boolean  @default(false)
}

model Driver {
  name             String
  phone            String   @unique
  pinHash          String
  joinedDate       DateTime @default(now())
  streakCount      Int      @default(0)
  linkedOwnerCode  String?  // owner's invite code entered at signup
  vehicle          Vehicle?
  isDemo           Boolean  @default(false)
  privacyGrants    PrivacyGrant[]
  tripLogs         TripLog[]
  fuelLogs         FuelLog[]
  agreements       Agreement[]
}

model Owner {
  email            String   @unique
  name             String
  linkedOwnerCode  String   @unique  // 6-char code drivers enter to join this fleet
  vehicles         Vehicle[]
  agreements       Agreement[]
  alerts           Alert[]
}

model TripLog {
  vehicleId            String
  vehicle              Vehicle @relation(...)
  driverId             String
  driver               Driver  @relation(...)
  day                  DateTime @db.Date
  loggedAt             DateTime
  platform             String   // Uber | Bolt | Little | Other
  fareKsh              Float    // final accepted figure
  platformReportedKsh  Float?   // from platform statement (AI-extracted)
  driverReportedKsh     Float?   // driver's own report
  distanceKm           Float?
  durationMin           Float?
  isCash                Boolean  @default(false)
  logSource             String   // gmail_sync | mpesa_sms | photo_ocr | manual | estimated
  evidenceStatus        String   // verified | supported | reported | estimated | disputed | unverified | reconciled
  sourceText            String?  // raw evidence excerpt backing the figure
  disputeNotes          String?
  isDemo                Boolean  @default(false)
  @@unique([vehicleId, day, platform, loggedAt]) // dedup anchor
}

model FuelLog {
  vehicleId      String
  driverId       String
  day            DateTime @db.Date
  loggedAt       DateTime
  category       String   // fuel | data | maintenance | parking | other
  amountKsh      Float
  litres         Float?
  logSource      String
  evidenceStatus String
  sourceText     String?
  isDemo         Boolean  @default(false)
}

model Agreement {
  vehicleId     String
  driverId      String
  ownerId       String
  type          String    // fixed_daily | fixed_weekly | percentage | hybrid | custom
  amountKsh     Float?    // fixed remittance (fixed/hybrid)
  percentage    Float?    // share (percentage/hybrid)
  effectiveDate DateTime @db.Date
  version       Int       @default(1)
  isActive      Boolean  @default(true)  // only ONE active version per pair
  notes         String?  // e.g. "Updated after fuel price increase"
  isDemo        Boolean  @default(false)
  @@unique([vehicleId, driverId, version])
}

model PrivacyGrant {
  driverId       String
  driver         Driver @relation(...)
  grantType      String   // gmail | mpesa_sms | notifications | photos
  granted        Boolean  @default(false)
  grantedDate    DateTime?
  revokedDate    DateTime?
  consentWording String?  // exact wording shown when consent was given
}

model Alert {
  vehicleId       String?
  ownerId         String
  type            String   // revenue_discrepancy | fuel_outlier | sync_issue | agreement_expiring | payment_due
  severity        String   // low | medium | high
  message         String   // human-readable, NEVER accusatory
  requiresReview  Boolean  @default(false)
  isRead          Boolean  @default(false)
  isDemo          Boolean  @default(false)
}

Add the relations on both sides, run prisma migrate, and confirm the schema compiles.
```

---

## PROMPT 3 — Auth + linking flow

```
Build authentication and the owner-driver linking flow:

1. Owner auth: NextAuth credentials provider (email/password), a clean signup that
   generates a unique 6-character linkedOwnerCode (e.g. "K4X9QB").

2. Driver auth: custom phone + 4-digit PIN. Phone format 07XXXXXXXX (Kenyan).
   PIN hashed with bcrypt. Login returns a JWT cookie (role=driver).

3. Driver onboarding flow (multi-step, one screen per step, progress dots):
   Step 1: enter owner's linkedOwner_code → link driver to that owner's fleet
   Step 2: name + phone + choose PIN
   Step 3: GMAIL CONNECT — clear consent screen: "Pesly reads your Uber/Bolt/Little
   statement emails. Nothing is shared with your owner without your permission."
   Two buttons: "Connect Gmail" (Google OAuth) and "Skip for now".
   The consent wording shown is stored verbatim in PrivacyGrant.consentWording.
   Step 4: done → land on the driver dashboard.

4. Role-based routing: /owner/* requires owner session; /driver/* requires driver
   session; wrong role redirects to their own home.

CRITICAL RULE from the master context: consent-default-private. The owner's view
of a driver's data is filtered by the driver's PrivacyGrants — if a driver has not
granted gmail, the owner sees ONLY the remittance-relevant daily summary (agreed
amount vs remitted), never trip detail. Enforce this in the query layer (a single
function: getOwnerVisibleTrips(driverId) that checks grants), NOT in the UI.
```

---

## PROMPT 4 — Gmail ingestion service (the AI collector)

```
Build the Gmail statement ingestion pipeline — the heart of Pesly:

1. Google OAuth flow for drivers (scope: gmail.readonly). Store the refresh token
   encrypted per driver. On consent, write a PrivacyGrant (grantType=gmail, granted,
   consentWording=<exact screen wording>).

2. A scheduled job (Vercel cron route /api/cron/ingest, protected by CRON_SECRET,
   runs every 30 min) that for each connected driver:
   a. Fetches unread statement emails from the last 30 days from:
      - Uber (sender: uber.com, subject patterns like "Your weekly earnings statement")
      - Bolt (sender: bolt.eu)
      - Little (sender: little.africa / littlecab)
   b. Parses each statement with the Gmail API + an LLM extraction step (use
      Anthropic API, model claude-sonnet, with a strict JSON output schema):
      { platform, periodStart, periodEnd, trips: [{date, time, fare, distanceKm,
      durationMin, isCash}], totals: {gross, commission, net} }
      Store the raw email text in TripLog.sourceText for every extracted trip
      (evidence trail).
   c. SMART DEDUPLICATION before insert: check the unique anchor
      (vehicleId, day, platform, loggedAt) AND fuzzy match (same day+platform+fare
      within ±2 min). If a trip already exists from any source, do NOT insert a
      duplicate — instead reconcile: if the existing record was manual/reported and
      the new one is gmail_sync, upgrade it (set platformReportedKsh, logSource=
      gmail_sync, evidenceStatus=verified, keep driverReportedKsh).
   d. All inserts get logSource=gmail_sync, evidenceStatus=verified.
   e. Failure of one driver's sync must never block others; log a sync_issue Alert
      on repeated failures.

3. Manual fallback endpoints (POST /api/trips, /api/fuel) for driver entry —
   logSource=manual, evidenceStatus=reported.
4. Photo OCR endpoint (POST /api/ocr): accepts an image, extracts fuel/expense
   records, logSource=photo_ocr, evidenceStatus=supported.
```

---

## PROMPT 5 — Reconciliation engine + agreements

```
Build the two core engines as /src/server services with tests:

1. RECONCILIATION SERVICE (src/server/reconciliation.ts):
   - reconcileTrip(trip): if platformReportedKsh and driverReportedKsh both exist:
     * equal (within KSh 1) → evidenceStatus=reconciled
     * differ → evidenceStatus=disputed + create Alert:
       type=revenue_discrepancy, requiresReview=true,
       severity: gap <= 500 low, <= 2000 medium, else high,
       message EXACTLY: `KSh {gap} discrepancy on {date} for {plate}: platform
       reported KSh {platform}, driver reported KSh {driver}` — no full stops in
       numbers, no accusation words, ever.
   - A scheduled job (same cron) runs reconciliation over the last 7 days of data.
   - A resolve action (POST /api/alerts/:id/resolve) that marks the alert read and
     records the resolution in disputeNotes on the trip.

2. AGREEMENT SERVICE (src/server/agreements.ts):
   - createAgreement(vehicleId, driverId, type, amountKsh?, percentage?, effectiveDate):
     starts version 1, isActive=true.
   - updateAgreement: NEVER mutate an existing version. Deactivate the current one
     (isActive=false) and create version+1 with the new terms. Copy over the notes
     convention (notes field on each version, e.g. "Updated after fuel price increase").
   - getActiveAgreement(vehicleId, driverId): returns the single active version.
   - Remittance calculation helper: given a day's reconciled fares + the active
     agreement, compute what the driver owed that day (fixed amount or
     percentage of gross). Expose GET /api/vehicles/:id/remittance?from=&to=.
   - 7 days before an agreement with an end/expiry condition, create an
     agreement_expiring Alert.

3. Write vitest unit tests for: discrepancy thresholds, message format string,
   version incrementing, dedup-upgrade logic from Prompt 4.
```

---

## PROMPT 6 — Owner frontend (7 screens)

```
Build the owner-facing screens under /src/app/owner/ with the emerald light/dark
theme, Pesly logo top-left on every screen, sidebar navigation, mobile-responsive:

1. /owner (Dashboard): fleet KPI cards (vehicles active, fleet net earnings this
   week, open review items, subscription status per vehicle), a 14-day earnings
   line chart (recharts), and the latest 5 alerts.

2. /owner/vehicles: vehicle cards (plate, make/model, driver, subscription status
   with trial/active/past_due badges, monthly fee). Click → vehicle detail:
   per-day verified earnings vs remittance owed (from the agreement service),
   fuel cost trend, that vehicle's alerts.

3. /owner/drivers: driver list (name, phone, joined date, streak, connected
   sources as chips: Gmail ✓ / M-Pesa ✗). IMPORTANT: show each driver's PRIVACY
   GRANT STATE honestly — if a driver hasn't granted Gmail, show "sharing limited
   to remittance summary" rather than pressuring.

4. /owner/trips: the TripLog table — day, platform, fare, platform vs driver
   reported columns side by side, evidence_status chip per row (color-coded:
   verified=emerald, reconciled=green, disputed=amber, estimated=gray,
   unverified=slate). Filters by vehicle/date/status.

5. /owner/review (the review queue): alerts where requiresReview=true, sorted by
   severity. Each card shows the exact discrepancy message, both figures, the
   sourceText evidence excerpt in a collapsible, and buttons: "Mark resolved" /
   "Open dispute". This screen is the product's money screen — make it beautiful.

6. /owner/agreements: per vehicle+driver pair, the ACTIVE agreement card on top,
   then the full version history timeline below (v1 → v2 with effective dates and
   notes). "New version" button opens a form (type, amount/percentage, effective
   date, notes) that calls the versioned update — show a confirm dialog that
   explains the old version is kept.

7. /owner/settings: profile, linkedOwnerCode display (large, with copy button +
   WhatsApp share), subscription overview, dark/light toggle.

API: server actions or route handlers calling the services from Prompts 3–5.
All owner queries MUST go through the grant-filtered query layer (Prompt 3 rule).
```

---

## PROMPT 7 — Driver frontend (4 screens)

```
Build the driver-facing screens under /src/app/driver/ — same theme system, bottom
tab navigation on mobile, warm and simple (this audience is not techy):

1. /driver (Today): today's net (fare minus fuel minus remittance owed — the number
   the driver actually cares about), trips logged today with evidence chips,
   streak counter, and a big "Log a trip" button + "Snap a receipt" (camera input
   → /api/ocr).

2. /driver/earnings: 14-day bar chart of true net earnings, list of daily summaries,
   remittance history (what was owed vs paid).

3. /driver/records: full trip + fuel history with filters, and a FREE "Dispute"
   button on every trip: opens a note field, sets disputeNotes + flags the trip
   disputed. Disputing is free and prominent — this is the honest driver's
   defence lawyer.

4. /driver/privacy (the Privacy Center): per-source grants (Gmail, M-Pesa SMS,
   Notifications, Photos) each with toggle, the date granted/revoked, and the
   exact consent wording shown. A clear plain-language panel: "What your owner
   sees: the daily remittance summary. What they never see unless you allow it:
   trip detail, times, locations." Revoke = instant (revokedDate set, owner's
   view narrows immediately). Also show Pesly Plus upsell: KSh 100/mo for the
   dispute evidence pack, verified income certificate, 12-month history.
```

---

## PROMPT 8 — Demo data seed

```
Write prisma/seed.ts that creates a realistic demo fleet (mirrors our production
demo exactly):

1 owner: "Demo Owner" (demo@pesly.co.ke), code "DEMO01".
3 vehicles: KCA 123A (Toyota Axio, fee 400, active), KCA 234B (Nissan Note, fee 400,
active), KCA 345C (Mazda Demio, fee 500, trial).
3 drivers: John Mwangi (0712345678, PIN 1234, streak 12), Brian Otieno
(0723456789, PIN 2345, streak 8), Samuel Njoroge (0734567890, PIN 3456, streak 5).
Each driver: 14 days of TripLogs (Sep 1–14 2026), 4–10 trips/day, fares 200–1500
KSh, mix of Uber/Bolt, some isCash. Sources: mostly gmail_sync/verified, ~15%
manual/reported.
Agreements: John = fixed_daily v1 (1500, Aug 1) then v2 (1800, Sep 1, note
"Updated after fuel price increase", active). Brian = fixed_daily 1800. Samuel =
percentage 30%.
FuelLogs: every 2 days, 2000–3000 KSh, litres, gmail_sync/verified.
Then RUN the reconciliation service over the seeded data with deliberately
mismatched pairs (~10 trips where driverReportedKsh > platformReportedKsh) so the
review queue shows alerts in the exact production format, e.g.:
"KSh 2044 discrepancy on 2026-09-04 for KCA 234B: platform reported KSh 3684,
driver reported KSh 5728."
Mark everything isDemo=true. Seed must be idempotent (wipe demo rows first).
```

---

## PROMPT 9 — Polish + deployment

```
Final pass:
1. Landing page /: Pesly hero (logo, tagline "The money never lies. Now everybody
   can see it.", light/dark emerald design), "Owner" and "Driver" entry buttons,
   a 3-step "how it works" strip, and the honest data-privacy promise.
2. Dark mode across every screen; logo swaps to the light-on-dark variant.
3. Empty states everywhere with a friendly illustration + next action.
4. Toasts for saves/errors. Loading skeletons on tables.
5. Mobile-first QA: every screen usable at 360px width.
6. Deploy config: Vercel + Supabase Postgres, cron endpoints documented in
   vercel.json (every 30 min), .env.example complete.
7. A README.md covering setup, env vars, seeding, and running tests.
```

---

## Notes for Angela (not for Claude Code)

- **Order matters.** Run prompts 0–2 together on day one; 3–5 are the backend days; 6–7 the frontend; 8 proves it works; 9 ships it.
- **The Gmail + LLM parsing (Prompt 4) needs an Anthropic API key** and Google OAuth credentials from Google Cloud Console (free). Set those up before Prompt 4.
- **Costs:** hosting on Vercel free tier + Supabase free tier = KSh 0 to start. You pay only API usage (Anthropic per statement parsed, pennies at pilot scale).
- **What this gets you that Base44 doesn't:** you own 100% of the code, it lives in your GitHub, and you can hire any developer later without platform lock-in. What you lose: Base44's one-click auth/hosting/integrations — you'll manage those yourself.
- The schemas, enum values, alert message format and demo data here are copied from the LIVE production app — if Claude Code builds to this spec, both versions behave identically.
