import type { Metadata } from 'next'
import AboutPageContent from '@/components/AboutPageContent'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildOrganizationSchema } from '@/lib/seo/organizationSchema'
import { buildPersonSchema } from '@/lib/seo/personSchema'

export const metadata: Metadata = buildPageMetadata({
  path: '/about',
  title: 'About Us — Mind Ur Mind',
  description:
    'The story of Dr. Kapil Dev Sharma and Mind Ur Mind (founded 2014) — 26 years in education and mind training, Quantum Speed Reading trainer since 2015, based in Vadodara.',
})

export default function AboutPage(): React.JSX.Element {
  const organizationSchema = buildOrganizationSchema()
  const personSchema = buildPersonSchema()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
      <AboutPageContent />
    </>
  )
}
