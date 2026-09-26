import type { Metadata } from 'next'
import ContactPageContent from '@/components/ContactPageContent'
import { buildPageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  path: '/contact',
  title: 'Contact Us — Mind Ur Mind',
  description: 'Questions about a program, a payment, or just not sure where to start? Reach Dr. Kapil Dev Sharma\'s team directly via WhatsApp or email.',
})

export default function ContactPage(): React.JSX.Element {
  return <ContactPageContent />
}
