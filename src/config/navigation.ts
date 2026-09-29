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
  speedTest: '/programs/sharp-brain/speed-test',
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
        { label: hi ? '1-on-1 माइंड कोचिंग' : '1-on-1 Mind Coaching', href: programs.oneOnOneCoaching.url },
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
    { label: hi ? 'रीडिंग स्पीड टेस्ट' : 'Reading Speed Test', href: FREE_TEST_LINKS.speedTest },
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

/** Footer columns: Sharp Brain / Calm Mind / Meditation / Free Tests / For Organisations / For Trainers. */
export function footerGroups(lang: Lang): NavGroup[] {
  const hi = lang === 'hi'
  return [
    ...programGroups(lang),
    { heading: hi ? 'फ्री टेस्ट' : 'Free Tests', links: freeTestLinks(lang) },
    {
      heading: hi ? 'संस्थाओं के लिए' : 'For Organisations',
      links: [
        { label: hi ? 'कॉर्पोरेट टीमें' : 'Corporate teams', href: ORGANISATIONS_HREF },
        { label: hi ? 'स्कूल व कॉलेज' : 'Schools & colleges', href: SCHOOLS_HREF },
      ],
    },
    {
      heading: hi ? 'ट्रेनर्स के लिए' : 'For Trainers',
      links: [{ label: hi ? 'ट्रेनर पार्टनर बनें' : 'Become a Trainer Partner', href: programs.franchise.url }],
    },
  ]
}

export function footerMetaLinks(lang: Lang): NavLink[] {
  const hi = lang === 'hi'
  return [
    { label: hi ? 'परिचय' : 'About', href: '/about' },
    { label: hi ? 'संपर्क' : 'Contact', href: '/contact' },
    { label: hi ? 'प्राइवेसी पॉलिसी' : 'Privacy Policy', href: '/privacy' },
    { label: hi ? 'सेवा की शर्तें' : 'Terms of Service', href: '/terms' },
    { label: hi ? 'रिफंड व कैंसिलेशन नीति' : 'Refund & Cancellation Policy', href: '/refund-policy' },
  ]
}

export const FOOTER_LOCATION = contact.address
