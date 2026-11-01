import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { TELEPATHY_BOOKED_PATH } from '@/config/telepathyWorkshopConfig'
import { telepathyCopy } from '@/features/telepathy-workshop/telepathyWorkshopCopy'
import { BookedPage } from '@/features/telepathy-workshop/components/BookedPage'

// Not for search engines: only visitors who have just paid reach it.
export const metadata: Metadata = buildPageMetadata({
  path: TELEPATHY_BOOKED_PATH,
  title: telepathyCopy.booked.metaTitle.en,
  description: telepathyCopy.booked.body.en,
  index: false,
})

// Rebuilt every hour, so a finished batch drops out of the batch choice.
export const revalidate = 3600

// The Telepathy Workshop™ thank-you page — Razorpay's "redirect after
// payment" for the ₹1,000 seat booking (TELEPATHY_SEAT_PAYMENT_LINK). The
// visitor picks their batch and sends the booking to Dr. Kapil on WhatsApp.
export default function TelepathyBookedRoute(): React.JSX.Element {
  return <BookedPage renderedAt={Date.now()} />
}
