// Safe Meta Pixel calls: do nothing when fbq isn't there (server rendering,
// ad blockers, pixel not loaded yet) and never throw — a tracking call must
// never break a real click or payment.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export type FbqEvent = 'PageView' | 'ViewContent' | 'Lead' | 'Contact' | 'InitiateCheckout' | 'Purchase'
export type FbqParams = Record<string, string | number>

/** fbq('track', event, params[, { eventID }]) — eventID lets Meta drop duplicates of the same event. */
export function track(event: FbqEvent, params?: FbqParams, eventId?: string): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    if (eventId !== undefined) window.fbq('track', event, params ?? {}, { eventID: eventId })
    else if (params !== undefined) window.fbq('track', event, params)
    else window.fbq('track', event)
  } catch {
    // ignored on purpose
  }
}
