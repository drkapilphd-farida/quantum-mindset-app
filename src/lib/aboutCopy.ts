import { brand, programs, trainer } from '@/config/site.config'
import { ORGANISATIONS_HREF } from '@/config/navigation'

// /about — the main trust page (site-rebuild Phase 6). Bio, numbers and
// photo come from site.config via TrainerBio; this module only holds the
// page framing and the three pillars.

type PillarLink = { label: string; href: string }

export type AboutCopy = {
  hero: { eyebrow: string; h1: string; tagline: string; ctaPrimary: PillarLink; ctaSecondary: PillarLink }
  story: { eyebrow: string; heading: string }
  company: { eyebrow: string }
  pillars: { eyebrow: string; title: string; items: { name: string; desc: string; links: PillarLink[] }[] }
  final: { title: string }
}

const FIND_PROGRAM_HREF = '/#solve'

const en: AboutCopy = {
  hero: {
    eyebrow: 'About',
    h1: `${trainer.name} — ${trainer.en.title}`,
    tagline: brand.tagline,
    ctaPrimary: { label: 'Find the right program', href: FIND_PROGRAM_HREF },
    ctaSecondary: { label: 'Invite Dr. Kapil to your organisation', href: ORGANISATIONS_HREF },
  },
  story: { eyebrow: 'His story', heading: 'From education to mind training' },
  company: { eyebrow: brand.name },
  pillars: {
    eyebrow: 'Three pillars',
    title: brand.tagline,
    items: [
      {
        name: 'Sharp Brain',
        desc: 'Focus, memory and smart reading — and clear thinking under pressure.',
        links: [
          { label: 'Sharp Brain™ programs', href: programs.sharpBrain.url },
          { label: programs.executiveWorkshop.name, href: programs.executiveWorkshop.url },
        ],
      },
      {
        name: 'Calm Mind',
        desc: 'Stop overthinking and handle stress with practical daily tools.',
        links: [
          { label: programs.overthinkingReset.name, href: programs.overthinkingReset.url },
          { label: '1-on-1 Mind Coaching', href: programs.oneOnOneCoaching.url },
        ],
      },
      {
        name: 'Meditation',
        desc: 'Deeper meditation and lasting inner calm — online or in residence.',
        links: [
          { label: 'Online Retreat', href: programs.onlineRetreat.url },
          { label: 'Residential Retreats', href: programs.residentialRetreat.url },
        ],
      },
    ],
  },
  final: { title: 'Where would you like to start?' },
}

const hi: AboutCopy = {
  hero: {
    eyebrow: 'परिचय',
    h1: `${trainer.nameHi} — ${trainer.hi.title}`,
    tagline: brand.taglineHi,
    ctaPrimary: { label: 'अपने लिए सही प्रोग्राम खोजें', href: FIND_PROGRAM_HREF },
    ctaSecondary: { label: 'डॉ. कपिल को अपनी संस्था में आमंत्रित करें', href: ORGANISATIONS_HREF },
  },
  story: { eyebrow: 'उनकी कहानी', heading: 'शिक्षा से माइंड ट्रेनिंग तक' },
  company: { eyebrow: brand.name },
  pillars: {
    eyebrow: 'तीन स्तंभ',
    title: brand.taglineHi,
    items: [
      {
        name: 'Sharp Brain',
        desc: 'फोकस, मेमोरी और स्मार्ट रीडिंग — और दबाव में भी स्पष्ट सोच।',
        links: [
          { label: 'Sharp Brain™ प्रोग्राम', href: programs.sharpBrain.url },
          { label: programs.executiveWorkshop.nameHi, href: programs.executiveWorkshop.url },
        ],
      },
      {
        name: 'शांत मन',
        desc: 'ओवरथिंकिंग रोकें और रोज़ के व्यावहारिक टूल्स से तनाव संभालें।',
        links: [
          { label: programs.overthinkingReset.nameHi, href: programs.overthinkingReset.url },
          { label: '1-on-1 माइंड कोचिंग', href: programs.oneOnOneCoaching.url },
        ],
      },
      {
        name: 'मेडिटेशन',
        desc: 'गहरा ध्यान और स्थायी आंतरिक शांति — ऑनलाइन या रेज़िडेंशियल।',
        links: [
          { label: 'ऑनलाइन रिट्रीट', href: programs.onlineRetreat.url },
          { label: 'रेजिडेंशियल रिट्रीट्स', href: programs.residentialRetreat.url },
        ],
      },
    ],
  },
  final: { title: 'आप कहां से शुरू करना चाहेंगे?' },
}

export const aboutCopy = { en, hi } as const
