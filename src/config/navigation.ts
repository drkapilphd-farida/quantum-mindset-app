import { programs, contact } from './site.config'
import { WHATSAPP_GENERAL_INQUIRY_LINK } from './whatsappSupportLink'

// Site-wide navigation (header + footer), built from the programs registry
// so URLs never drift from site.config.ts. Grouped by pillar, matching the
// tagline "Sharp Brain. Calm Mind. Better Life.": Sharp Brain · Calm Mind ·
// Meditation. Menu labels are deliberately shorter than the registry names.

type Lang = 'en' | 'hi'

export type NavLink = { label: string; href: string; external?: boolean }
export type NavGroup = { heading: string; links: NavLink[] }

export const FREE_TEST_LINKS = {
  speedTest: '/reading-memory-test',
  overthinkingTest: '/mind-assessment',
} as const

export const ORGANISATIONS_HREF = '/corporate'
export const SCHOOLS_HREF = '/corporate#schools'
export const CONTACT_EMAIL = contact.email
export const TALK_TO_US_HREF = WHATSAPP_GENERAL_INQUIRY_LINK

function n(id: keyof typeof programs, lang: Lang): string {
  return lang === 'hi' ? programs[id].nameHi : programs[id].name
}

/** Programs dropdown, grouped by pillar. */
export function programGroups(lang: Lang): NavGroup[] {
  const hi = lang === 'hi'
  return [
    {
      heading: 'Sharp Brain',
      links: [
        { label: hi ? 'Sharp Brain™ प्रोग्राम' : 'Sharp Brain™ Program', href: programs.sharpBrain.url },
        { label: 'Executive Workshop', href: programs.executiveWorkshop.url },
      ],
    },
    {
      heading: hi ? 'शांत मन' : 'Calm Mind',
      links: [
        { label: n('overthinkingReset', lang), href: programs.overthinkingReset.url },
        { label: hi ? 'पर्सनल सेशन (1-on-1)' : 'Personal Sessions (1-on-1)', href: programs.oneOnOneCoaching.url },
      ],
    },
    {
      heading: hi ? 'मेडिटेशन' : 'Meditation',
      links: [
        { label: hi ? 'ऑनलाइन रिट्रीट' : 'Online Retreat', href: programs.onlineRetreat.url },
        { label: hi ? 'रेजिडेंशियल रिट्रीट्स' : 'Residential Retreats', href: programs.residentialRetreat.url },
      ],
    },
  ]
}

export function freeTestLinks(lang: Lang): NavLink[] {
  const hi = lang === 'hi'
  return [
    { label: hi ? 'मुफ़्त Reading और Memory Test' : 'Free Reading & Memory Test', href: FREE_TEST_LINKS.speedTest },
    { label: hi ? 'ओवरथिंकिंग टेस्ट' : 'Overthinking Test', href: FREE_TEST_LINKS.overthinkingTest },
  ]
}

export function navLabels(lang: Lang): {
  programs: string
  freeTests: string
  organisations: string
  about: string
  contact: string
  talkToUs: string
  openMenu: string
  closeMenu: string
} {
  const hi = lang === 'hi'
  return {
    programs: hi ? 'प्रोग्राम' : 'Programs',
    freeTests: hi ? 'फ्री टेस्ट' : 'Free Tests',
    organisations: hi ? 'संस्थाओं के लिए' : 'For Organisations',
    about: hi ? 'परिचय' : 'About',
    contact: hi ? 'संपर्क' : 'Contact',
    talkToUs: hi ? 'हमसे बात करें' : 'Talk to Us',
    openMenu: hi ? 'मेनू खोलें' : 'Open menu',
    closeMenu: hi ? 'मेनू बंद करें' : 'Close menu',
  }
}

// ── Positioning rework: header + footer from copy/header-footer.md ──────
// Hindi pages show the Hindi labels, English pages the English ones.
// Phase 4.3: the workshop pages open in English; Hindi pages link to their
// Hindi versions (?lang=hi).

// Owner (Nov 2026): the business focus is Sharp Brain and Personal
// Sessions. The telepathy workshop is on hold (heldPages.ts) and is no
// longer linked from the header or footer.

/** Sharp Brain in the visitor's language (its Hindi version is ?lang=hi). */
function sharpBrainUrl(lang: Lang, hash = ''): string {
  return lang === 'hi' ? `${programs.sharpBrain.url}?lang=hi${hash}` : `${programs.sharpBrain.url}${hash}`
}

/** Main nav: Sharp Brain · Personal Sessions · Reviews · Become a Partner · Contact. */
export function siteNavLinks(lang: Lang): NavLink[] {
  const hi = lang === 'hi'
  return [
    { label: 'Sharp Brain', href: sharpBrainUrl(lang) },
    { label: hi ? 'पर्सनल सेशन' : 'Personal Sessions', href: programs.oneOnOneCoaching.url },
    { label: hi ? 'रिव्यू' : 'Reviews', href: '/reviews' },
    { label: hi ? 'पार्टनर बनिए' : 'Become a Partner', href: programs.franchise.url },
    { label: hi ? 'संपर्क' : 'Contact', href: '/contact' },
  ]
}

/** The nav button on pages that don't pass their own: the Sharp Brain offers. */
export function siteNavCta(lang: Lang): NavLink {
  return { label: lang === 'hi' ? 'Sharp Brain से जुड़िए' : 'Join Sharp Brain', href: sharpBrainUrl(lang, '#enrol') }
}

/** Footer column 1 (programs) and column 2 (more). Hindi column headings only — the English copy has none. */
export function footerColumns(lang: Lang): { heading: string | null; links: NavLink[] }[] {
  const hi = lang === 'hi'
  return [
    {
      heading: hi ? 'प्रोग्राम' : null,
      links: [
        { label: 'Sharp Brain', href: sharpBrainUrl(lang) },
        { label: hi ? 'पर्सनल सेशन' : 'Personal Sessions', href: programs.oneOnOneCoaching.url },
        { label: hi ? '21 दिन ओवरथिंकिंग' : '21-Day Overthinking', href: programs.overthinkingReset.url },
        { label: hi ? '11 रात रिट्रीट' : '11-Night Retreat', href: programs.onlineRetreat.url },
        { label: hi ? 'रेसिडेंशियल रिट्रीट' : 'Residential Retreat', href: programs.residentialRetreat.url },
      ],
    },
    {
      heading: hi ? 'और' : null,
      links: [
        { label: hi ? 'रिव्यू' : 'Reviews', href: '/reviews' },
        { label: hi ? 'गैलरी' : 'Gallery', href: '/gallery' },
        { label: hi ? 'मेरी कहानी' : 'My story', href: '/about' },
        { label: hi ? 'पार्टनर बनिए' : 'Become a Partner', href: programs.franchise.url },
        { label: hi ? 'कॉर्पोरेट' : 'Corporate', href: ORGANISATIONS_HREF },
        { label: hi ? 'संपर्क' : 'Contact', href: '/contact' },
      ],
    },
  ]
}

/** Footer column 3 (address) — copy/header-footer.md; English uses the existing English address. */
export function footerAddress(lang: Lang): { heading: string | null; address: string; whatsappSuffix: string; googleReviews: string } {
  const hi = lang === 'hi'
  return {
    heading: hi ? 'पता' : null,
    address: hi ? 'Gitanjali Duplex, Novino–Tarsali Road, वडोदरा, गुजरात' : contact.address.en,
    whatsappSuffix: hi ? '(वॉट्सऐप)' : '(WhatsApp)',
    googleReviews: hi ? 'Google पर रिव्यू' : 'Reviews on Google',
  }
}

/** Footer bottom row. */
export function footerBottom(lang: Lang): { links: NavLink[]; copyright: string } {
  const hi = lang === 'hi'
  return {
    links: [
      { label: hi ? 'प्राइवेसी' : 'Privacy', href: '/privacy' },
      { label: hi ? 'शर्तें' : 'Terms', href: '/terms' },
      { label: hi ? 'रिफंड' : 'Refund', href: '/refund-policy' },
    ],
    copyright: hi ? '© मन उर मन 2014–2026' : '© Mind Ur Mind 2014–2026',
  }
}
