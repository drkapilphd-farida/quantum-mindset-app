import type { Metadata } from 'next'
import SharpBrainNav from '@/components/sharp-brain/SharpBrainNav'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import { activeOffer, getTestOffer, pricingSnapshot, resolveNow } from '@/features/sharp-brain-enrol/server'
import TestOfferPage from '@/features/sharp-brain-enrol/components/TestOfferPage'

export const metadata: Metadata = {
  title: 'Your Sharp Brain offer | Mind Ur Mind',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

type OfferPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ now?: string | undefined }>
}

// The personal Reading Speed Test offer page (₹1,000 off for 48 hours) —
// the link in the WhatsApp message, so the team can resend it. Once the
// offer has expired or been used, the page shows the normal price logic.
export default async function SharpBrainOfferPage({ params, searchParams }: OfferPageProps): Promise<React.JSX.Element> {
  const [{ id }, { now: simulate }] = await Promise.all([params, searchParams])
  const now = resolveNow(simulate)
  const offer = activeOffer(await getTestOffer(id), now)

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SharpBrainNav />
      <main>
        <TestOfferPage
          offer={offer === null ? null : { id: offer.id, expiresAtMs: offer.expiresAtMs }}
          initial={pricingSnapshot(now, offer?.expiresAtMs ?? null)}
        />
      </main>
      <Footer />
      <WhatsAppWidget href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} analyticsLocation="sharp_brain_offer_widget" />
    </div>
  )
}
