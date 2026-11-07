import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { buildFaqPageSchema } from '@/lib/seo/faqSchema'
import { LanguageOverride } from '@/context/LanguageContext'
import { WHATSAPP_MENTORING_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { personalSessionsCopy } from '@/features/personal-sessions/personalSessionsCopy'
import { SessionsAbout, SessionsEnquiry, SessionsFaq, SessionsGroups, SessionsHero, SessionsProcess } from '@/features/personal-sessions/components/PersonalSessionsSections'

export const metadata: Metadata = buildPageMetadata({
  path: '/personal-sessions',
  title: personalSessionsCopy.meta.title,
  description: personalSessionsCopy.meta.description,
  ownOgImage: true,
})

// 1-on-1 Personal Sessions with Dr. Kapil (owner, Nov 2026) — replaces
// /mentoring/personal-class (301). The held telepathy, traders and
// Vadodara pages redirect here (heldPages.ts). English only.
export default function PersonalSessionsPage(): React.JSX.Element {
  const faqSchema = buildFaqPageSchema([...personalSessionsCopy.faq.items])
  return (
    <LanguageOverride lang="en">
      <div className="warm-light min-h-screen font-sans antialiased" lang="en">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
        <SiteNav showLanguageToggle={false} cta={{ label: personalSessionsCopy.nav.cta, href: '#enquire', external: false }} />
        <main>
          <SessionsHero />
          <SessionsGroups />
          <SessionsProcess />
          <SessionsAbout />
          <SessionsEnquiry />
          <SessionsFaq />
        </main>
        <Footer />
        <WhatsAppWidget href={WHATSAPP_MENTORING_INQUIRY_LINK} analyticsLocation="personal_sessions_widget" />
      </div>
    </LanguageOverride>
  )
}
