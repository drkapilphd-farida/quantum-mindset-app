# Staging end-to-end test plan (Phase 8, before deploy)

**Goal:** test every Phase 8 item against a real database, with real logins,
without touching production. That means a separate free Supabase project, all
`app-sharp-brain` migrations applied there, and a Vercel preview of the branch
pointed at it.

## What I need from you

1. **The staging Supabase project.** Either:
   - **(a)** give permission for me to create it with the Supabase CLI, which is
     already logged in to your account on this Mac: a free project called
     `mindurmind-staging`, Mumbai region (`ap-south-1`). Or
   - **(b)** create it yourself at supabase.com (free plan) and send me the
     project ref.

   The free plan allows two active projects. If you already have two, one would
   need pausing.
2. **The staging database password.** It is stored only in a git-ignored local
   file (`.env.staging.local`), never committed or sent anywhere else.
3. **Vercel environment variables for the preview.** Three variables, scoped to
   **Preview** and **only the branch `app-sharp-brain`**, so production and
   other previews are unaffected:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

   You can add them in Vercel → Project → Settings → Environment Variables, or
   give me a Vercel access token and I will.
4. **Test inboxes for the login codes.** Permission to use Gmail
   "plus" addresses on your inbox (for example `mindurmindlab+parent@gmail.com`,
   `…+student@`, `…+pro@`, `…+child@`), so you receive the codes and can pass
   them on. Or name another inbox.
5. **OK for a preview-only feature-switch override.** The switches stay off in
   site.config. A preview-only setting would turn them on for this branch's
   preview; production ignores it, as it already does for the TODO markers.

## Setup (me, once 1–5 are in place)

1. **Link a separate workdir to staging.** Production stays linked in the main
   folder, so a push can't reach it by mistake.
2. **Apply every migration in `supabase/migrations/`** (the full history, then
   the Phase 8 ones) and check them with `supabase migration list`.
3. **Add staging's preview URL to its Auth redirect URLs.** The built-in email
   sender is rate-limited, which is fine for a handful of test logins.
4. **Seed the data tests need:**
   - the `plans` rows;
   - a 30-Day Program entitlement for the test accounts (SQL on staging only).
5. **Create the test accounts:**
   - **Parent:** role Parent, goal Exam.
   - **Student:** role Student, goal Memory.
   - **Professional:** role Professional, goal Focus.
   - **Child A:** created by the parent from the parent dashboard (Item 13).
   - **Child B:** an existing account, linked by the parent with an email code
     (Item 13).
   - **Legacy user:** has old curriculum progress and an app-paced Day 1
     checkpoint. It checks that old progress is intact and that the "no
     comparable Day 1" message appears.

## Test matrix

| Item | What to test |
|---|---|
| 10 Onboarding | Shown once on first login and once for the legacy user. Skip works. Parent can't continue without the consent tick. Consent row stored (version, language, time). Dashboard: parent lands on the parent view; goal card and section order match each goal; EN/HI; Settings edit works. |
| 11 Day 1 vs Day 30 | Day 1 flow (self-paced read → questions → attention practice → task) saves server-computed scores. Too-fast reading is rejected. Day 30 locked before day 28 (shift Day 1 back 27 days in SQL). Opens on day 28, or early after curriculum Day 29. Labelled "late" after day 35. Uses the other passage. Results comparison and share card (first name only); no retake after Day 30. Legacy user sees "no comparable Day 1". EN/HI at 360/768. |
| 12 Mobile Discipline | Goal set; focus timer 10/15/25 logs only completed sessions; daily check-in and streak; missed day resets gently; weekly totals. |
| 13 Parent summary | Parent creates Child A (consent required), and Child A logs in with the shown code. Parent links Child B with an email code (consent required); the parent is not signed in as the child. Parent sees only linked children. Weekly card numbers match the child's activity. WhatsApp text: first name only, no contact details. Delete-request option shown per child. |
| 14 Certificate | Not eligible below 20 practice days or without Day 30. Eligible when both are met. Day 1 → Day 30 numbers appear only when both exist. Download works. Old certificates still download. |
| Leftovers | "Pro" plan description updated; app text scan clean. |
| Regression | Legacy user's curriculum days, streaks, 21-day journey and certificate unchanged; website pages unchanged with the switches off. |

## Clean-up

Pause or delete the staging project after sign-off: it contains only test
accounts. Remove the branch-scoped Vercel variables when the branch is merged.
