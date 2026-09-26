# Site Inventory — mindurmind.org.in (Phase 1, read-only)

Generated on branch `site-rebuild` (baseline commit `3ff66f7`, no page content changed). This document is pure inventory — it records exactly what exists today; it does not recommend or make any changes.

## 0. Framework, routing, shared components, assets

**Stack**: Next.js 15.5.19 (App Router), React 19.1.0, TypeScript 5 (strict), Tailwind CSS v4, Supabase (`@supabase/ssr` 0.12, `@supabase/supabase-js` 2.108.2), `@anthropic-ai/sdk` 0.106, Stripe 22.3 (legacy courses checkout only), TanStack Query 5.101, Zustand 5, nuqs 2.8, React Hook Form 7.80 + Zod 4.4, Vitest 4.1 + Playwright 1.61.

**Routing**: 194 total `page.tsx` files; 184 export `metadata` (or `generateMetadata`), 10 have no metadata export at all. Route groups: `(marketing)`, `(dashboard)`, `(auth)`, `(admin)`, plus many top-level segments outside any group (`labs/*`, `preview/*`, `partner-admin/*`, `school-admin/*`, `retreats/*`, `mentoring/*`, `programs/*`, `discover-learning-potential/*`, `welcome/*`, `assessments/*`).

**Domain-split architecture**: one Next.js deployment serves multiple hostnames via `src/middleware.ts` + `src/lib/domains/appDomain.ts`'s `resolveAppDomain()` — `habit.mindurmind.org.in` routes to the Habit Builder journey app, every other hostname (including `www.mindurmind.org.in`) defaults to the main marketing/app surface.

**Central bilingual copy source**: `src/lib/i18n.ts` — 5,151 lines, one large English block followed by a structurally-mirrored Hindi block. This is the single biggest source of rendered marketing copy on the site and is where nearly every bio/credential/pricing/testimonial string referenced below actually lives.

**Shared components** (header/footer/bio/testimonials/pricing):
- `src/components/Navbar.tsx` — sitewide header/nav
- `src/components/Footer.tsx` — sitewide footer (has its own program-name links, see §3)
- `src/components/HeroSection.tsx` — homepage hero (credentials strip, stats)
- `src/components/HomeGuideSection.tsx`, `src/components/GuideProfileCard.tsx` — "Meet the Founder" bio card, reused across `/about`, `/mentoring/personal-class`, `/mentoring/overthinking-course`
- Per-program trainer-bio components: `PrefrontalPowerTrainer.tsx`, `MentoringGuide.tsx`, `ExecutiveWorkshopTrainer.tsx`, `MindResetGuide.tsx`, various `*Hero.tsx` files
- `src/components/Testimonials.tsx`, `src/components/HeroTestimonialBadge.tsx` — shared testimonial pool consumers (see §5)
- `src/features/pricing/components/PricingPlansGrid.tsx` — subscription pricing grid (`/pricing`)
- `src/components/HomeExecutiveWorkshopFeature.tsx`, `src/components/HomeCorporateWorkshopStrip.tsx`, `src/components/HomePrefrontalPowerFeature.tsx`, `src/components/HomeHabitBuilderFeature.tsx`, `src/components/ProgramCardsGrid.tsx` — homepage program-positioning blocks

**Assets folder** (`public/`, 38 top-level entries): founder photos (`FOUNDER.JPG`, `founder-warm.jpg`, `dr-kapil-about.png`, `dr-kapil-coaching.png`, `dr-kapil-founder.png`, `dr-kapil-home-hero.png`, `dr-kapil-home-hero-portrait.png`, `dr-kapil-learning.png`, `dr-kapil-mentor.png`, `dr-kapil-prefrontal-hero-portrait.png`, `dr-kapil-dev-sharma-executive..png` — this last one is a known byte-identical duplicate, left untouched/untracked), Habit Builder showcase screenshots (`habit_*_clean.png`, `habit_builder_homepage_showcase.png`), 3 franchise trainer WhatsApp-testimonial screenshots (`trainer_testimonial_*_whatsapp.jpg`), `brainwave-science.png`, plus directories `assets/`, `datasets/`, `fonts/`, `icons/`, `images/`, `podcast-videos/`, `prefrontal-power-videos/`, `qsr-videos/`, `retreat-videos/`, `tratak/`, `manifest.json`, `sw.js`, and the default Next.js SVGs (unused: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).

---

## 1. Route-by-route metadata inventory

### 1.1 Global defaults (`src/app/layout.tsx`)
- `title.template`: `'%s | Quantum Mind'` — any page with a plain-string title gets `| Quantum Mind` appended; pages needing to suppress this use `title: { absolute: '...' }`.
- `title.default`: `'Quantum Mind'`
- Site-wide default `description` (inherited by any page that sets no description of its own): *"AI-powered adaptive learning platform. Master in-demand skills with personalized courses and intelligent tutoring."*
- `metadataBase`: `new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000')`
- Default `openGraph`: `{ type: 'website', siteName: 'Quantum Mind', title: 'Quantum Mind', description: <same as above>, url: appUrl }` — **no `images` field**, and no `opengraph-image.tsx` / `twitter-image.tsx` route file exists anywhere, and no static `/og-image.png` exists in `public/`. Any page without its own `openGraph.images` has **no OG image at all**.
- Default `twitter`: `{ card: 'summary_large_image', title: 'Quantum Mind', description: <same> }` — same "no image" situation.
- No nested layout in any route group overrides `title.template` or defines its own `metadata`.

`src/app/robots.ts`: `allow: '/'`, `disallow: ['/admin/', '/dashboard/', '/settings/', '/progress/', '/practice/', '/api/']`. Not disallowed despite being gated: `/preview/*`, `/partner-admin/*`, `/school-admin/*`, `/labs/*`, `/welcome/*`, `/discover-learning-potential/*`, `/mentoring/*`, `/retreats/*`, `/masterclasses`, `/document-studio`, `/parent-dashboard`, `/library/[id]`.

`src/app/sitemap.ts`: only emits `{appUrl}/`, `{appUrl}/courses`, and one entry per published Supabase `courses` row. Nothing else — no `/programs/*`, `/retreats/*`, `/mentoring/*`, `/about`, `/contact`, legal pages, etc.

### 1.2 `(marketing)` route group

| Route | Title | Description | Canonical | OG Title | OG Desc | OG URL | OG Image |
|---|---|---|---|---|---|---|---|
| `/` | `{ absolute: 'Quantum Speed Reading for Exam Success \| Mind Ur Mind' }` | "Read faster, retain more, and prepare smarter for exams. Trusted speed reading masterclass by Dr. Kapil Dev Sharma — 10,000+ students since 2015." | `/` | same as title | same as description | `/` | none |
| `/courses` (legacy) | `'Course Catalog'` | "Browse AI-powered learning courses." | inherit | inherit | inherit | inherit | none |
| `/courses/[slug]` (legacy) | dynamic: course title or `'Course'` | course's own description or none | none | dynamic title | dynamic desc, `type: 'article'` | inherit | dynamic: `course.thumbnail_url` if present |
| `/courses/[slug]/lessons/[lessonSlug]` | dynamic: lesson title or `'Lesson'` | inherit | inherit | inherit | inherit | inherit | inherit |
| `/pricing` (legacy) | `'Pricing — Quantum Mind Learning Lab™'` | "The Foundation, Individual Growth, Genius Family Lab, and Institutional plans for Quantum Mind Learning Lab™." | inherit | inherit | inherit | inherit | inherit |
| `/reviews` (legacy) | `'Success Stories'` | "200+ real student video reviews of the 30-Day Quantum Speed Reading Mastery + Live Cohort." | inherit | inherit | inherit | inherit | inherit |
| `/certificates/[token]` (legacy) | dynamic: `Certificate — ${cert.course_title}` or `'Certificate Not Found'` | inherit | inherit | inherit | inherit | inherit | inherit |

### 1.3 `(dashboard)` route group (auth-gated)

| Route | Title | Description |
|---|---|---|
| `/dashboard` | `'Transformation Dashboard'` | inherit |
| `/document-studio` | `'Document Mastery Studio'` | inherit |
| `/labs/quantum-speed-reading/journey/[day]` | `'Quantum Mindset & Habit Builder™'` | "An adaptive, week-by-week guided daily session across Reading, Intuition, Right Brain, and Visualisation." |
| `/labs/quantum-speed-reading/journey/analytics` | `'Analytics Dashboard™ — Quantum Mindset & Habit Builder™'` | "Your habit completion rate, streak, consistency, and Mind Score breakdown." |
| `/labs/quantum-speed-reading/journey/certificate` | `'Your Completion Certificate™ — Quantum Mindset & Habit Builder™'` | "Your official Quantum Mindset & Habit Builder™ completion certificate." |
| `/labs/quantum-speed-reading/thirty-day-curriculum` | `'30-Day Quantum Speed Reading Mastery Curriculum — Quantum Speed Reading Lab™'` | inherit |
| `/library/[id]` | `'Document'` | inherit |
| `/masterclasses` | `'Live Masterclasses & Mentorship'` | inherit |
| `/parent-dashboard` | `'Parents Dashboard'` | inherit |
| `/practice` | `'Practice'` | inherit |
| `/progress` | `'Mind Score™'` | inherit |
| `/settings` | `'Settings'` | inherit |

### 1.4 `(auth)` route group

| Route | Title |
|---|---|
| `/login` | `'Sign In'` |
| `/signup` | `'Create Account'` |
| `/forgot-password` | `'Reset Password'` |
| `/update-password` | `'Set New Password'` |
| `/school-login` | `'Student Sign In'` |
| `/device-conflict` | `'Continue Here?'` |

### 1.5 `(admin)` route group — title-only, all disallowed in robots.txt

`/admin` "Admin Overview" · `/admin/courses` "Courses — Admin" · `/admin/courses/new` "New Course — Admin" · `/admin/courses/[courseId]/edit` "Edit Course — Admin" · `/admin/courses/[courseId]/lessons` "Lessons — Admin" · `/admin/courses/[courseId]/lessons/new` "New Lesson — Admin" · `/admin/courses/[courseId]/lessons/[lessonId]/edit` "Edit Lesson — Admin" · `/admin/dev-tools` "Dev Tools — Reading Progression" · `/admin/franchise-leads` "Franchise Leads — Admin" · `/admin/leaderboard` "Leaderboard — Admin" · `/admin/partner-resources` "Partner Resources — Admin" · `/admin/partners` "Partners — Admin" · `/admin/partners/new` "New Partner — Admin" · `/admin/quality-control` "Quality Control — Admin" · `/admin/schools` "Schools — Admin" · `/admin/schools/new` "New School — Admin" · `/admin/tenants/[tenantId]` dynamic: `${school.name} — Admin` or "Tenant Not Found".

### 1.6 Top-level marketing pages (no route group)

| Route | Title | Description | Canonical | OG Title (if different) | OG Image |
|---|---|---|---|---|---|
| `/about` | `{ absolute: 'About Us — Mind Ur Mind' }` | "Mind Ur Mind was founded in 2014 by Dr. Kapil Dev Sharma, combining academic research and hands-on coaching into programs for how people read, think, and manage their own minds." | none | inherit | none |
| `/contact` | `'Contact Us — Mind Ur Mind'` | "Questions about a program, a payment, or just not sure where to start? Reach Dr. Kapil Dev Sharma's team directly via WhatsApp or email." | none | inherit | none |
| `/gallery` | `'Gallery — Mind Ur Mind'` | "Real moments from Mind Ur Mind workshops, retreats, and Quantum Speed Reading sessions." | none | inherit | none |
| `/privacy` | `'Privacy Policy'` | inherit | none | inherit | none |
| `/terms` | `'Terms of Service'` | inherit | none | inherit | none |
| `/refund-policy` | `'Refund & Cancellation Policy'` | inherit | none | inherit | none |
| `/franchise-individual` | `'Franchise & Trainer Opportunity — Mind Ur Mind'` | "Start your own Quantum Speed Reading training business with a ready platform, marketing kit, and certification." | none | inherit | none |
| `/executive-brain-workshop` | `{ absolute: 'Executive Brain Performance Workshop Mumbai \| Calm, Focus & Decision Clarity' }` | "A one-day, science-based live workshop in Mumbai by Dr. Kapil Dev Sharma — a live EEG brain-state demo, personal before/after measurement, and 21 days of guided daily practice on WhatsApp." | `/executive-brain-workshop` | same as title/desc | **`/founder-warm.jpg`** (also twitter image) |
| `/prefrontal-power-mumbai` | `'PREfrontal POWER Mumbai \| One-Day Brain Training Workshop'` | "Join PREfrontal POWER in Mumbai on 27 September 2026 — a one-day, science-informed brain training workshop for focus, emotional regulation, clarity and better decision-making." | `/prefrontal-power-mumbai` | **differs**: `'PREfrontal POWER — Train Your Brain. Think Better. Live Better.'` / desc also differs: "A one-day experiential brain training workshop in Mumbai. Science-informed. Practical. Limited to 40 seats." | none |
| `/mind-assessment` | i18n-sourced (`overthinkingTestLanding.meta.title`) | i18n-sourced description | `/mind-assessment` | inherit (no OG block) | none |
| `/programs/quantum-speed-reading` | `{ absolute: 'Quantum Speed Reading — Science-Backed Neuro-Cognitive Masterclass \| Dr. Kapil Dev Sharma' }` | "Read 5x faster, retain more, and rebuild how your mind processes information in 30 days. 7 live masterclasses, daily app-tracked cognitive metrics, ₹9,999 one-time enrollment." | none | inherit (no OG block) | none |
| `/programs/quantum-speed-reading-mumbai` | `{ absolute: 'Quantum Speed Reading — Live 2-Day Workshop in Mumbai \| Mind Ur Mind' }` | "A 2-day, in-person pilot workshop in Mumbai — live coaching from Dr. Kapil Dev Sharma, a Cognitive & Focus Engagement Demo, and reading speed measured across an overnight gap. Same 30-day curriculum, same ₹9,999 price as the online Masterclass." | `/programs/quantum-speed-reading-mumbai` | inherit (no OG block) | none |
| `/programs/quantum-speed-reading/speed-test` | `'Free Reading Speed Test — Quantum Speed Reading'` | "Measure your real reading speed and comprehension in 2 minutes, then feel what a trained pace is like — free, no payment required." | none | inherit | none |
| `/programs/habit-builder` | `'Quantum Mindset & Habit Builder™ — 21-Day Program \| Mind Ur Mind'` | "A 21-day guided program pairing daily reading practice with focus and memory exercises. Free for Days 1–7, then a one-time ₹99 payment to continue — never a subscription." | none | inherit | none |
| `/retreats/residential` | `{ absolute: 'Residential Retreats — Lonavala & Rishikesh — Dr. Kapil Dev Sharma' }` | "Small-group, fully immersive residential retreats guided in person by Dr. Kapil Dev Sharma since 2014. Lonavala and Rishikesh, 2026–2027. Kriya Yoga, Prana, and cosmic energy work — ₹35,000 sharing, ₹45,000 private." | none | inherit | none |
| `/retreats/online-11-day` | `{ absolute: '11-Day Online Meditation & Inner Mastery Retreat — Dr. Kapil Dev Sharma' }` | "Authentic Kriya Yoga, Prana, and cosmic energy — an intensive, live, 11-day journey through telepathy, aura reading, Samadhi meditation, chakra activation, Kundalini meditation, and astral projection. Guided nightly by Dr. Kapil Dev Sharma, teaching since 2014. Monthly batch, 10th–20th, 7:30–10:30 PM." | none | inherit | none |
| `/mentoring/overthinking-course` | `{ absolute: 'The 21-Day Mind Reset System — Overthinking & Mental Clarity \| Dr. Kapil Dev Sharma' }` | "21 days of daily Hindi training, meditation, and guided activity to understand overthinking and build mental clarity. ₹499 for 1-month self-paced access, or ₹999 for 6 months plus 2 live sessions with Dr. Kapil." | none | inherit | none |
| `/mentoring/personal-class` | `'Personal Class — 1-on-1 Intensive Mentoring — Dr. Kapil Dev Sharma'` | "Private, one-on-one mentoring for overthinking, focus, and personal growth, shaped around your own situation — guided by Dr. Kapil Dev Sharma, 26 years of experience as a professor, researcher, and life coach." | none | inherit | none |
| `/assessments` | `'Mind Assessment Center™'` | "Discover how your mind learns today so your learning journey can be personalized for you." | none | inherit | none |
| `/assessments/[category]` and 4 sub-steps (`/[assessment]`, `/welcome`, `/questions`, `/complete`) | **no metadata export** | — | — | — | — |
| `/discover-learning-potential` | `'Discover Your Learning Potential™ — Quantum Mind Learning Lab™'` | "Discover how you or your child naturally learns — and where improvement is possible. Approximately 5 minutes." | none | inherit | none |
| `/discover-learning-potential/who-is-learning` | `'Who Are You Learning With Today? — Quantum Mind Learning Lab™'` | "One quick question before we begin discovering how you naturally learn." | none | inherit | none |
| `/discover-learning-potential/reading` | `'Reading Discovery™ — Quantum Mind Learning Lab™'` | "Let's discover how you naturally read. There are no right or wrong answers — simply read the way you normally do." | none | inherit | none |
| `/discover-learning-potential/reading/quantum-speed-reading-intro` | `'Quantum Speed Reading™ — Quantum Mind Learning Lab™'` | "A motivational bridge from Reading Discovery into your Quantum Speed Reading™ journey." | none | inherit | none |
| `/discover-learning-potential/memory` | `'Memory Discovery™ — Quantum Mind Learning Lab™'` | "Let's discover how your memory naturally works. There are no right or wrong answers — trust your first impression." | none | inherit | none |
| `/discover-learning-potential/focus` | `'Focus Discovery™ — Quantum Mind Learning Lab™'` | "Let's discover how your brain naturally manages attention. There are no right or wrong answers." | none | inherit | none |
| `/discover-learning-potential/ai-profile` | `'Your AI Learning Profile — Quantum Mind Learning Lab™'` | "Here is what we discovered about how you learn." | none | inherit | none |
| `/discover-learning-potential/learning-potential` | `'Your Learning Potential — Quantum Mind Learning Lab™'` | "The path from your Discovery results to your personalized AI Learning Studio journey." | none | inherit | none |
| `/discover-learning-potential/upload-bridge` | `'Your Learning Profile Is Ready — Quantum Mind Learning Lab™'` | "The bridge from your Discovery results to your first real learning document." | none | inherit | none |
| `/discover-welcome-preview` | **no metadata export** | — | — | — | — |
| `/unified-quantum-session-preview` | **no metadata export** | — | — | — | — |
| `/welcome`, `/welcome/choose-method`, `/welcome/learning-goal`, `/welcome/record` | "Welcome" / "Choose Learning Method" / "Learning Goal" / "Record & Learn" | inherit | none | inherit | none |

### 1.7 `labs/quantum-speed-reading/*` and `labs/visual-intelligence/*` — 60+ exercise pages

Title-only for the majority (roughly half also have a short description); none set canonical or OG. Full per-route titles/descriptions were captured by the research pass and are available on request — omitted here for length, but two naming observations are worth flagging directly:
- **Near-duplicate titles**: `/labs/quantum-speed-reading/flash-recall-sprint` ("Flash Recall & Retention Sprint — Quantum Speed Reading Lab™") vs. `/labs/quantum-speed-reading/vertical-flash-recall` ("Vertical Flash Recall & Retention Sprint — Quantum Speed Reading Lab™") — one word apart.
- Selected flagship exercise titles: `/labs/quantum-speed-reading/brain-gym` "Brain Gym™", `/photographic-reading` "Photographic Reading", `/photographic-memory` "Deep Visualisation Recall", `/esp-zener-telepathy` "ESP Zener Card Telepathy Sprint — Quantum Speed Reading Lab™".

### 1.8 `preview/*`, `partner-admin/*`, `school-admin/*` — title-only throughout, no descriptions/canonical/OG anywhere

Notable: `/partner-admin/billing` and `/school-admin/billing` both literally set `title: 'Billing'` — identical rendered `<title>` on two different tenant-facing routes. `/preview/profile`, `/preview/settings`, `/preview/workspace` have **no metadata export**.

### 1.9 Pages with NO metadata export (10 total)

`/assessments/[category]`, `/assessments/[category]/[assessment]`, `/assessments/[category]/[assessment]/welcome`, `/assessments/[category]/[assessment]/questions`, `/assessments/[category]/[assessment]/complete`, `/discover-welcome-preview`, `/unified-quantum-session-preview`, `/preview/profile`, `/preview/settings`, `/preview/workspace`. All ten render the generic inherited `<title>Quantum Mind</title>` and the generic site-wide description — including a 5-step dynamic assessment flow with no per-step title differentiation at all.

### 1.10 Cross-cutting metadata findings

1. **106 of 194 routes** (all no-metadata pages, plus 96 pages that set a title but no description) render the identical inherited description: *"AI-powered adaptive learning platform. Master in-demand skills with personalized courses and intelligent tutoring."*
2. **Exact duplicate titles**: `/partner-admin/billing` and `/school-admin/billing` both "Billing".
3. **Title vs. og:title mismatch** on `/prefrontal-power-mumbai` — different headline and different description depending on browser tab vs. social share card (see §1.6 table).
4. **Only 2 of 194 pages set `openGraph.images`**: `/executive-brain-workshop` (`/founder-warm.jpg`) and the dynamic `/courses/[slug]` (course's own `thumbnail_url`, when present). Every other shareable page — including the flagship `/programs/quantum-speed-reading` — has no image in link previews, and there is no sitewide fallback OG image.
5. **Only 6 of 194 pages set `alternates.canonical`**: `/`, `/executive-brain-workshop`, `/prefrontal-power-mumbai`, `/mind-assessment`, `/programs/quantum-speed-reading-mumbai`, and the auth-gated `/admin/tenants/[tenantId]`. Flagship pages like `/programs/quantum-speed-reading`, `/retreats/*`, `/mentoring/*`, `/about`, `/pricing`, `/courses` have none.
6. **Sitemap covers almost nothing**: only `/`, `/courses`, and published course slugs — none of the marketing landing pages are listed, despite being crawlable per `robots.ts`.

---

## 2. Bio & credentials — exact text, every location

### 2.1 Years of experience

| Exact quoted text | File:Line | Page(s) |
|---|---|---|
| "English Professor (15+ Years Experience)" | `i18n.ts:51` (+`:1122`, HI `:3693`) | Homepage hero, QSR page hero, QSR authority cards, **and Habit Builder page** (see inconsistency below — this credential set is reused verbatim on a page with no professor framing) |
| "15+ years of academic teaching experience in English." | `i18n.ts:1123` | `/programs/quantum-speed-reading` |
| "an English Professor with 15+ years of teaching experience" | `i18n.ts:1148` | QSR founder-video section |
| "Dr. Kapil Dev Sharma has 26 years of experience as a mind trainer and coach." | `i18n.ts:480` | `/franchise-individual` |
| "26 years as a mind trainer and coach" | `i18n.ts:482` | `/franchise-individual` |
| "Professor · Researcher · Life Coach · 26 Years Experience" | `i18n.ts:868, 2222, 2439` | `/about`, `/mentoring/personal-class`, `/mentoring/overthinking-course` |
| "Dr. Kapil Dev Sharma brings 26 years of experience — 15 years as a professor and researcher in formal education, and 11 years as a life coach and mind trainer." | `i18n.ts:869, 2223, 2440` | Same three pages |
| Stat tiles: "26 / Years Total", "15 / Years Professor", "11 / Years Coaching" | `i18n.ts:871-873, 2225-2227, 2442-2444` | Same three pages |
| "Mind Trainer & Life Coach · 26 Years Experience" | `PrefrontalPowerTrainer.tsx:32` | `/prefrontal-power-mumbai` |
| "...over two decades of experience — 26 years in..." | `ExecutiveWorkshopTrainer.tsx:20` | `/executive-brain-workshop` |
| "guided by Dr. Kapil Dev Sharma, 26 years of experience as a professor, researcher, and life coach." | `src/app/mentoring/personal-class/page.tsx:21` | `/mentoring/personal-class` (meta description only) |
| "12+ years personally guiding students through this exact path" | `i18n.ts:1762` | `/retreats/online-11-day` |
| "150+ real reviews, from 12+ years of real retreats" | `i18n.ts:1825` | `/retreats/online-11-day` |
| "Twelve years, 150+ real students, one small cohort at a time." | `i18n.ts:1879` | `/retreats/online-11-day` |
| "Real years, real students, real reviews — not a program that launched last quarter." | `i18n.ts:1758, 1987` | Retreat & residential authority sections |

**Inconsistency**: the sitewide bio consistently totals **26 years** (15 professor + 11 coach), but the QSR "English Professor (15+ Years Experience)" credential badge presents 15+ as a standalone figure with no coaching years attached — and this exact 3-item credential set is reused verbatim on the **Habit Builder page**, a program with no professor/QSR framing of its own (shared `t.hero` object). Separately, retreat/residential copy ("12+ years" / "Twelve years", tied to "since 2014") describes a narrower, unreconciled span from the "26 years total" bio, with both presented as true simultaneously.

### 2.2 "English Professor" / academic title claims

All instances listed in §2.1 above (`i18n.ts:51, 1122, 1123, 1148`, HI mirror `3671, 3693`). One additional item: a **test fixture email** `'DrKapilPhd@Gmail.com'` in `src/features/thirty-day-curriculum/actions/getCurriculumWatermarkText.test.ts:48` — not rendered on any page, an internal owner-account identifier used to test watermark-exclusion logic, but it embeds an unverified "PhD" string in the codebase.

### 2.3 Founding year — confirmed 2014 vs. 2015 inconsistency

The existing dev TODO, quoted exactly, at `i18n.ts:1103-1116`:

> ```
> authority: {
>   // TODO(Dr. Sharma): the "10,000+ students" figure appears
>   // sitewide (this card, QSR hero credentials/stat/secondaryLine,
>   // the QSR FAQ, homepage meta description, the franchise page,
>   // and both retreat/residential pages — see the "QSR Page Cleanup
>   // & Credibility Fixes" task, Fix 5, for the full list) as a
>   // specific, checkable statistic. Please confirm it's accurate
>   // before it stays live; if not verified, it should be replaced
>   // or softened per the site's existing "no fabricated statistics"
>   // standard. Also note a real internal inconsistency sitting in
>   // this exact card list: "India's First QSR Pioneer (Since 2015)"
>   // right next to "Conducting live teaching workshops since 2014"
>   // below — two different start years for what reads like the
>   // same claim. Please confirm which year is correct.
> ```

(The Hindi mirror at `i18n.ts:3671/3680` contains the same underlying conflict in translation but has no translated TODO comment of its own.)

Every place a founding/origin year is stated:

| Exact text | File:Line | Page |
|---|---|---|
| "India's First QSR Pioneer (Since 2015)" | `i18n.ts:52, 1126` (HI `2698, 3671`) | Homepage hero, QSR authority cards |
| "Conducting live teaching workshops since 2014, across schools, colleges, and corporate audiences." | `i18n.ts:1135` (HI `3680`) | QSR authority cards |
| "...developed the Quantum Speed Reading methodology in 2015..." | `i18n.ts:480` (HI `3098`) | `/franchise-individual` |
| "The complete, structured curriculum developed and refined by Dr. Kapil Dev Sharma since 2015." | `i18n.ts:389` (HI `3007`) | `/franchise-individual` |
| "Developer of the Quantum Speed Reading methodology, since 2015" | `i18n.ts:483` (HI `3101`) | `/franchise-individual` |
| "...who introduced Quantum Speed Reading to the country in 2015." | `i18n.ts:1148` (HI `3693`) | QSR founder-video section |
| "Mind Ur Mind was founded in 2014 by Dr. Kapil Dev Sharma..." | `i18n.ts:856` (HI `3459`); `src/app/about/page.tsx:8` (meta) | `/about` |
| Stat tile: "2014 / Founded" | `i18n.ts:863` (HI `3466`) | `/about` |
| "...has guided 10,000+ students from complete beginners to advanced practitioners since 2014." | `i18n.ts:729` (HI `3327`) | QSR FAQ |
| "Secure checkout via Razorpay · 10,000+ students since 2014" | `i18n.ts:966` (HI `3546`) | QSR checkout trust line |
| "...has guided 10,000+ students through it since 2014..." | `i18n.ts:1346` (HI `3865`) | QSR FAQ |
| "...10,000+ students since 2015." (**homepage meta description** — flips year vs. every other "10,000+" mention) | `src/app/(marketing)/page.tsx:31` | Homepage `<meta name="description">` |
| "Online · Since 2014 · Small Cohort" | `i18n.ts:1682` (HI `4177`) | `/retreats/online-11-day` |
| "...teaching this path since 2014." | `i18n.ts:1685` (HI `4180`) | `/retreats/online-11-day` |
| "Teaching Since 2014" | `i18n.ts:1761, 1990` (HI `4256, 4485`) | Retreat & residential authority cards |
| "Residential Retreats · Since 2014 · Small Cohorts" | `i18n.ts:1895` (HI `4390`) | `/retreats/residential` |
| "...Kriya Yoga, Prana, and cosmic energy work, guided directly, since 2014." | `i18n.ts:1898` (HI `4393`) | `/retreats/residential` |
| "...Dr. Kapil Dev Sharma since 2014. Lonavala and Rishikesh, 2026–2027..." | `src/app/retreats/residential/page.tsx:27` (meta) | `/retreats/residential` |
| "...Dr. Kapil Dev Sharma, teaching since 2014. Monthly batch..." | `src/app/retreats/online-11-day/page.tsx:29` (meta) | `/retreats/online-11-day` |
| "...creator of the Quantum Speed Reading programme, running since 2015..." | `ExecutiveWorkshopTrainer.tsx:22` | `/executive-brain-workshop` |
| Dev comment: "'since 2014' and '150+ real student reviews' are real facts given directly by the business owner, not independently verifiable numbers" | `RetreatAuthority.tsx:11-13`, `ResidentialAuthority.tsx:11-13` | (dev comment, not rendered) |

**Net finding**: two distinct year claims exist for the same "start of practice" fact — **2014** (Mind Ur Mind founding, retreat/residential "teaching since," most "10,000+ students since" mentions) vs. **2015** (QSR Pioneer badge, "developed methodology in 2015," and — newly confirmed — the **homepage meta description itself**, which flips to 2015 for the same 10,000+ figure stated as "2014" everywhere else). The existing TODO's own list of "sitewide" locations does not call out this meta-description instance.

### 2.4 "India's first" / originator / pioneer claims

| Exact text | File:Line | Page |
|---|---|---|
| "India's First QSR Pioneer (Since 2015)" | `i18n.ts:52, 1126` | Homepage hero, QSR authority |
| "India's First Science-Backed Quantum Speed Reading" | `i18n.ts:55` | Homepage hero headline |
| "...and India's first QSR pioneer, who introduced Quantum Speed Reading to the country in 2015. You're learning directly from the originator of the method, not a licensed instructor teaching someone else's system." | `i18n.ts:1148` | QSR founder-video section |
| "Learn From The Person Who Brought QSR To India" / "Not a licensed instructor teaching someone else's system — the person who introduced it." | `i18n.ts:1118-1119` | QSR authority section |

### 2.5 Student count / workshop count figures

| Figure | File:Line(s) | Context |
|---|---|---|
| **10,000+ Students Guided** | `i18n.ts:53, 484, 729, 861, 966, 1130, 1346` (+HI) | Hero, franchise, QSR FAQ ×2, about stats, QSR checkout trust line, QSR authority — flagged as unverified by the TODO in §2.3 |
| **500+ Workshops Delivered** | `i18n.ts:862, 1134` | About stats, QSR authority card |
| **150+ real reviews / 150+ real students** (retreat-specific — separate population from the 10,000+ figure) | `i18n.ts:1825, 1879` | `/retreats/online-11-day` |
| **12+ years / Twelve years** (retreat-specific) | `i18n.ts:1762, 1825, 1879` | `/retreats/online-11-day` |
| **26 years** (overall bio total) | `i18n.ts:480, 482, 868-873, 2222-2227, 2439-2444`, `FranchisePageContent.tsx:99`, `ExecutiveWorkshopTrainer.tsx:20`, `PrefrontalPowerTrainer.tsx:32`, `personal-class/page.tsx:21` | Franchise, about, mentoring, mind-reset, executive workshop, prefrontal power |
| **15+ years** (professor-only claim) | `i18n.ts:51, 1122-1123, 1148` | Hero, QSR authority, QSR founder video |
| **3–5 / 8–10 / 15+ students/month** (franchise partner-tier projections — unrelated population) | `i18n.ts:420, 425, 430` | `/franchise-individual` |

**Inconsistency**: the "10,000+ students / 500+ workshops" figures (QSR/overall business) are a completely separate, unreconciled population from the retreat-specific "150+ real students / 12+ years" figures — both sets appear on "trust/authority" sections of different pages without ever being tied together or scoped explicitly.

### 2.6 Name spelling variants

| Variant | Where | Notes |
|---|---|---|
| **"Dr. Kapil Dev Sharma"** (full) | Dozens of locations across `i18n.ts`, `middleware.ts:134`, `terms/page.tsx:102`, `retreats/residential/page.tsx:25,27`, franchise/about/mentoring pages | Most common form, used sitewide |
| **"Dr. Kapil Sharma"** (missing "Dev") | `HomeGuideSection.tsx:6` (comment); rendered value "Meet Dr. Kapil Sharma" at `i18n.ts:309` | Homepage "Meet the Founder" section |
| **"Dr. Kapil Sharma, trainer of PREfrontal POWER"** (missing "Dev", alt text) | `PrefrontalPowerHero.tsx:96` | `/prefrontal-power-mumbai` |
| **"Dr. Kapil"** (short form) | Dozens of CTA/WhatsApp strings, e.g. `i18n.ts:793, 795, 826, 1146, 1155, 1380...`; footer heading "Dr. Kapil's Philosophy" (`i18n.ts:826`) | Widespread |
| **"Dr. Sharma"** (short form) | e.g. `i18n.ts:44, 77, 133, 136, 689, 754, 778, 1096, 1187...` | Widespread across hero/QSR/retreat/mentoring copy |
| **"DrKapilPhd@Gmail.com"** (test-fixture email, not rendered) | `getCurriculumWatermarkText.test.ts:48` | Internal test only |

No instance of "Kapil Dev Sharma" without "Dr." prefix, and no surname-only reference, were found as standalone rendered text.

---

## 3. Product/program names — every variant, every location

### 3.1 Quantum Speed Reading (flagship)
"Quantum Speed Reading" — 273 occurrences (plain); "Quantum Speed Reading™" — 147 occurrences (with trademark, typically first mention per section). No spelling variants found. Related: "Offline QSR + EEG Cognitive Testing" (`i18n.ts:258`), "QSR" abbreviation used throughout.

### 3.2 Quantum Mindset & Habit Builder — confirmed naming inconsistency

| Variant | File:Line | Where |
|---|---|---|
| **"Quantum Mindset & Habit Builder"** (canonical, ™ on its own landing page) | `src/app/programs/habit-builder/page.tsx:15,20`, `AppSidebar.tsx:51`, footer Programs column `i18n.ts:804`, `quantumMindsetHabitBuilderPaymentLink.ts`, `QsrFocusScreenTime.tsx`, `TwentyOneDayJourneyCard.tsx`, `src/features/quantum-journey/*`, `(auth)/layout.tsx`, `i18n.ts:233` | `/programs/habit-builder` (real page title), homepage footer, dashboard sidebar, journey pages |
| **"Quantum Mind & Habit Builder"** (older/shorter, missing "set") | `i18n.ts:187` (**homepage program-card title, `home.habitBuilder.title`**), `i18n.ts:302` (homepage "More Than Courses"), `i18n.ts:754, 757` (QSR FAQ) — HI `2826, 2920, 3352, 3355` | Homepage program grid card, homepage section, QSR FAQ answer |

**Net finding**: the homepage's own program-grid card (`ProgramCardsGrid.tsx:179`) displays **"Quantum Mind & Habit Builder"**, while the destination page it links to (`/programs/habit-builder`) is titled **"Quantum Mindset & Habit Builder™"**, and the footer link on the same homepage correctly says **"Quantum Mindset & Habit Builder"** — three different renderings of the same product name on one page load.

### 3.3 Overthinking Mastery Course → 21-Day Mind Reset System™ — confirmed rename with confirmed leftover old-name usages

Rename documentation, quoted exactly, at `src/config/overthinkingCoursePaymentLink.ts:1-16`:

> ```
> // 21-Day Mind Reset System™ (formerly "Overthinking Mastery Course") —
> // 21-day self-paced digital course hosted and sold entirely on
> // Classplus, not on this site. The one real checkout link for
> // /mentoring/overthinking-course's current ₹499 (self-paced, no live
> // sessions) / ₹999 (6 months + 2 live sessions with Dr. Kapil)
> // pricing — tier/price selection happens on the Classplus checkout
> // page itself after this one link, not here. Previously also backed
> // an older ₹2,999/₹5,999/₹8,999 three-tier version of this same
> // page; that pricing model and its "2 live sessions" universal-
> // feature copy are gone from the codebase entirely now, not just
> // off the page.
> // Outstanding manual check (cannot be verified from this codebase):
> // confirm on the Classplus dashboard itself that the ₹499 (no live
> // sessions) / ₹999 (2 live sessions) split is actually configured
> // there to match this page's copy before relying on it live — as of
> // the pricing correction, the Classplus product page still listed
> // "2 Live Sessions" as one universal feature, not yet split by tier.
> ```

New name, in live use: page metadata title "The 21-Day Mind Reset System — Overthinking & Mental Clarity | Dr. Kapil Dev Sharma" (`page.tsx:24`), JSON-LD `name: 'The 21-Day Mind Reset System'` (`page.tsx:74`), "The 21-Day Mind Reset System™" (`i18n.ts:2301, 2503, 2661-2662`), WhatsApp templates (`whatsappSupportLink.ts:182`).

**Old name, still live in rendered content**:

| Exact text | File:Line | Page |
|---|---|---|
| "Self-paced courses (e.g. the Overthinking Mastery Course): refundable within 7 days of purchase..." | `src/app/refund-policy/page.tsx:98` | `/refund-policy` |
| Program card: `title: "Overthinking Mastery Course"`, `cta: "Begin Your 21-Day Reset"` | `i18n.ts:144-147`, rendered `ProgramCardsGrid.tsx:68-69` | **Homepage program grid**, links to `/mentoring/overthinking-course` |
| Hindi mirror: "ओवरथिंकिंग मास्टरी कोर्स" | `i18n.ts:2790` | Homepage program grid (HI) |
| Testimonial tag: `program: "Overthinking Mastery"` ("Rohan K.") | `i18n.ts:697-698` | Homepage testimonials section |
| Hindi mirror: "ओवरथिंकिंग मास्टरी" | `i18n.ts:3305` | Homepage testimonials (HI) |
| Footer link (third variant, drops "Course"): `"Overthinking Mastery"` | `i18n.ts:818` (HI `3421`) | Sitewide footer |

**Net finding**: three live names for one product simultaneously — (1) "The 21-Day Mind Reset System™" on its own page, (2) "Overthinking Mastery Course" on `/refund-policy` and the homepage program grid, (3) "Overthinking Mastery" in the sitewide footer and homepage testimonial tag. No leftovers found beyond these three surfaces.

### 3.4 PREfrontal POWER
Canonical stylized form "PREfrontal POWER" used consistently across `/prefrontal-power-mumbai`, its sticky bar, final CTA, hero, and the homepage feature strip. No rendered naming inconsistency — a short-form "Executive Brain Workshop"-style code-only name exists only at the folder/component level, never user-facing.

### 3.5 Executive Brain Performance Workshop
Canonical "Executive Brain Performance Workshop" used consistently (9+ occurrences with modifiers: "...in Mumbai", "...to your team", "...has concluded"). Page title/OG: "Executive Brain Performance Workshop Mumbai | Calm, Focus & Decision Clarity". No rendered naming inconsistency.

### 3.6 Personal Class (Mentoring)

| Variant | File:Line | Where |
|---|---|---|
| "Personal Class — 1-on-1 Intensive Mentoring" (canonical long form) | `i18n.ts:132, 2285` (HI `2778`) | Homepage tier-3 card, `/mentoring/personal-class` |
| "Personal Class (1-on-1)" | `i18n.ts:817` (HI `3420`) | Sitewide footer |
| "Personal Class" (bare) | `i18n.ts:66, 687` | Homepage hero stats, homepage testimonials |
| "Personal Class (Mentoring)" | `executiveBrainWorkshopConfig.ts:182` | `/executive-brain-workshop` cross-sell testimonial tag |

Four slightly different formattings of the same program name — not a rename, but inconsistent.

### 3.7 Retreats
"Online 11-Day Retreat" (footer) vs. "The 11-Day Online Meditation & Inner Mastery Retreat" (hero) vs. page-meta title "11-Day Online Meditation & Inner Mastery Retreat — Dr. Kapil Dev Sharma" — consistent in meaning, varying in length. Same pattern for "Residential Retreats" / "Residential Retreats in Lonavala & Rishikesh". No conflicting rename.

### 3.8 Franchise / Trainer program
Four different labels for one offering, none canonical: page-meta title "Franchise & Trainer Opportunity — Mind Ur Mind"; hero headline "Are You a Trainer or Edupreneur?"; footer link "Become a Partner"; CTA "Apply to Become a Certified Trainer". Internal dev-name (comment only): "Franchise/Individual Trainer Application™".

---

## 4. Prices & payment/checkout links

### 4.1 Config-file sources of truth

| Constant (file) | Value | Product |
|---|---|---|
| `RAZORPAY_MASTERCLASS_PAYMENT_LINK` (`masterclassPaymentLink.ts:13`) | `https://rzp.io/rzp/ydVYaANF` | 30-Day QSR Masterclass — ₹9,999 one-time |
| `RAZORPAY_RETREAT_PAYMENT_LINK` (`retreatPaymentLink.ts:11`) | `https://rzp.io/rzp/ULFp3DJ` | 11-Day Online Retreat — no price hard-coded (Razorpay page is source of truth) |
| `RAZORPAY_QUANTUM_MINDSET_HABIT_BUILDER_PAYMENT_LINK` (`quantumMindsetHabitBuilderPaymentLink.ts:8`) | `https://rzp.io/rzp/vecVC7sx` | Quantum Mindset & Habit Builder — ₹99 one-time (Day 8+) |
| `CLASSPLUS_OVERTHINKING_COURSE_LINK` (`overthinkingCoursePaymentLink.ts:18`) | `https://zqdlz.courses.store/860167?...` | 21-Day Mind Reset System — ₹499/₹999, tier picked at Classplus checkout |
| `STARTER_MONTHLY_399` / `STARTER_YEARLY` (`pricingLinks.ts:16-17`) | Razorpay subscription links | "Individual Growth" — ₹399/mo or ₹2,999/yr |
| `FAMILY_PRO_MONTHLY_699` / `FAMILY_PRO_YEARLY` (`pricingLinks.ts:18-19`) | Razorpay subscription links | "Genius Family Lab" — ₹699/mo or ₹4,999/yr |
| `RAZORPAY_SUBSCRIPTION_LINKS.institutional` (`razorpaySubscriptionLinks.ts:31`) | Razorpay subscription link | "Institutional" — price shown as "Custom" |
| `executiveBrainWorkshopConfig` → `RAZORPAY_PAYMENT_LINK` (`executiveBrainWorkshopConfig.ts:42`) | `https://razorpay.me/@mindurmindacademy` (payer-enters-amount) | Executive Brain Workshop, 18 Oct 2026 — Early Bird ₹4,999, Standard ₹7,999, Executive 1:1 ₹29,999 (all 3 tiers share this one link; payer confirms exact plan/amount on WhatsApp after paying) |
| `HABIT_BUILDER_SIGNUP_HREF` (`habitBuilderSignupLink.ts:12`) | `/signup?next=/labs/quantum-speed-reading/journey/1` | Habit Builder "Start Free" (not paid) |
| `HABIT_BUILDER_APP_URL` (`habitBuilderSignupLink.ts:20`) | `https://habit.mindurmind.org.in/` | Homepage "Start 7 Days Free" CTAs |
| Legacy Stripe checkout (`src/features/billing/**`) | Stripe Checkout, `price_data` from Supabase `courses.price_cents` (USD) | Legacy "courses" marketplace — only reachable via unlinked `/(marketing)/(legacy)/courses/[slug]`, not linked from any live nav |

### 4.2 WhatsApp links used as checkout/inquiry fallback (all `wa.me/919540123161`, `src/config/whatsappSupportLink.ts`)

| Export | Product | Role |
|---|---|---|
| `WHATSAPP_MASTERCLASS_INQUIRY_LINK` | 30-Day Masterclass pre-purchase Qs | secondary |
| `WHATSAPP_ENROLLMENT_INQUIRY_LINK` | Masterclass, ready-to-join | secondary |
| `WHATSAPP_FREE_INTRO_SESSION_LINK` | Free 45-min live intro session | **primary** (no booking backend) |
| `buildOfflineEegWorkshopWhatsAppLink()` | 2-Day Offline QSR + EEG Workshop, 6 cities (all `status: 'waitlist'`) | **primary** — no price set anywhere |
| `WHATSAPP_GENERAL_INQUIRY_LINK` | Homepage floating widget/FAQ, any offer | secondary |
| `WHATSAPP_RETREAT_INQUIRY_LINK` / `buildResidentialWhatsAppLink()` | 11-Day Online Retreat / Residential Retreat (₹35,000 sharing / ₹45,000 private) | Online retreat: secondary (Razorpay link primary). Residential: **primary** — no Razorpay link exists for it |
| `WHATSAPP_MENTORING_INQUIRY_LINK` / `buildMentoringApplicationWhatsAppLink()` | 1-on-1 Personal Class — fully custom pricing | **primary** — no checkout at all |
| `WHATSAPP_HABIT_BUILDER_INQUIRY_LINK` | Habit Builder pre-signup Qs | secondary |
| `WHATSAPP_FRANCHISE_TEAM_INQUIRY_LINK` / `WHATSAPP_FRANCHISE_INSTANT_APPLY_LINK` / `buildFranchiseApplicationWhatsAppLink()` | Franchise — onboarding ₹20,000–25,000, revenue share 15–20%, monthly ₹0, **renewal after 1 year ₹5,000** | **primary** application path |
| `WHATSAPP_COURSE_INQUIRY_LINK` / `buildOverthinkingTestWhatsAppLink()` | 21-Day Mind Reset System / `/mind-assessment` result hand-off | secondary / lead notification |
| `WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK` | Mumbai in-person QSR pilot, 2 days, ₹9,999 (same price as online Masterclass, deliberately separate link) | **primary** — no dedicated checkout |
| `PREFRONTAL_POWER_REGISTRATION_URL` | PREfrontal POWER, 27 Sep 2026, Mumbai, ₹3,500, 40 seats | **primary** — no dedicated checkout yet |

### 4.3 Feature-flag-gated price — confirmed dead code

`LAUNCH_OFFER_ACTIVE` in `src/components/prefrontal-power/PrefrontalPowerSchedule.tsx:39` is currently **`false`**. This gate controls a "Founding Mumbai Edition ₹2,999" price (line 59-66) that is **not visible to any visitor today** — the live, rendered price is **₹3,500/person** (line 67-75), matching every other placement of this price across the site.

### 4.4 All hard-coded rupee prices, by product

| Price | Product | Key locations |
|---|---|---|
| ₹9,999 (one-time) | 30-Day QSR Masterclass | `programs/quantum-speed-reading/page.tsx:40,63,70`; `PricingPlansGrid.tsx:146,228,233`; `MasterclassPaywallModal.tsx:46,58`; `refund-policy/page.tsx:41`; legacy `/reviews` page |
| ₹9,999 (same price, separate pilot batch) | QSR Mumbai in-person workshop | `programs/quantum-speed-reading-mumbai/page.tsx:21,41`; `i18n.ts:1566` |
| ₹99 (one-time, Day 8+) | Quantum Mindset & Habit Builder | `programs/habit-builder/page.tsx:17`; `HabitBuilderHero.tsx:14`; `refund-policy/page.tsx:94`; `i18n.ts:1646-1647` |
| ₹499 (self-paced) / ₹999 (6 mo + 2 live sessions) | 21-Day Mind Reset System | `mentoring/overthinking-course/page.tsx:26`; `MindResetPricing.tsx:34,64`; `i18n.ts:2455,2470,2557,2567` |
| ₹35,000/person (sharing) / ₹45,000/person (private) | Residential Retreats | `retreats/residential/page.tsx:27`; `ResidentialPricing.tsx:9-10`; `i18n.ts:2031,2043` |
| No hard-coded price (Razorpay page is source of truth) | 11-Day Online Retreat | `RAZORPAY_RETREAT_PAYMENT_LINK` |
| Custom, no listed price | Personal Class (Mentoring) | WhatsApp-only "Apply Now" |
| ₹4,999 / ₹7,999 / ₹29,999 | Executive Brain Workshop | `executiveBrainWorkshopConfig.ts:80,98,108`; rendered `ExecutiveWorkshopHero.tsx:59`, `ExecutiveWorkshopPricing.tsx:84` |
| ₹3,500/person (live) — ₹2,999 "Founding Mumbai Edition" (**dead**) | PREfrontal POWER | `PrefrontalPowerSchedule.tsx:64,70`; `PrefrontalPowerHero.tsx:47`; `HomePrefrontalPowerFeature.tsx:29`; `prefrontal-power-mumbai/page.tsx:45` |
| ₹399/mo · ₹2,999/yr | Subscription "Individual Growth" (Starter) | `PricingPlansGrid.tsx:15,162,171` (`/pricing`) |
| ₹699/mo · ₹4,999/yr | Subscription "Genius Family Lab" (Family/Pro) | `PricingPlansGrid.tsx:16,182,191` |
| ₹0 / "Custom" | Foundation (free) / Institutional | `PricingPlansGrid.tsx:139,199` |
| ₹499/mo — **no working checkout link anywhere** | "qsr-app-continued" post-Masterclass concept | `getIsPaidUser.ts:6-8,25`; `AccessModelStrip.tsx:10-11` — described in code/copy but not actually sellable today |
| ₹21,600–₹36,000 / ₹57,600–₹72,000 / ₹1,08,000+ | Franchise "Earning Potential" illustrative scenarios | `i18n.ts:417-434`, explicitly labeled illustrative/not guaranteed |
| ₹20,000–₹25,000 onboarding, 15–20% revenue share, ₹0 monthly, **₹5,000 renewal after 1 year** | Franchise business model | `i18n.ts:441-448` |

### 4.5 Orphaned/legacy pricing surfaces

- `/(marketing)/(legacy)/courses/[slug]` + Stripe checkout — no live page links to `/courses`; reachable only by direct URL.
- `/(marketing)/(legacy)/reviews` — still has 3× "Enroll Now for ₹9,999 →" CTAs; nothing in current nav links here.
- `/(marketing)/(legacy)/pricing` is **not** orphaned — it's the live home of `PricingPlansGrid`, linked from `ProLockedScreen.tsx` and the dashboard subscription page.

---

## 5. Testimonials — every one, with page and photo/video status

### 5.1 Shared pool — `i18n.ts` `testimonials.items` (EN starts line 569; HI mirror line 3187, same ids)

| id | Name | City/Role | Quote | Program | Photo/Video |
|---|---|---|---|---|---|
| `ananya-r` | Ananya R. | — | "I finished two books in the time it used to take me to finish one chapter." | Quantum Speed Reading | `videoUrl: "[VIDEO URL NEEDED]"` — placeholder, not real |
| `karan-mehra` | Karan Mehra | Jaipur | "The mental clarity and speed I've gained through these 30 days have drastically cut down my study and preparation time." | Quantum Speed Reading | placeholder |
| `dr-preeti` | Dr. Preeti | Mumbai | "The Quantum Speed Reading workshop completely changed how I process medical journals; I can now scan through extensive research papers in a fraction of the usual time." | Quantum Speed Reading | placeholder |
| `shailesh` | Shailesh | Ahmedabad · Business Owner | "As a business owner, processing market reports and financial statements has become remarkably fast after attending this program." | Quantum Speed Reading | placeholder |
| `sudha` | Sudha | Kolkata | "Initially skeptical, but the 30-day practice streak genuinely improved my focus and overall reading comprehension beyond expectations." | Quantum Speed Reading | placeholder |
| `vikram-malhotra` | Vikram Malhotra | Bengaluru | "The combination of live sessions and daily app practice helped me break through a lifelong reading plateau." | Quantum Speed Reading | placeholder |
| `amit-patel` | Amit Patel | Surat | "A profound mental reboot — my retention power skyrocketed, and I now finish thick management books in a single sitting." | Quantum Speed Reading | placeholder |
| `vikram-s` | Vikram S. | — | "The Kundalini sessions alone were worth the entire eleven days." | 11-Day Online Retreat | placeholder |
| `priya-m` | Priya M. | — | "Six private sessions did what years of general advice never managed." | Personal Class (Mentoring) | placeholder |
| `rohan-k` | Rohan K. | — | "Twenty-one days, and the loop in my head finally went quiet." | Overthinking Mastery (old name) | placeholder; **never rendered anywhere** — no component filters to this program key |

**Every `videoUrl` in this pool is still the literal string `"[VIDEO URL NEEDED]"`** — no real photos or videos exist for any of these; a gating helper hides the "Watch video" link for all of them.

**Where each is actually rendered**:
- `HeroSection.tsx:15` (homepage hero badge) → `ananya-r`
- `Testimonials.tsx:22` (homepage `/`, imported by `(marketing)/page.tsx:16,103`) → filters to `programKey === "qsr"` only: `ananya-r, karan-mehra, dr-preeti, shailesh, sudha, vikram-malhotra, amit-patel`
- `QsrHero.tsx:19,97-102` → `dr-preeti` (QSR page hero badge)
- `QsrAudience.tsx:25,45-49` → `karan-mehra`
- `QsrVideoTestimonials.tsx:33` → all `qsr` items, on `/programs/quantum-speed-reading`
- `RetreatVideoTestimonials.tsx:22` → `vikram-s`, on `/retreats/online-11-day`
- `MentoringTestimonials.tsx:19` → `priya-m`, on `/mentoring/personal-class`
- `/programs/quantum-speed-reading-mumbai` uses `QsrMumbaiTestimonialsPlaceholder.tsx` — deliberate empty "coming soon" state, no shared testimonial rendered
- `/mentoring/overthinking-course` has **no testimonial component at all** — `rohan-k` is defined but orphaned

### 5.2 Executive Brain Workshop's own testimonials (`executiveBrainWorkshopConfig.ts:158-184`, rendered by `ExecutiveWorkshopTestimonials.tsx` on `/executive-brain-workshop`)

Reuses the exact same 4 real quotes from the shared pool (Shailesh, Dr. Preeti, Amit Patel, Priya M.) — explicitly **not** about the Executive Workshop itself (it hasn't run yet); section heading reads "What participants say about Dr. Sharma's training," not about this workshop. No photo/video on any of these four.

### 5.3 Franchise page (`/franchise-individual`) — two separate blocks, neither from the shared pool

1. **Trainer testimonials** (`i18n.ts:397-407`, `FranchisePageContent.tsx:270-304`): Dev Prakash (Mumbai), Saloni Shah (Delhi), Sandeep Gupta (Kolkata) — each a real WhatsApp-testimonial screenshot (`/trainer_testimonial_*_whatsapp.jpg`), no separately-typed quote text; the screenshot itself is the testimonial.
2. **Student testimonials** (`FranchisePageContent.tsx:69-76`): 6 YouTube video IDs reused from `qsrVideoReviews.ts` — no names/cities attached, captioned generically "Student Testimonial."

### 5.4 Video-only anonymous testimonial pools

| Config file | Count | Scope | Name/quote? | Rendered on |
|---|---|---|---|---|
| `qsrVideoReviews.ts` | 13 | Quantum Speed Reading | No — generic labels only | Homepage, QSR page, 6 reused on franchise page |
| `retreatVideoReviews.ts` | 6 | Retreats (online & residential) | No | `/retreats/online-11-day`, `/retreats/residential` |
| `prefrontalPowerVideoReviews.ts` | 11 | PREfrontal POWER | No — labeled "Participant Experience" (workshop hasn't run yet) | `/prefrontal-power-mumbai` (4 shown, "Watch More (7)") |
| `reviewsPlaylist.ts` | 200+ (embedded YouTube playlist) | Quantum Speed Reading | No | legacy, unlinked `/reviews` page only |

---

## 6. Buzzword/claim audit — every match for the flagged terms

Searched case-insensitively across `src/` for: "100%", "5x", "EEG", "clinical", "research-grade", "right-brain", "photographic", "telepathy", "aura", "astral", "Kundalini", "99%", "guarantee"/"guaranteed". Code-only hits (CSS, variable names, test fixtures) are noted separately from user-facing copy.

**"100%"** — user-facing: "Read 5x Faster. Retain 100%." (`ChooseLearningMethodExperience.tsx:140`); "5x Faster Reading. 100% Retention. EEG-Verified." (`i18n.ts:56`, homepage hero); "100% safe & encrypted" payment trust line (`i18n.ts:21`); "100% Results Guarantee" / "100% Results Guaranteed for Online Students" (`i18n.ts:739,969,972,1371`; `refund-policy/page.tsx:36`; `terms/page.tsx:65`) — all tied to the QSR Masterclass's refund policy, not an unconditional claim; "Retaining 100% of what you read" (`QuantumOfferPage.tsx:51`); "100% secure with us" (`LeadCaptureModal.tsx:189`). Non-claim: CSS/gradient/test-fixture/achievement-badge hits (dozens), not counted.

**"5x"** — "Read 5x Faster. Retain 100%." (`ChooseLearningMethodExperience.tsx:140`); "5x Faster Reading..." (`i18n.ts:56`); "Read 5x Faster." headline (`i18n.ts:1445`, Mumbai QSR page); "Read 5x faster, retain more..." (QSR page meta description, `programs/quantum-speed-reading/page.tsx:40`); "unlock 3-5x faster reading, up to 600+ WPM" (`mindProfileDataset.ts:108`). Non-claim: Tailwind size classes, HTTP status comments, a Razorpay ID substring.

**"EEG"** — mostly disclosed feature copy with explicit non-medical disclaimers: "a live EEG brain-state demo, personal before/after measurement" (`executive-brain-workshop/page.tsx:30`); "This is a live engagement demo, not a medical test or diagnosis. It does not produce a clinical report..." (`ExecutiveWorkshopEegDemo.tsx:42`); dev rule "never mention any EEG device brand or model name anywhere on this page" (`ExecutiveWorkshopEegDemo.tsx:1-2`); "We track real progress using EEG, not claims." (`i18n.ts:734`); "What does the EEG device do — is it a medical test?" FAQ (`i18n.ts:1537`, Mumbai QSR page); "Brain-state framing describes the design intent of these drills, not a per-session measured guarantee for online students" (`i18n.ts:1068`, self-limiting disclaimer). "5x Faster Reading...EEG-Verified" in the homepage hero (`i18n.ts:56`) is the one claim not immediately paired with a disclaimer on the same screen.

**"clinical"** — almost entirely disclaimers *denying* clinical status: "does not produce a clinical report and is not a substitute for any [medical/neurological assessment]" (`ExecutiveWorkshopEegDemo.tsx:42`); "No. It's educational and experiential, not therapy or a clinical intervention." (`PrefrontalPowerFaq.tsx:17`); "This is not a diagnostic or medical device, and it does not produce a clinical or medical brain report." (`i18n.ts:1515,1538`); "This is a self-awareness tool, not a clinical diagnosis." (`i18n.ts:2664`); AI system-prompt guardrails "Never make medical or clinical claims" (`generateFixationCoachMessage.ts:64` and 3 similar files) — internal, not user-facing.

**"research-grade"** — no hits anywhere in `src/`.

**"right-brain"** — used as legitimate feature/category naming rather than a standalone scientific claim: "Right-Brain Visualization" / "Awakens right-brain visual processing" (`QuantumOfferPage.tsx:40,70,154`); "Right-Brain Capabilities" (`i18n.ts:980`); "Right-brain visual reading, taught live, not pre-recorded" (`i18n.ts:1191`); "Right-Brain Visualization Depth" dashboard metric (`progress/page.tsx:166`); curriculum day-plan copy ("Right-Brain Expansion & Subvocalization Destruction," etc., `curriculumDatabase.ts:45,100,105,108,110,111`). The overwhelming majority of hits are internal category/enum tags and component names (`RightBrainHubModeCard.tsx`, `curriculumExerciseCatalog.ts`), not prose.

**"photographic"** — almost entirely a product/feature name rather than a literal-ability claim: "Photographic Memory" offer title (`QuantumOfferPage.tsx:50`); "...stronger visual/photographic memory" (`i18n.ts:1062`); "Photographic Memory Anchoring" (`i18n.ts:1286`); "Right Brain Photographic Score" stat tile (`PhotographicMemoryCompleteScreen.tsx:51`); lab page titles "Photographic Memory™" and "Photographic Reading™". ~150 additional hits are pure component/file/storage-key names, not prose claims.

**"telepathy"** — "...an intensive, live, 11-day journey through telepathy, aura reading, Samadhi meditation, chakra activation, Kundalini meditation, and astral projection." (`retreats/online-11-day/page.tsx:29`, meta description); "Telepathy Send/Receive" pill (`i18n.ts:100`, homepage); "Telepathy Send & Receive" discipline — "Experience silent, direct mind-to-mind resonance..." (`i18n.ts:1730`, `/retreats/online-11-day`). Also a public lab page title: "ESP Zener Card Telepathy Sprint — Quantum Speed Reading Lab™" (a gamified intuition-training exercise, not a literal-telepathy claim, but the branding itself uses the word prominently).

**"aura"** — same retreat meta description as above; "Aura Scanning & Reading" pill (`i18n.ts:101`) and discipline description "Learn to perceive the energy fields around you..." (`i18n.ts:1734`), both on `/retreats/online-11-day`. Non-claim: "Aura Edge Color Pulsing" is a visual-fixation exercise name, plus CSS variable names.

**"astral"** — same retreat meta description; "Astral Projection" pill (`i18n.ts:105`) and discipline description "Step beyond the edges of the physical plane..." (`i18n.ts:1750`), both on `/retreats/online-11-day`.

**"Kundalini"** — same retreat meta description; "Kundalini Meditation" pill (`i18n.ts:104`) and discipline description "Safely awaken the dormant energy at the base of your spine..." (`i18n.ts:1746`); testimonial "The Kundalini sessions alone were worth the entire eleven days." (Vikram S., `i18n.ts:108,678`); FAQ "Is the energy work — Kundalini, Samadhi — actually safe?" (`i18n.ts:1839,2083`, both retreat pages); "Deep energy work — Kundalini, Samadhi, direct Pranic activation — is safest and strongest with a teacher physically present..." (`i18n.ts:1923`, residential retreat FAQ).

**"99%"** — one hit: "What if Your BRAIN is Hiding 99% of its POWER? | Dr. Kapil Dev Sharma — Solomon Daniel's Podcast" (`i18n.ts:284`, `HomePodcastFeature.tsx`) — this is a **third-party podcast episode title being embedded verbatim**, not an original claim authored by the site, but it is displayed as marketing copy on the homepage.

**"guarantee"/"guaranteed"** — beyond the "100% Results Guarantee" claims already listed: "No online service can guarantee absolute [security]..." (`privacy/page.tsx:111`, a hedge, not promotional); several `/refund-policy` clauses scoping which programs do/don't carry the guarantee (`refund-policy/page.tsx:32,52,69,78`); "No guaranteed outcomes are promised or implied." (`i18n.ts:2173`, mentoring); "These are illustrative estimates based on an example course fee, not guaranteed outcomes." (`i18n.ts:434`, franchise earnings). Dev comments document that a prior "satisfaction guaranteed" phrasing was deliberately removed as a fabricated claim (`QsrTrustBadge.tsx:7-9`, `QsrGuaranteeBadge.tsx:11-20`). Reading-comprehension quiz distractor options ("Vaccines guarantee...", etc.) are deliberately false answer choices in a comprehension test, not site claims. The majority of remaining hits are internal engineering language ("this function guarantees X is non-empty").

---

## 7. Hardcoded `localhost` strings

| String/pattern | File:Line | Assessment |
|---|---|---|
| `NEXT_PUBLIC_APP_URL=http://localhost:3000` | `README.md:57`, `.env.example:95` | Docs/template — intentional |
| `stripe listen --forward-to localhost:3000/...` | `README.md:167` | Docs — intentional |
| `baseURL`/`webServer.url` fallback to `http://localhost:3000` | `playwright.config.ts:11,31` | Test-runner config — intentional, never shipped |
| `domain: 'localhost'` (×2) | `tests/e2e/auth.spec.ts:74`, `tests/e2e/global-setup.ts:176,186` | Test-only — intentional |
| `curl ... http://localhost:3000` (×4) | `.claude/settings.local.json:8,12,13,14` | Local Claude Code tooling permission allowlist — not shipped code, no production impact |
| `const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'` | `src/app/layout.tsx:58` | **Production code path** (metadata/OG URLs). Silent fallback: if the env var is ever unset in production, metadata/social-share URLs would point at `localhost:3000` rather than erroring. |
| Same pattern | `src/app/robots.ts:4` | Builds the `sitemap:` URL in `robots.txt` — same silent-fallback risk |
| Same pattern | `src/app/sitemap.ts:4` | Builds every URL in `sitemap.xml` — **highest visibility risk**: if unset, the entire sitemap would advertise `localhost:3000` to search engines |
| Same pattern | `src/app/(marketing)/(legacy)/certificates/[token]/page.tsx:51` | Builds the shareable certificate-verification URL |
| Same pattern | `src/features/billing/actions/createCheckoutSession.ts:58` | Builds Stripe checkout success/cancel redirect URLs — **highest real-world risk**: a paying user's Stripe checkout could redirect to `localhost:3000` after payment if the env var were ever unset |
| `'localhost:3000'` fallback for missing `host` header; `host.startsWith('localhost')` protocol check | `src/lib/domains/appDomain.ts:74-75` | Defensive dev-only default inside `getRequestOrigin()` — only triggers if both forwarded-host headers are absent, not expected in normal production traffic |

**Summary**: no "dead" hardcoded URL with zero env-var guard exists — every hit uses the standard `process.env.X ?? 'http://localhost:3000'` idiom. However, five production code paths (root layout, robots.ts, sitemap.ts, the legacy certificate page, and Stripe checkout) all share the same latent risk: **if `NEXT_PUBLIC_APP_URL` is ever unset in the actual production environment, the app will silently emit `localhost:3000` in metadata, robots.txt, sitemap.xml, certificate-share links, and Stripe checkout redirects, rather than failing loudly.** Not currently observed as broken — would need to confirm `NEXT_PUBLIC_APP_URL` is set in the live Vercel environment to close this out.

---

## Summary for review

This inventory surfaces several categories the rebuild will need to address, none of which have been touched in this phase:

1. **Founding-year conflict** (2014 vs. 2015) — already flagged by an existing dev TODO, confirmed to also appear in the homepage meta description itself (§2.3).
2. **Unverified "10,000+ students" figure** — already flagged by an existing dev TODO (§2.3, §2.5).
3. **Three live names for one product** — "21-Day Mind Reset System™" vs. "Overthinking Mastery Course" vs. "Overthinking Mastery" (§3.3).
4. **Habit Builder naming split three ways** on a single homepage load (§3.2).
5. **SEO gaps**: only 2 of 194 pages have any OG image, only 6 of 194 set a canonical URL, sitemap.xml covers almost nothing, 106 of 194 routes share one generic meta description (§1.10).
6. **Pricing/checkout fragmentation**: 5+ distinct WhatsApp numbers/links doubling as primary checkout for programs with no dedicated payment page (Residential Retreat, Personal Class, Mumbai QSR workshop, PREfrontal POWER, Offline EEG Workshop) (§4.2).
7. **Dead pricing code**: PREfrontal POWER's ₹2,999 "Founding Mumbai Edition" is gated off (§4.3) — not a live inconsistency, but present in the codebase.
8. **Esoteric/occult claims concentrated entirely on the 11-Day Online Retreat page** (telepathy, aura, astral projection, Kundalini) — not present anywhere else on the site (§6).
9. **Testimonial pool has zero real photos/videos** — every `videoUrl` in the shared pool is a `[VIDEO URL NEEDED]` placeholder (§5.1).
10. **`NEXT_PUBLIC_APP_URL` fallback risk** across 5 production code paths, most notably Stripe checkout redirects (§7).

No page content, copy, pricing, or configuration has been changed. This document and the `site-rebuild` branch's baseline commit are the only additions made in this phase.
