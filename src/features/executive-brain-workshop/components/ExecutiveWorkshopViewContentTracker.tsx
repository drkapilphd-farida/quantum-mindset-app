'use client'

import { useEffect } from 'react'
import { trackMetaPixelEvent } from '@/lib/analytics/metaPixel'

// Fires Meta's ViewContent exactly once, on first mount — separate,
// tiny client component so page.tsx itself can stay a Server Component
// (metadata export, JSON-LD).
export function ExecutiveWorkshopViewContentTracker(): null {
  useEffect(() => {
    trackMetaPixelEvent('ViewContent', { content_name: 'executive_brain_workshop' })
  }, [])

  return null
}
