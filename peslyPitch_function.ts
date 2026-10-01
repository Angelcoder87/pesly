Deno.serve(async (req) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pesly — Investor Pitch</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --black:#030506; --dg1:#03211B; --dteal:#22453F; --mteal:#26544B;
  --sage:#9AB6A7; --mint:#C0D9CB; --smint:#91D0BD;
  --text:#EAF3EE; --mid:#9FB3AA;
}
*{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',sans-serif}
html,body{height:100%;background:var(--black);color:var(--text);overflow:hidden}
h1,h2,h3,.brand{font-family:'Space Grotesk',sans-serif}
canvas#bg{position:fixed;inset:0;z-index:0;opacity:.55}
.veil{position:fixed;inset:0;z-index:1;background:radial-gradient(circle at 20% 15%, rgba(34,69,63,.35), transparent 55%),radial-gradient(circle at 85% 80%, rgba(145,208,189,.12), transparent 50%),linear-gradient(180deg, rgba(3,5,6,.2), rgba(3,5,6,.75) 85%)}
.deck{position:relative;z-index:2;height:100vh;width:100vw;display:flex;align-items:center;justify-content:center}
.slide{display:none;width:100%;max-width:1100px;padding:40px 56px;height:100%;flex-direction:column;justify-content:center;overflow-y:auto}
.slide.on{display:flex;animation:fade .4s ease}
@keyframes fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.kicker{color:var(--smint);font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px}
h1{font-size:60px;line-height:1.05;font-weight:700;letter-spacing:-1px}
h2{font-size:36px;line-height:1.15;font-weight:700;letter-spacing:-.5px;margin-bottom:20px}
h2 span{color:var(--smint)}
.sub{font-size:18px;color:var(--mid);line-height:1.6;max-width:820px}
.tagline{font-size:20px;color:var(--mint);font-weight:500;margin-top:20px;font-family:'Space Grotesk',sans-serif}
.grid{display:grid;gap:16px;margin-top:22px}
.g2{grid-template-columns:1fr 1fr}
.g3{grid-template-columns:1fr 1fr 1fr}
.g4{grid-template-columns:1fr 1fr 1fr 1fr}
.card{background:linear-gradient(160deg, rgba(34,69,63,.55), rgba(3,33,27,.55));border:1px solid rgba(145,208,189,.18);border-radius:14px;padding:20px;backdrop-filter:blur(6px)}
.card h3{font-size:17px;margin-bottom:8px;color:var(--mint);font-family:'Space Grotesk',sans-serif}
.card p{font-size:14px;color:var(--mid);line-height:1.55}
.big{font-size:42px;font-weight:700;color:var(--smint);line-height:1;font-family:'Space Grotesk',sans-serif}
.stat{font-size:12px;color:var(--mid);text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-top:6px}
table{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:16px}
th{color:var(--smint);text-transform:uppercase;font-size:11px;letter-spacing:1px;text-align:left;padding:9px 10px;border-bottom:2px solid rgba(145,208,189,.35)}
td{padding:9px 10px;border-bottom:1px solid rgba(159,179,170,.15);color:var(--text);vertical-align:top}
ul{list-style:none;font-size:14.5px;line-height:1.75;margin-top:6px}
ul li{padding-left:2px}
ul li:before{content:"› ";color:var(--smint);font-weight:800}
.note{font-size:12px;color:var(--mid);margin-top:12px;font-style:italic}
.pill{display:inline-block;background:rgba(145,208,189,.12);color:var(--smint);border:1px solid rgba(145,208,189,.35);border-radius:20px;padding:4px 13px;font-size:11.5px;font-weight:700;letter-spacing:.5px;margin-bottom:12px;margin-right:6px}
.pill.out{background:rgba(159,179,170,.08);color:var(--mid);border-color:rgba(159,179,170,.25)}
.foot{position:fixed;bottom:0;left:0;right:0;z-index:3;display:flex;justify-content:space-between;padding:14px 22px;font-size:11.5px;color:var(--mid);align-items:center}
.foot .brand{font-weight:700;color:var(--smint);letter-spacing:2px}
.progress{position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--mteal),var(--smint));transition:width .3s;z-index:5}
.hint{font-size:12.5px;color:var(--mid);margin-top:26px;opacity:.7}
.two{display:grid;grid-template-columns:1.1fr 1fr;gap:26px;align-items:start}
.badge{display:inline-flex;gap:8px;align-items:center;background:rgba(145,208,189,.08);border:1px solid rgba(145,208,189,.25);border-radius:10px;padding:8px 14px;font-size:13px;margin-top:8px}
.badge b{color:var(--smint)}
.phase-tag{font-size:11px;font-weight:800;letter-spacing:1px;color:var(--black);background:var(--smint);padding:3px 10px;border-radius:6px;display:inline-block;margin-bottom:10px}
.divider{height:1px;background:linear-gradient(90deg, rgba(145,208,189,.4), transparent);margin:16px 0}
@media (max-width:760px){h1{font-size:38px}h2{font-size:26px}.slide{padding:26px 20px}.sub{font-size:15px}.g4,.g3{grid-template-columns:1fr}.two{grid-template-columns:1fr}.g2{grid-template-columns:1fr}table{font-size:11px}}
</style>
</head>
<body>
<canvas id="bg"></canvas>
<div class="veil"></div>
<div class="progress" id="prog"></div>
<div class="deck">

<!-- 1 TITLE -->
<section class="slide on">
  <div class="kicker">Investor Pitch · September 2026 · Nairobi, Kenya</div>
  <h1>Pesly</h1>
  <p class="tagline">Fleet-Owner Earnings Intelligence for Kenya's Ride-Hailing Economy</p>
  <p class="sub" style="margin-top:24px">A daily WhatsApp logging habit that gives drivers their true earnings for free — and gives fleet owners the fleet-level visibility they've never had, for a monthly fee per car.</p>
  <p class="hint">Prepared by Angela Odhiambo &nbsp;·&nbsp; → arrow keys / swipe to navigate</p>
</section>

<!-- 2 EXEC SUMMARY -->
<section class="slide">
  <div class="kicker">Executive Summary</div>
  <h2>A large, invisible fact about Nairobi's ride-hailing fleet.</h2>
  <p class="sub">A large share of Uber, Bolt and Little Cab vehicles are not driven by their owners. One owner often holds 3–10 cars, hires drivers, and manages the whole operation through WhatsApp check-ins, memory, and trust — with no way to see what any car truly earns after fuel and running costs.</p>
  <div class="divider"></div>
  <p class="sub">Pesly solves this with one daily habit — trip logging on WhatsApp, the platform drivers already live in — that feeds two views of the same data: a <b style="color:var(--text)">free</b> earnings view for the driver, and a <b style="color:var(--text)">paid</b>, fleet-level dashboard for the owner.</p>
  <div class="badge">📊 <b>50 owners × 6 cars (300 vehicles)</b> at KSh 400–600/car/mo → <b>KSh 120,000–180,000 MRR</b> from the owner side alone — before driver or lender revenue.</div>
  <p class="note">No licensing, no insurance partnerships, no lending, no handling of anyone's money — deliberately narrow at launch.</p>
</section>

<!-- 3 PROBLEM -->
<section class="slide">
  <div class="kicker">The Problem</div>
  <h2>The pain is real money, <span>not inconvenience.</span></h2>
  <div class="grid g2">
    <div class="card">
      <h3>Owners fly blind</h3>
      <p>Fuel skimming, unlogged cash trips, unauthorized private use, zero comparison across cars — every vehicle is its own black box. Owners are absent day-to-day and depend entirely on the driver's own reporting.</p>
    </div>
    <div class="card">
      <h3>Drivers fly blind too</h3>
      <p>Even a driver grossing KSh 60,000–120,000/month across multiple apps and payment types has no clear true-earnings picture — and no portable record of that income for a bank, SACCO, or asset financier.</p>
    </div>
  </div>
  <div class="badge" style="margin-top:20px">💸 A conservative <b>KSh 300/day leak per car</b> compounds to roughly <b>KSh 9,000/month, per vehicle</b> — and owners in this segment usually run several cars at once.</div>
  <p class="note">Today's only tools: phone calls, spot checks, and trust. No affordable, purpose-built dashboard exists for this owner.</p>
</section>

<!-- 4 MARKET -->
<section class="slide">
  <div class="kicker">Market Context</div>
  <h2>A sector large enough, <span>a segment worth sizing directly.</span></h2>
  <div class="grid g3">
    <div class="card"><div class="big">~1.5M</div><div class="stat">gig-economy jobs nationally (2025 Ipsos/Bolt-commissioned)</div><p style="margin-top:8px">Ride-hailing is the second-largest gig category, behind e-commerce.</p></div>
    <div class="card"><div class="big">200K+</div><div class="stat">registered Little drivers in Kenya</div><p style="margin-top:8px">Little trails Uber and Bolt in headcount — a signal of how large the combined driver population likely is.</p></div>
    <div class="card"><div class="big">KSh 60K+</div><div class="stat">typical full-time monthly gross (Nairobi)</div><p style="margin-top:8px">Before fuel, maintenance and running costs — the exact figures owners can't verify and drivers can't cleanly track.</p></div>
  </div>
  <p class="note" style="margin-top:16px">Multi-car ownership is a well-known structural feature of the market but not separately published by any platform. Pesly's own field validation (Section 9) is designed to size this segment directly, rather than lean on platform-level averages. All figures above are context for addressable population — not validated demand for Pesly itself.</p>
</section>

<!-- 5 SOLUTION -->
<section class="slide">
  <div class="kicker">The Solution</div>
  <h2>One data pipeline. <span>Two honest interfaces.</span></h2>
  <p class="sub">The driver logs each trip in seconds, through WhatsApp, in the app he already uses all day. That single action feeds a free true-earnings view for him, and a paid fleet dashboard for his owner — from the same underlying data.</p>
  <div class="badge" style="margin-top:20px">🤝 <b>Why it doesn't fight itself:</b> the driver's own reason to log — building his true-earnings picture and, eventually, a portable income record — produces exactly the data the owner is paying to see. Neither side has to be persuaded against its own interest.</div>
</section>

<!-- 6 DRIVER INTERFACE -->
<section class="slide">
  <div class="kicker">4.1 — Driver Interface</div>
  <h2>Free at launch. <span>Free by design.</span></h2>
  <ul>
    <li>Trip logging via a single WhatsApp message — fare, distance and time in one line, no new app to install</li>
    <li>A running true-earnings view: gross fares minus fuel and running costs, in real terms — not just an app-reported gross figure</li>
    <li>A visible logging streak — a reason to log consistently, since the streak is what makes his eventual income record credible</li>
    <li><span class="phase-tag">Phase 2 · optional · paid</span><br>A downloadable monthly earnings statement or verified income record, usable when applying for a loan, asset finance, or SACCO membership</li>
  </ul>
  <p class="note">Logging stays free permanently at the basic level — this is the compliance the entire owner dashboard depends on.</p>
</section>

<!-- 7 OWNER INTERFACE -->
<section class="slide">
  <div class="kicker">4.2 — Owner Interface</div>
  <h2>Paid, <span>from day one.</span></h2>
  <ul>
    <li>A live, fleet-level dashboard: what each car truly earned, over any day, week, or month</li>
    <li>Fuel cost per trip and per car — to catch discrepancies between claimed and actual spend</li>
    <li>Driver-versus-driver comparison across the owner's whole fleet</li>
    <li>Weekly summary reports and alerts: a sudden drop in logged trips, a reporting gap, a cost spike</li>
    <li>Transparent data-completeness indicators — e.g. "4 of 6 drivers logged today" — so the dashboard never overstates its own reliability</li>
  </ul>
</section>

<!-- 8 MVP SCOPE -->
<section class="slide">
  <div class="kicker">Product & MVP Scope</div>
  <h2>Deliberately narrow. <span>Deliberately cheap to run.</span></h2>
  <div class="two">
    <div>
      <h3 style="color:var(--mint);margin-bottom:10px">Out of scope at launch</h3>
      <span class="pill out">No ride-hailing / dispatch</span>
      <span class="pill out">No money handling</span>
      <span class="pill out">No insurance or lending</span>
      <span class="pill out">No SACCO / licensing role</span>
      <p class="note" style="margin-top:12px">Keeps the MVP outside Kenya's financial-services and transport-licensing regulatory perimeter — and keeps build and running costs low.</p>
    </div>
    <div>
      <h3 style="color:var(--mint);margin-bottom:10px">MVP components</h3>
      <ul>
        <li>Existing trip/earnings tracker, extended with a linking code so a driver can attach logs to an owner's fleet account</li>
        <li>One owner-facing web dashboard: per-car earnings, fuel cost/trip, driver comparison, weekly report, completeness indicators</li>
        <li>WhatsApp-based logging flow — one message per trip</li>
      </ul>
      <p class="note" style="margin-top:12px">Suggested stack: React/Vite/Tailwind PWA (owner dashboard) · Node/Express/PostgreSQL backend · WhatsApp Business API for driver logging.</p>
    </div>
  </div>
</section>

<!-- 9 BUSINESS MODEL -->
<section class="slide">
  <div class="kicker">Business Model — 3 Phases</div>
  <h2>Owner revenue first. <span>Everything else is upside.</span></h2>
  <div class="grid g3">
    <div class="card">
      <span class="phase-tag">Phase 1 · Months 1–6</span>
      <h3>Owner subscription</h3>
      <p>The only revenue line at launch. <b style="color:var(--text)">KSh 400–600/car/month</b>, paid by the owner as a business expense against a known, quantifiable loss. Driver logging stays completely free — protecting the compliance the model depends on.</p>
    </div>
    <div class="card">
      <span class="phase-tag">Phase 2 · ~Month 6+</span>
      <h3>Driver premium (optional)</h3>
      <p><b style="color:var(--text)">KSh 50–100/month</b> for a downloadable/verified income-record export. Introduced only after multi-month logging habits exist — never a gate on basic logging. Adoption assumed conservatively at 20–30% of active drivers.</p>
    </div>
    <div class="card">
      <span class="phase-tag">Phase 3 · 12+ months out</span>
      <h3>Lender data access</h3>
      <p>Once verified 6–12 month logging histories exist, lenders/SACCOs/asset-financiers pay a data-access fee — strictly with each driver's informed, revocable consent. Not required for the core business to work.</p>
    </div>
  </div>
</section>

<!-- 10 GTM -->
<section class="slide">
  <div class="kicker">Go-to-Market Strategy</div>
  <h2>Validate first. <span>Grow through referrals.</span></h2>
  <div class="grid g2">
    <div class="card">
      <h3>7.1 — Validate before building further</h3>
      <p>5–10 structured conversations with real fleet owners (current tracking method, estimated leakage, price reaction) and with drivers who work for them (logging willingness, whether a portable income record has real value today).</p>
    </div>
    <div class="card">
      <h3>7.2 — Initial distribution</h3>
      <p>Direct relationship sales into existing fleet-owner/driver WhatsApp and Facebook groups — already the industry's informal network. One free-trial car per prospective owner. Owner referrals once 3–5 reference owners are live.</p>
    </div>
  </div>
  <div class="card" style="margin-top:16px">
    <h3>7.3 — Retention mechanics</h3>
    <p>Weekly automated reports keep the dashboard visibly earning its fee, rather than becoming a forgotten login. Transparent completeness indicators build trust rather than let data gaps go unexplained.</p>
  </div>
</section>

<!-- 11 COMPETITIVE -->
<section class="slide">
  <div class="kicker">Competitive Landscape</div>
  <h2>Purpose-built for a buyer <span>nobody else is serving.</span></h2>
  <table>
    <tr><th>Alternative</th><th>What it offers</th><th>Why Pesly is different</th></tr>
    <tr><td><b>WhatsApp check-ins</b> (status quo)</td><td>Free, familiar, zero setup</td><td>No structured data, no cross-car comparison, fully dependent on driver honesty</td></tr>
    <tr><td><b>Platform driver apps</b></td><td>Trip/payment records, per platform</td><td>No consolidated cross-platform, cross-driver view; not fleet-oriented</td></tr>
    <tr><td><b>Fleet-management software</b></td><td>Vehicle tracking, maintenance logs</td><td>Built for large corporate fleets, priced for a different buyer</td></tr>
    <tr><td><b>Manual spreadsheets</b></td><td>Free, fully custom</td><td>Entirely manual; no driver-side incentive to keep it current</td></tr>
  </table>
</section>

<!-- 12 VALIDATION -->
<section class="slide">
  <div class="kicker">9 — Validation Plan (Pre-Build Checklist)</div>
  <h2>What gets confirmed <span>before scaling spend.</span></h2>
  <ul>
    <li>Confirm owners' willingness to pay KSh 400–600/car/month, and identify who actually makes the spending decision (owner vs. fleet manager)</li>
    <li>Confirm drivers will log trips consistently and honestly, knowing an owner-facing dashboard sits on the same data</li>
    <li>Identify a realistic first pilot owner (ideally 3+ cars) willing to run a free trial for 4–6 weeks</li>
    <li>Check with at least one or two Kenyan SACCOs or digital lenders whether a self-reported income record like this would carry weight in a lending decision — this determines whether Phase 2/3 are realistic at all</li>
  </ul>
</section>

<!-- 13 FINANCIALS -->
<section class="slide">
  <div class="kicker">Financial Projections (planning estimates, not forecasts)</div>
  <h2>Owner subscription is the <span>larger, more reliable lever.</span></h2>
  <table>
    <tr><th>Period</th><th>Owners</th><th>Cars</th><th>Price/car/mo</th><th>Owner MRR</th><th>Driver premium MRR</th><th>Total MRR</th></tr>
    <tr><td>Months 1–3 (pilot)</td><td>5–10</td><td>30–50</td><td>KSh 400</td><td>KSh 12,000–20,000</td><td>—</td><td>KSh 12,000–20,000</td></tr>
    <tr><td>Months 4–6 (early traction)</td><td>20</td><td>120</td><td>KSh 400</td><td>KSh 48,000</td><td>—</td><td>KSh 48,000</td></tr>
    <tr><td>Months 7–12 (scale)</td><td>50</td><td>300</td><td>KSh 500</td><td>KSh 150,000</td><td>—</td><td>KSh 150,000</td></tr>
    <tr><td>Months 13–18 (Phase 2 added)</td><td>50+</td><td>300+</td><td>KSh 500–600</td><td>KSh 150,000–180,000</td><td>KSh 6,000–9,000</td><td>KSh 156,000–189,000</td></tr>
  </table>
  <p class="note">A KSh 100–200 increase in per-car price outweighs the entire projected driver-premium contribution — without adding risk to logging compliance. Phase 3 revenue is intentionally excluded until verified records and lender interest exist.</p>
</section>

<!-- 14 RISKS -->
<section class="slide">
  <div class="kicker">Risks & Mitigations</div>
  <h2>The known failure modes, <span>named upfront.</span></h2>
  <table>
    <tr><th>Risk</th><th>Mitigation</th></tr>
    <tr><td>Drivers under-report despite free logging</td><td>Single-message logging; visible streak tied to future record value; gaps shown to owners, not hidden</td></tr>
    <tr><td>Owners don't convert from free WhatsApp habits</td><td>Free single-car trial; lead with the quantified leakage figure; weekly proof-of-value reports</td></tr>
    <tr><td>KSh 400–600 price point is untested</td><td>Validate directly with 5–10 owners before wide rollout</td></tr>
    <tr><td>Driver premium undermines compliance if too early</td><td>Delay Phase 2 to ~month 6+; strictly opt-in, never a gate</td></tr>
    <tr><td>"Verified" record overstates self-reported data</td><td>Market honestly as self-reported earnings history until independent verification exists</td></tr>
    <tr><td>Owner–driver disputes over reported numbers</td><td>Publish a clear dispute-handling policy before it happens in production</td></tr>
  </table>
</section>

<!-- 15 REGULATORY -->
<section class="slide">
  <div class="kicker">Regulatory Considerations</div>
  <h2>Outside the perimeter, <span>on purpose.</span></h2>
  <div class="grid g2">
    <div class="card"><h3>Data Protection Act (Kenya)</h3><p>Driver and owner data handled under registered data-controller obligations, with clear consent required for any data shared with third parties — notably the Phase 3 lender-access layer.</p></div>
    <div class="card"><h3>No transport-licensing exposure</h3><p>Pesly doesn't dispatch rides, set fares, or operate vehicles — stays outside NTSA digital-taxi-hailing licensing that applies to platforms like Uber, Bolt and Little.</p></div>
    <div class="card"><h3>No financial-services licensing at launch</h3><p>Pesly never holds, moves or lends money. Re-examine only if/when Phase 3 lender partnerships are pursued.</p></div>
    <div class="card"><h3>Trademark</h3><p>A KIPI trademark filing for the Pesly name/brand is worth completing early and cheaply, before wider public launch.</p></div>
  </div>
</section>

<!-- 16 ROADMAP -->
<section class="slide">
  <div class="kicker">Roadmap</div>
  <h2>18 months, <span>validation-first.</span></h2>
  <table>
    <tr><th>Timeframe</th><th>Milestone</th></tr>
    <tr><td>Month 0–1</td><td>Owner/driver validation interviews; finalize linking-code MVP scope</td></tr>
    <tr><td>Month 1–3</td><td>Build owner dashboard MVP; pilot with 1–2 owners, free trial</td></tr>
    <tr><td>Month 3–6</td><td>Paid rollout to 20+ owners; refine pricing from real conversion data</td></tr>
    <tr><td>Month 6–9</td><td>Scale to 50 owners / ~300 cars; introduce optional driver premium tier</td></tr>
    <tr><td>Month 9–18</td><td>Explore Phase 3 lender/financier conversations once verified multi-month records exist</td></tr>
  </table>
</section>

<!-- 17 FUNDING ASK -->
<section class="slide">
  <div class="kicker">Funding Ask & Use of Funds</div>
  <h2>KSh 1.5–3M <span>for a 12-month runway.</span></h2>
  <p class="sub">Target: reach Phase 1 scale (50 owners / 300 cars). To be refined once Section 9 validation confirms conversion assumptions.</p>
  <div class="grid g4" style="margin-top:22px">
    <div class="card"><div class="big">40%</div><div class="stat">Engineering & product</div><p style="margin-top:6px">Dashboard build, WhatsApp integration, hosting</p></div>
    <div class="card"><div class="big">30%</div><div class="stat">Field sales & onboarding</div><p style="margin-top:6px">Relationship-based, ground presence</p></div>
    <div class="card"><div class="big">20%</div><div class="stat">Working capital</div><p style="margin-top:6px">Operating buffer</p></div>
    <div class="card"><div class="big">10%</div><div class="stat">Legal & compliance</div><p style="margin-top:6px">Trademark, data-protection setup</p></div>
  </div>
</section>

<!-- 18 ABOUT / CLOSE -->
<section class="slide">
  <div class="kicker">About</div>
  <h2>Built by someone who <span>watched this problem happen.</span></h2>
  <p class="sub">Pesly is founded by Angela Odhiambo, a Nairobi-based frontend developer and UI/UX designer with a BSc in Computer Science from the University of the People. The idea is grounded in direct observation of how Nairobi's ride-hailing fleet ownership actually works, and is being developed toward grant and competition funding as an early-stage, pre-build venture.</p>
  <div class="divider"></div>
  <h1 style="font-size:44px;margin-top:10px">Every car has a number.<br><span style="color:var(--smint)">Pesly makes it visible.</span></h1>
  <p class="hint" style="margin-top:30px">Thank you · Pesly · Nairobi, Kenya · September 2026</p>
</section>

</div>
<div class="foot"><div class="brand">PESLY</div><div id="counter">1 / 18</div><div>← → navigate</div></div>
<script>
const slides=[...document.querySelectorAll('.slide')];let i=0;
function show(n){slides[i].classList.remove('on');i=(n+slides.length)%slides.length;slides[i].classList.add('on');
document.getElementById('counter').textContent=(i+1)+' / '+slides.length;
const p=Math.round((i+1)/slides.length*100);document.getElementById('prog').style.width=p+'%';}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown')show(i+1);
if(e.key==='ArrowLeft'||e.key==='PageUp')show(i-1);});
let sx=0;document.addEventListener('touchstart',e=>sx=e.touches[0].clientX);
document.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(d<-50)show(i+1);if(d>50)show(i-1);});
show(0);

// animated futuristic background — moving particle network in the brand palette
const canvas=document.getElementById('bg');const ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
resize();addEventListener('resize',resize);
const COLORS=['#22453F','#26544B','#9AB6A7','#91D0BD'];
const N=Math.min(70,Math.floor(innerWidth/22));
const pts=Array.from({length:N},()=>({
  x:Math.random()*canvas.width, y:Math.random()*canvas.height,
  vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
  r:Math.random()*1.6+0.6, c:COLORS[Math.floor(Math.random()*COLORS.length)]
}));
function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const p of pts){
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>canvas.width)p.vx*=-1;
    if(p.y<0||p.y>canvas.height)p.vy*=-1;
  }
  for(let a=0;a<pts.length;a++){
    for(let b=a+1;b<pts.length;b++){
      const dx=pts[a].x-pts[b].x, dy=pts[a].y-pts[b].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<140){
        ctx.strokeStyle='rgba(145,208,189,'+(0.12*(1-d/140))+')';
        ctx.lineWidth=1; ctx.beginPath();
        ctx.moveTo(pts[a].x,pts[a].y); ctx.lineTo(pts[b].x,pts[b].y); ctx.stroke();
      }
    }
  }
  for(const p of pts){
    ctx.beginPath(); ctx.fillStyle=p.c; ctx.globalAlpha=.8;
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  }
  requestAnimationFrame(tick);
}
tick();
</script>
</body>
</html>
`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
});