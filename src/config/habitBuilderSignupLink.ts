// Quantum Mindset & Habit Builder™ — single source of truth for where the
// /programs/habit-builder landing page's "Start Free" CTA sends a
// logged-out visitor. journey/[day]/page.tsx already redirects a genuine
// brand-new user (no session history, no baseline diagnostic) straight to
// the mandatory baseline diagnostic before Day 1 ever renders — so this
// only ever needs to point at Day 1 itself, not the diagnostic directly.
const JOURNEY_DAY_ONE_PATH = '/labs/sharp-brain/journey/1'

// /signup/page.tsx reads `next` and passes it through SignUpForm →
// signUp.ts, which already honors it end-to-end (including the
// email-confirmation redirect) — see that action's own doc comment.
// The one signup link for the 7-Day Free Focus & Reading Starter
// (site-rebuild Phase 5). It must be on the habit subdomain: the journey
// (/labs/sharp-brain/journey/*) is habit-only in middleware.ts,
// so signing up on www and then opening Day 1 bounces the user to the
// www dashboard instead of Day 1.
export const HABIT_BUILDER_APP_ORIGIN = 'https://habit.mindurmind.org.in'

export const HABIT_BUILDER_SIGNUP_HREF = `${HABIT_BUILDER_APP_ORIGIN}/signup?next=${encodeURIComponent(JOURNEY_DAY_ONE_PATH)}`

// The live Habit Builder subdomain itself (Domain Split™ — see
// src/lib/domains/appDomain.ts) — the homepage's own "Start 7 Days Free"
// CTAs (Navbar, Hero, the featured Habit Builder section, the Final CTA)
// all point here directly per explicit instruction, rather than through
// this same site's /signup?next=... redirect above. Single source of
// truth so every homepage placement stays in sync if this ever changes.
