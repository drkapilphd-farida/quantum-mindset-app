// Sentry — browser runtime (see the "Pre-Launch Audit Fix Pass" task,
// Phase 1). `instrumentation-client.ts` at the project root is Next.js's
// own documented convention for client-side instrumentation (auto-loaded
// before the app's own client code runs) — no manual import needed
// anywhere else.
//
// NEXT_PUBLIC_SENTRY_DSN — unset today. A Sentry DSN is designed to be
// public (it can only submit events, never read/modify anything in the
// Sentry project), which is why this is a NEXT_PUBLIC_ var and not a
// server-only secret. Until a real Sentry project exists and this var is
// set in Vercel, Sentry.init() below no-ops (documented SDK behavior
// when `dsn` is undefined) — this file is safe to ship as-is, it just
// won't report anywhere yet. To actually start receiving events: create
// a free Sentry.io project (Next.js platform), copy its DSN, and add it
// as NEXT_PUBLIC_SENTRY_DSN in Vercel's environment variables for the
// production (and preview, if wanted) environment, then redeploy.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
})

// Required export (per @sentry/nextjs's own build-time notice) so
// client-side navigations are captured as part of the same trace/error
// context rather than each page looking like an isolated pageload.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
