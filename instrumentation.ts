// Next.js instrumentation hook — the documented entry point for loading
// Sentry's server/edge runtime configs (see the "Pre-Launch Audit Fix
// Pass" task, Phase 1) and for capturing errors thrown during server
// rendering that never reach a route handler's own try/catch (e.g. a
// Server Component throwing mid-render).
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

export const onRequestError = async (
  ...args: Parameters<typeof import('@sentry/nextjs').captureRequestError>
): Promise<void> => {
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureRequestError(...args)
}
