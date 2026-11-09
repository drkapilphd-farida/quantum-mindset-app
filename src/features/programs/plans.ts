import { SESSION_PLAN_PRICES, type SessionPlanId } from '@/config/site.config'
import type { Bi, ProgramSlug } from './types'

// Personal Sessions plans (owner's plans brief, Nov 2026). Fees live in
// site.config.ts (SESSION_PLAN_PRICES); this file holds the words. English
// exactly as in the brief; Hindi pending the owner's approval.

export type { SessionPlanId }

const inr = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`

export type Plan = {
  id: SessionPlanId
  name: Bi
  /** "What's included", one line per item (the brief's "+" separated list). */
  includes: Bi[]
  fee: string
  perSession: string
  mostChosen: boolean
}

const plan = (id: SessionPlanId, name: Bi, includes: Bi[]): Plan => ({
  id,
  name,
  includes,
  fee: inr(SESSION_PLAN_PRICES[id].feeInr),
  perSession: inr(SESSION_PLAN_PRICES[id].perSessionInr),
  mostChosen: id === 'core',
})

export const PLANS: readonly Plan[] = [
  plan('clarity', { en: 'Clarity Session', hi: 'क्लैरिटी सेशन' }, [
    { en: '1 session (60 min)', hi: '1 सेशन (60 मिनट)' },
    { en: '1 personal recording', hi: '1 पर्सनल रिकॉर्डिंग' },
  ]),
  plan('starter', { en: 'Starter · 2 days', hi: 'स्टार्टर · 2 दिन' }, [
    { en: '2 sessions', hi: '2 सेशन' },
    { en: '2 personal recordings', hi: '2 पर्सनल रिकॉर्डिंग' },
    { en: '7 days WhatsApp support', hi: '7 दिन WhatsApp सपोर्ट' },
  ]),
  plan('core', { en: 'Core · 7 days', hi: 'कोर · 7 दिन' }, [
    { en: '7 sessions', hi: '7 सेशन' },
    { en: '5 personal recordings', hi: '5 पर्सनल रिकॉर्डिंग' },
    { en: '21 days support', hi: '21 दिन सपोर्ट' },
  ]),
  plan('transformation', { en: 'Transformation · 1 month', hi: 'ट्रांसफ़ॉर्मेशन · 1 महीना' }, [
    { en: '12 sessions', hi: '12 सेशन' },
    { en: 'Personal recording library', hi: 'पर्सनल रिकॉर्डिंग लाइब्रेरी' },
    { en: '30 days support', hi: '30 दिन सपोर्ट' },
  ]),
  plan('mastery', { en: 'Mastery · 3 months', hi: 'मास्टरी · 3 महीने' }, [
    { en: '24 sessions (2 a week)', hi: '24 सेशन (हफ़्ते में 2)' },
    { en: 'Advanced practices', hi: 'एडवांस्ड अभ्यास' },
  ]),
  plan('mentorship', { en: 'Mentorship · 6 months', hi: 'मेंटरशिप · 6 महीने' }, [
    { en: '48 sessions', hi: '48 सेशन' },
    { en: 'Monthly review', hi: 'मासिक समीक्षा' },
    { en: 'Priority support', hi: 'प्राथमिकता से सपोर्ट' },
  ]),
]

export const PLAN_IDS: readonly SessionPlanId[] = PLANS.map((p) => p.id)

export function getPlan(id: SessionPlanId): Plan {
  const found = PLANS.find((p) => p.id === id)
  if (found === undefined) throw new Error(`Unknown plan: ${id}`)
  return found
}

export function isPlanId(value: string | null | undefined): value is SessionPlanId {
  return value !== null && value !== undefined && (PLAN_IDS as readonly string[]).includes(value)
}

const clarityFee = inr(SESSION_PLAN_PRICES.clarity.feeInr)

export const PLAN_COPY = {
  hubTitle: { en: 'Choose your plan', hi: 'अपना प्लान चुनें' },
  programTitle: { en: 'Plans for this program', hi: 'इस प्रोग्राम के लिए प्लान' },
  mostChosen: { en: 'Most chosen', hi: 'सबसे ज़्यादा चुना गया' },
  perSession: (amount: string): Bi => ({ en: `${amount} per session`, hi: `${amount} प्रति सेशन` }),
  choose: { en: 'Choose this plan', hi: 'यह प्लान चुनें' },
  seeAll: { en: 'See all plans →', hi: 'सारे प्लान देखिए →' },
  rules: [
    {
      en: `Your ${clarityFee} Clarity Session fee is fully adjusted if you join any plan within 7 days.`,
      hi: `अगर आप 7 दिन के भीतर कोई भी प्लान जॉइन करते हैं, तो आपकी ${clarityFee} की क्लैरिटी सेशन फ़ीस पूरी तरह एडजस्ट हो जाती है।`,
    },
    { en: 'EMI available on the 1-month, 3-month and 6-month plans.', hi: '1 महीने, 3 महीने और 6 महीने के प्लान पर EMI उपलब्ध है।' },
    { en: 'All sessions are 1-on-1 with Dr. Kapil, online or in person in Vadodara.', hi: 'सभी सेशन डॉ. कपिल के साथ 1-on-1 होते हैं, ऑनलाइन या वडोदरा में आमने-सामने।' },
  ] as Bi[],
  afterFoundation: {
    en: 'These practices are taught only after the foundation level, so they are offered in the 3- and 6-month plans.',
    hi: 'ये अभ्यास सिर्फ़ फ़ाउंडेशन लेवल के बाद सिखाए जाते हैं, इसलिए ये 3 और 6 महीने के प्लान में ही मिलते हैं।',
  },
  /** Booking form. */
  formLabel: { en: 'Plan', hi: 'प्लान' },
} as const

const CALM: SessionPlanId[] = ['starter', 'core', 'transformation']
const SKILL: SessionPlanId[] = ['core', 'transformation', 'mastery']
const DEEP: SessionPlanId[] = ['mastery', 'mentorship']

/** Which plans each program page shows (owner's table). */
export const PROGRAM_PLANS: Record<ProgramSlug, SessionPlanId[]> = {
  'stress-anxiety-support': CALM,
  'mindset-coaching': CALM,
  'subconscious-reprogramming': CALM,
  'business-loss-mindset': CALM,
  'heart-brain-coherence': CALM,
  telepathy: SKILL,
  'intuition-for-traders': SKILL,
  'cosmic-fusion': SKILL,
  manifestation: SKILL,
  'aura-reading': SKILL,
  'chakra-activation': SKILL,
  'samadhi-meditation': DEEP,
  'kundalini-meditation': DEEP,
  'astral-projection': DEEP,
  'personal-retreat': ['core', 'transformation'],
}
