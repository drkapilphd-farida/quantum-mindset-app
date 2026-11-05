import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import HomePageContent from '@/components/home/HomePageContent'

// /en — the homepage in English (positioning rework): the same page as `/`,
// with the English hero from copy/home-en.md; the other sections are the
// current English ones. Meta from copy/meta.md.
export const metadata: Metadata = buildPageMetadata({
  path: '/en',
  title: 'Mind power you can see on a screen | Mind Ur Mind',
  description: 'A 2-day live telepathy workshop in Vadodara. Running since 2017, 300+ video reviews. Proof on a Muse 2, in front of you. Hold a seat for ₹1,000.',
})

// Same as `/`: re-render at least hourly (date-bound sections, city line).
export const revalidate = 3600

export default function EnglishHomePage(): React.JSX.Element {
  return <HomePageContent lang="en" />
}
