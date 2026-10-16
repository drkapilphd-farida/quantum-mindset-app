// Meta Pixel events for the site's conversion helpers (conversions.ts).
// The pixel itself is loaded by components/analytics/MetaPixel.tsx; the
// safe call lives in lib/fbq.ts.
import { track, type FbqParams } from '@/lib/fbq'

export type MetaPixelStandardEvent = 'ViewContent' | 'InitiateCheckout' | 'Lead' | 'Contact'

export function trackMetaPixelEvent(event: MetaPixelStandardEvent, params?: FbqParams): void {
  track(event, params)
}
