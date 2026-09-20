// Sentry — server runtime (see the "Pre-Launch Audit Fix Pass" task,
// Phase 1). Loaded by instrumentation.ts's register() on the Node.js
// runtime only. Safe to ship with no DSN configured: Sentry.init()
// no-ops when `dsn` is undefined, so this is a harmless deploy even
// before a real Sentry project exists — see NEXT_PUBLIC_SENTRY_DSN's
// own doc comment in instrumentation-client.ts for what's needed to
// actually start receiving events.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Low default — this app has no meaningful traffic yet and tracing
  // isn't the point of this pass (error visibility is); raise once
  // real usage data justifies the added event volume/cost.
  tracesSampleRate: 0.1,
  // Server-side stack traces are the whole point of this pass (payment
  // webhooks, server actions) — keep debug logging off by default to
  // avoid noisy dev output, same posture as src/lib/logger.ts's own
  // isDev gate.
  debug: false,
})
