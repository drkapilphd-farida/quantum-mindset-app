import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import HomePageContent from '@/components/home/HomePageContent'
import { homeV2 } from '@/lib/homeV2Copy'

// /en — the homepage in English (positioning rework): the same page as `/`,
// in English (copy/home-v2.md). Meta: title from copy/meta.md, Phase 4.2 description.
export const metadata: Metadata = buildPageMetadata({ path: '/en', title: homeV2.meta.title.en, description: homeV2.meta.description.en })

// Same as `/`: re-render at least hourly (date-bound sections, city line).
export const revalidate = 3600

export default function EnglishHomePage(): React.JSX.Element {
  return <HomePageContent lang="en" />
}
