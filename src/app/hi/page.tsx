import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { withLanguageAlternates } from '@/lib/seo/languageAlternates'
import HomePageContent from '@/components/home/HomePageContent'
import { homeV2 } from '@/lib/homeV2Copy'

// /hi — the homepage in Hindi (Phase 4.3: the site opens in English at `/`;
// "हिंदी" in the nav leads here). Same page component as `/`.
export const metadata: Metadata = withLanguageAlternates(buildPageMetadata({ path: '/hi', title: homeV2.meta.title.hi, description: homeV2.meta.description.hi }), '/', '/hi')

// Same as `/`: re-render at least hourly (date-bound sections).
export const revalidate = 3600

export default function HindiHomePage(): React.JSX.Element {
  return <HomePageContent lang="hi" />
}
