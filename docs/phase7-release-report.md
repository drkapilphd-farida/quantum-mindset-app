# Phase 7 — checkout, tracking and final QA

Branch: `site-rebuild`. Nothing is merged or deployed. Part E (deploy) waits
for "CONFIRM DEPLOY".

## Checkout

Every paid button now reads its link from the programs registry
(`src/config/site.config.ts`). Pages no longer import payment constants
directly. That covers the retreat, Overthinking Reset, Sharp Brain paywall and
app banners, the starter unlock and the Executive workshop.

| Product | Price shown on site | Button target | Status |
|---|---|---|---|
| Sharp Brain 30-Day Program | ₹9,999 one-time | `rzp.io/rzp/ydVYaANF` (fixed ₹9,999) | **Needs action:** Razorpay shows the product as "Advanced Neuro-Cognitive Transformation Program" plus "Qsr". Rename it to "Sharp Brain 30-Day Program". |
| Sharp Brain Workshop | "Price shared on request" | WhatsApp: "…the next Sharp Brain Workshop." | **Needs action:** price + payment link (TODO) |
| Sharp Brain Self-Learning | "Price shared on request" | WhatsApp: "…Sharp Brain Self-Learning." | **Needs action:** price + payment link (TODO) |
| Sharp Brain for Schools | On request | /corporate#schools, form + WhatsApp | OK |
| Sharp Brain 7-Day Free Starter | Free (Days 1–7), ₹99 (Days 8–21) | Free: `habit.mindurmind.org.in/signup…`; ₹99: `rzp.io/rzp/vecVC7sx` (in the app only) | **Needs action:** the ₹99 Razorpay link's description is "Habit Builder". Rename it to "Sharp Brain 21-Day Starter (Days 8–21)". |
| 21-Day Overthinking Reset | ₹499 / ₹999 | Classplus `zqdlz.courses.store/860167` | **Needs action:** Classplus course title is "21-Day Mind Reset System". Rename it to match. |
| 1-on-1 Mind Coaching | Custom 7/14/21-day packages, no price | WhatsApp: "…apply for 1-on-1 Mind Coaching…" | OK |
| 11-Day Online Deep Meditation Retreat | ₹6,999 | `razorpay.me/@mindurmindacademy` (payer types the amount) | **Needs action:** create a fixed ₹6,999 Razorpay Payment Page. Retire `rzp.io/rzp/ULFp3DJ` (still titled "11 Days Online Retreat" at ₹9,999). It is no longer linked anywhere on the site. |
| Residential Meditation Retreats | ₹35,000 sharing / ₹45,000 private | WhatsApp: "…secure my seat…" | OK (seats confirmed personally) |
| Executive Brain Performance Workshop | ₹4,999 / ₹7,999 / ₹29,999 (+ GST) | `razorpay.me/@mindurmindacademy` (payer types the amount), then "Confirm on WhatsApp" | **Needs action (recommended):** one fixed-amount payment page per plan |
| Franchise & Trainer Partner | On request | WhatsApp: "…certified Sharp Brain trainer partner." | OK |
| Corporate / schools enquiry | On request | Form (no endpoint set, so it opens WhatsApp with the form details) + WhatsApp | OK. Add `corporateFormEndpoint` only if you want form emails. |
| Mind Ur Mind App subscriptions | ₹399 / ₹699 per month | Razorpay subscription links on /pricing | Parked: /pricing is noindex and not linked from public pages |

**Refund guarantee wording:** the guarantee is written once (`qsrGuarantee` in
site.config). The refund policy page, the Sharp Brain page (guarantee box and
FAQ), the homepage FAQ and the speed-test badge all render that same text, and
the request window matches: 7 days after Day 30. The policy page's last two old
names ("30-Day Live Program", "Focus & Reading Starter") now come from the
registry.

## Tracking

- **IDs** come from `analytics` in site.config. Both are empty (TODO), so no
  GA4 or Meta Pixel script loads, and there are no placeholder IDs. The live
  site loads neither today.
- **Site-wide tracker** (`ConversionTracker` in the root layout) sends every
  event to both Meta and GA4:
  - `ViewContent` / `view_item` on every program page;
  - `InitiateCheckout` / `begin_checkout` on any Razorpay or Classplus link;
  - `Lead` / `generate_lead` on any WhatsApp link, on starter sign-up, on the
    corporate form submit and when a free test starts (speed test, overthinking
    test).
  - `content_name` is always the public registry name, e.g. "Sharp Brain 30-Day
    Program", "Sharp Brain 7-Day Free Starter".
- **Removed:** the Executive page's own pixel and its duplicate
  InitiateCheckout calls. The "Reserve my seat" buttons only scroll to pricing;
  they are no longer counted as checkouts.
- **UTM:** the first utm_* tags of the session are kept (sessionStorage) and
  added to every WhatsApp pre-filled message (never twice) and to the corporate
  form payload.
- **CSP** now allows GA4's regional hosts.
- **Privacy policy:** new "Cookies, analytics and advertising pixels" section
  (GA4, Meta Pixel, UTM handling, opt-outs). Google and Meta are listed as
  third parties.

## QA

| # | Check | Result |
|---|---|---|
| 11 | No `localhost` in rendered pages; unique title, description and canonical on every page; OG image on every page; one H1 | **Pass** (20 pages + 404). /about and /corporate now have their own OG images. |
| 12 | Banned words, EN + HI, all sitemap pages (text, alt/aria/meta, links, JSON-LD) | **Pass after fixes:** "Advanced Focus Flow & Intuition" → "…& Attention" (habit builder); "100% safe & encrypted" → "Safe and encrypted" (online retreat). Allowed uses are listed below. |
| 13 | Sharp Brain page promises nothing the app lacks | **Pass**: `docs/sharp-brain-deferred-claims.md` stays deferred |
| 14 | Redirects | **Pass:** all old QSR, lab, exercise and preview URLs return one 301 to the new URL. `/prefrontal-power-mumbai` → 301 `/executive-brain-workshop`. Sitemap has 0 old URLs, and robots.txt points to the sitemap. Lab pages then ask for login (expected). |
| 15 | Only verified testimonials visible | **Pass**: none of the 13 named testimonials appear (verified list is empty) |
| 16 | Every CTA, WhatsApp link and payment link works | **Pass:** 25 internal targets all 200; every external and payment link 200; every WhatsApp link has a pre-filled message (the bare links on /privacy and /refund-policy were fixed) |
| 17 | Lighthouse mobile ≥ 90 | **Partial:** accessibility 96–100, best practices 100, SEO 100 — pass. Performance 79–83 — **fail** (see below). |
| 18 | 360 / 768 / 1440 px, EN + HI | **Pass**: 126 page loads, one H1 each, no sideways scroll, no page errors |
| 19 | 404 page | **Pass**: new site-styled 404 (EN/HI) with homepage, every program, free tests and WhatsApp; returns 404, noindex |
| 20 | Unit tests | **Pass**: 4,939 passed; only the 2 known progress-unlock failures (`getModuleProgress.test.ts`), nothing new |

### Allowed "Quantum" / "midbrain" / "100%" occurrences

- `/`, `/about`, `/programs/sharp-brain`: "From earlier batches (the program was
  then called Quantum Speed Reading)" (EN/HI).
- `/programs/sharp-brain`:
  - FAQ "What happened to Quantum Speed Reading?" (EN/HI, also in the FAQ
    JSON-LD);
  - FAQ "Is this midbrain activation or blindfold reading?" (EN/HI, JSON-LD).
- `/franchise-individual`: the partner line "The program you know as Quantum
  Speed Reading is now Sharp Brain™…" and the "from earlier batches" label
  (EN/HI).
- `/programs/sharp-brain`, `/refund-policy`, `/terms`: "100% Results
  Guarantee" (the refund guarantee).
- Images (can't be text-scanned): five old video thumbnails show "QUANTUM
  SPEED READING DEMONSTRATION". You are replacing them on YouTube (offline
  checklist).

### Lighthouse (mobile, simulated slow 4G), before → after the fixes

| Page | Perf | A11y | Best pr. | SEO | LCP |
|---|---|---|---|---|---|
| / | 67 → **82** | 93 → **96** | 100 | 100 | 6.3 → 4.7 s |
| /programs/sharp-brain | 77 → **80** | 93 → **97** | 100 | 100 | 6.2 → 4.9 s |
| /executive-brain-workshop | 68 → **82** | 96 → **96** | 100 | 100 | 6.3 → 4.6 s |
| /mentoring/overthinking-course | 76 → **79** | 92 → **96** | 100 | 100 | 6.1 → 4.9 s |
| /about | 80 → **82** | 93 → **100** | 100 | 100 | 5.3 → 4.6 s |
| /corporate | 82 → **83** | 93 → **100** | 100 | 100 | 5.1 → 4.6 s |

**Fixes applied:**
- Only the main body font is preloaded (about 250 KB of font preloads
  removed, including a 119 KB Devanagari file English visitors never use).
- Small grey, gold and teal text darkened to WCAG AA.
- Executive page grey labels darkened.
- Footer phone and email links made easier to tap.

Performance is still below 90 on all six pages.

**Remaining, larger items:**
- About 100 KB of client JavaScript comes from the bilingual copy file
  (`src/lib/i18n.ts`) shipped to every page.
- Several sections are client components.
- Splitting these is a bigger refactor. Recommended after launch.
