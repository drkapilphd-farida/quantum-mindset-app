import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { LanguageOverride } from '@/context/LanguageContext'
import { WHATSAPP_FRANCHISE_TEAM_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { partnerCopy } from '@/features/partner/partnerCopy'
import { PartnerCalculatorProvider } from '@/features/partner/components/PartnerInteractive'
import {
  PartnerAbout,
  PartnerApply,
  PartnerCalculator,
  PartnerCompare,
  PartnerFaq,
  PartnerFirstMonth,
  PartnerHero,
  PartnerPackages,
  PartnerProblem,
  PartnerProof,
  PartnerWhatYouGet,
} from '@/features/partner/components/PartnerSections'

export const metadata: Metadata = buildPageMetadata({
  path: '/partner',
  title: partnerCopy.meta.title,
  description: partnerCopy.meta.description,
  ownOgImage: true,
})

// Sharp Brain™ Partner Program — English only. Replaces /franchise-individual
// (301 → /partner, legacyRedirects.ts). Applications go to franchise_leads.
export default function PartnerPage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema([...partnerCopy.faq.items])
  return (
    <LanguageOverride lang="en">
      <div className="warm-light min-h-screen font-sans antialiased" lang="en">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
        <SiteNav showLanguageToggle={false} cta={{ label: partnerCopy.nav.cta, href: '#apply', external: false }} />
        <PartnerCalculatorProvider>
          <main>
            <PartnerHero />
            <PartnerProblem />
            <PartnerProof />
            <PartnerCalculator />
            <PartnerFirstMonth />
            <PartnerCompare />
            <PartnerWhatYouGet />
            <PartnerPackages />
            <PartnerAbout />
            <PartnerApply />
            <PartnerFaq />
          </main>
        </PartnerCalculatorProvider>
        <Footer />
        <WhatsAppWidget href={WHATSAPP_FRANCHISE_TEAM_INQUIRY_LINK} analyticsLocation="partner_widget" />
      </div>
    </LanguageOverride>
  )
}
