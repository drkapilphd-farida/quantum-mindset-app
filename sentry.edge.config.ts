// Sentry — Edge runtime (middleware.ts and any edge API routes). Loaded
// by instrumentation.ts's register() on the edge runtime only. See
// sentry.server.config.ts for the shared reasoning on tracesSampleRate/
// the no-DSN-configured-yet safe default.
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
})
