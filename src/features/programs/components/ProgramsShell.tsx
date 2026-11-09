import { LanguageOverride } from '@/context/LanguageContext'
import SiteNav from '@/components/site/SiteNav'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { WHATSAPP_MENTORING_INQUIRY_LINK } from '@/config/whatsappSupportLink'
import { mukta } from '../font'
import type { ProgramLang } from '../types'

// Page frame for the hub and the program pages: the site header and footer
// (their own font), Mukta only on the page content, page background #FBFAF7.
export function ProgramsShell({
  lang,
  path,
  ctaHref,
  ctaLabel,
  schemas,
  children,
}: {
  lang: ProgramLang
  path: string
  ctaHref: string
  ctaLabel: string
  schemas: string[]
  children: React.ReactNode
}): React.JSX.Element {
  const languageLink = lang === 'hi' ? { label: 'English', href: path } : { label: 'हिंदी', href: `${path}?lang=hi` }
  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light min-h-screen font-sans antialiased" lang={lang}>
        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        ))}
        <SiteNav languageLink={languageLink} cta={{ label: ctaLabel, href: ctaHref, external: false }} />
        <main className={`${mukta.className} bg-[#FBFAF7] leading-[1.6] text-[#0E1B2C]`}>{children}</main>
        <Footer />
        <WhatsAppWidget href={WHATSAPP_MENTORING_INQUIRY_LINK} analyticsLocation="personal_sessions_widget" bottomClassName="bottom-24 md:bottom-7" />
      </div>
    </LanguageOverride>
  )
}
