// Meta Pixel — page-scoped conversion tracking for
// /executive-brain-workshop specifically (see
// executiveBrainWorkshopConfig.ts's `metaPixelId`), distinct from GA4
// (ga4.ts), which already fires sitewide. Only ever loaded when a real
// pixel ID is configured — never fetches or calls fbq() otherwise.
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
