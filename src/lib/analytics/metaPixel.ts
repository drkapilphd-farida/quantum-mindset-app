// Meta Pixel — site-wide, loaded by components/analytics/MetaPixel.tsx
// only when site.config.ts `analytics.metaPixelId` is set; never fetches
// or calls fbq() otherwise.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export type MetaPixelStandardEvent = 'ViewContent' | 'InitiateCheckout' | 'Lead'

// No-ops when the pixel script hasn't loaded (or was never configured) —
// mirrors trackGaEvent's own "never throws, never blocks a real click"
// posture.
export function trackMetaPixelEvent(event: MetaPixelStandardEvent, params?: Record<string, string>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq('track', event, params)
  } catch {
    // A tracking call must never be able to break a real conversion click.
  }
}
