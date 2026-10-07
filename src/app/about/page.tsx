import type { Metadata } from 'next'
import AboutPageContent from '@/components/AboutPageContent'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildOrganizationSchema } from '@/lib/seo/organizationSchema'
import { buildPersonSchema } from '@/lib/seo/personSchema'
import { brand, trainer } from '@/config/site.config'

export const metadata: Metadata = buildPageMetadata({
  path: '/about',
  ownOgImage: true,
  title: `About ${trainer.name} — ${trainer.en.title} | ${brand.name}`,
  description:
    `The story of ${trainer.name} and ${brand.name} (founded ${brand.foundedYear}) — ${trainer.years.total} years in education and mind training, trainer in reading, focus and memory skills since ${trainer.skillsTrainingSinceYear}, based in ${brand.city}.`,
})

export default function AboutPage(): React.JSX.Element {
  const organizationSchema = buildOrganizationSchema()
  const personSchema = buildPersonSchema()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationSchema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
      <AboutPageContent />
      {/* Memory Palace object pictures (CC BY 4.0 requires this credit). */}
      <p className="mx-auto max-w-3xl px-6 pb-10 text-center text-xs text-muted-foreground">
        Memory Palace pictures: Twemoji by Twitter, Inc. and other contributors, licensed under{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/" className="underline" rel="noopener noreferrer" target="_blank">
          CC BY 4.0
        </a>
        .
      </p>
    </>
  )
}
