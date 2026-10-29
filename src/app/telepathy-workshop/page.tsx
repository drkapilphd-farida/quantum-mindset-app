import type { Metadata } from 'next'
import { buildTelepathyMetadata, TelepathyWorkshopPage } from '@/features/telepathy-workshop/telepathyWorkshopPage'

export const metadata: Metadata = buildTelepathyMetadata('en')

// The Telepathy Workshop™ — a bilingual (EN/हिंदी) campaign page whose one
// goal is a WhatsApp message. Wording: telepathyWorkshopCopy.ts. Values
// (prices, dates, number, video IDs, images): telepathyWorkshopConfig.ts.
// Static: without ?lang it follows the site's saved EN/हिंदी choice;
// ?lang=hi / ?lang=en links are served from ./[lang] (see middleware.ts).
export default function TelepathyWorkshopRoute(): React.JSX.Element {
  return <TelepathyWorkshopPage urlLang={null} />
}
