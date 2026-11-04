import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { sharpBrainDemoCopy } from '@/lib/sharpBrainCopy'
import { pricingSnapshot } from '@/features/sharp-brain-enrol/server'
import { SharpBrainPricingProvider } from '@/features/sharp-brain-enrol/components/SharpBrainPricing'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import { SharpBrainDemo } from '@/components/sharp-brain/SharpBrainDemo'
import Footer from '@/components/Footer'

export const metadata: Metadata = buildPageMetadata({
  path: '/sharp-brain/demo',
  title: sharpBrainDemoCopy.en.metaTitle,
  description: sharpBrainDemoCopy.en.lines[0],
})

// Re-rendered every minute so the seat counter is never stale for long; the
// browser then refreshes it from the server (SharpBrainPricingProvider).
export const revalidate = 60

// /sharp-brain/demo — the on-demand Sharp Brain demo video (ad and WhatsApp
// link), with the same checkout as the program page. EN / HI (?lang=hi).
export default async function SharpBrainDemoPage(): Promise<React.JSX.Element> {
  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SharpBrainPricingProvider initial={await pricingSnapshot()}>
        <SharpBrainNav />
        <main>
          <SharpBrainDemo />
        </main>
        <Footer />
      </SharpBrainPricingProvider>
    </div>
  )
}
