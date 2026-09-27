import { programs, brand } from './site.config'
import { WHATSAPP_GENERAL_INQUIRY_LINK } from './whatsappSupportLink'

// Site-wide navigation (header + footer), built from the programs registry
// so names and URLs never drift from site.config.ts. Grouped by pillar:
// Brain · Mind · Meditation.

type Lang = 'en' | 'hi'

export type NavLink = { label: string; href: string; external?: boolean }
export type NavGroup = { heading: string; links: NavLink[] }

export const FREE_TEST_LINKS = {
  speedTest: '/programs/quantum-speed-reading/speed-test',
  overthinkingTest: '/mind-assessment',
} as const

export const ORGANISATIONS_HREF = '/executive-brain-workshop#corporate'
export const CONTACT_EMAIL = 'info@mindurmind.org.in'
export const TALK_TO_US_HREF = WHATSAPP_GENERAL_INQUIRY_LINK

function n(id: keyof typeof programs, lang: Lang): string {
  return lang === 'hi' ? programs[id].nameHi : programs[id].name
}

/** Programs dropdown, grouped by pillar. */
export function programGroups(lang: Lang): NavGroup[] {
  const hi = lang === 'hi'
  return [
    {
      heading: hi ? 'ब्रेन' : 'Brain',
      links: [
        { label: n('qsr', lang), href: programs.qsr.url },
        { label: n('executiveWorkshop', lang), href: programs.executiveWorkshop.url },
      ],
    },
    {
      heading: hi ? 'माइंड' : 'Mind',
      links: [
        { label: n('overthinkingReset', lang), href: programs.overthinkingReset.url },
        { label: n('oneOnOneCoaching', lang), href: programs.oneOnOneCoaching.url },
      ],
    },
    {
      heading: hi ? 'मेडिटेशन' : 'Meditation',
      links: [
        { label: n('onlineRetreat', lang), href: programs.onlineRetreat.url },
        { label: n('residentialRetreat', lang), href: programs.residentialRetreat.url },
      ],
    },
  ]
}

export function freeTestLinks(lang: Lang): NavLink[] {
  const hi = lang === 'hi'
  return [
    { label: hi ? 'रीडिंग स्पीड टेस्ट' : 'Reading Speed Test', href: FREE_TEST_LINKS.speedTest },
    { label: hi ? 'ओवरथिंकिंग टेस्ट' : 'Overthinking Test', href: FREE_TEST_LINKS.overthinkingTest },
    { label: n('focusStarter', lang), href: programs.focusStarter.url },
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

/** Footer columns: Brain / Mind / Meditation / Free Tests / For Organisations / For Trainers. */
export function footerGroups(lang: Lang): NavGroup[] {
  const hi = lang === 'hi'
  return [
    ...programGroups(lang),
    { heading: hi ? 'फ्री टेस्ट' : 'Free Tests', links: freeTestLinks(lang) },
    {
      heading: hi ? 'संस्थाओं के लिए' : 'For Organisations',
      links: [
        { label: hi ? 'कॉर्पोरेट टीमें' : 'Corporate teams', href: ORGANISATIONS_HREF },
        { label: hi ? 'स्कूल' : 'Schools', href: ORGANISATIONS_HREF },
      ],
    },
    {
      heading: hi ? 'ट्रेनर्स के लिए' : 'For Trainers',
      links: [{ label: n('franchise', lang), href: programs.franchise.url }],
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

export const FOOTER_LOCATION = { en: `${brand.city}, Gujarat, India`, hi: 'वडोदरा, गुजरात, भारत' } as const
