import { dayRange, startMonth, upcomingBatches } from '@/data/batches'

// Phase 5 — the screen after a free test's result (copy/tests.md; English
// from PHASE-5 part C): name + WhatsApp number, then "Sent" with the next
// offline batch from src/data/batches.ts.

type Lang = 'en' | 'hi'

export const testLeadCopy = {
  en: {
    title: 'Your result is ready',
    sub: "Shall we send it on WhatsApp? You'll get the full report and your next step.",
    name: 'Name',
    phone: 'WhatsApp number',
    button: 'Send my result on WhatsApp',
    small: 'No spam. Never more than one message a day.',
    sent: 'Sent. Your report is on WhatsApp.',
    nextBatch: 'Next batch:',
    seeWorkshop: 'See the workshop',
  },
  hi: {
    title: 'आपका रिज़ल्ट तैयार है',
    sub: 'वॉट्सऐप पर भेज दें? पूरी रिपोर्ट और अगला कदम साथ मिलेगा।',
    name: 'नाम',
    phone: 'वॉट्सऐप नंबर',
    button: 'रिज़ल्ट वॉट्सऐप पर भेजिए',
    small: 'कोई स्पैम नहीं। दिन में एक मैसेज से ज़्यादा नहीं।',
    sent: 'भेज दिया। आपकी रिपोर्ट वॉट्सऐप पर है।',
    nextBatch: 'अगली बैच:',
    seeWorkshop: 'वर्कशॉप देखिए',
  },
} as const satisfies Record<Lang, Record<string, string>>

const CITY: Record<'mumbai' | 'ahmedabad' | 'vadodara', Record<Lang, string>> = {
  mumbai: { en: 'Mumbai', hi: 'मुंबई' },
  ahmedabad: { en: 'Ahmedabad', hi: 'अहमदाबाद' },
  vadodara: { en: 'Vadodara', hi: 'वडोदरा' },
}

/** "Mumbai 14–15 November" — the nearest upcoming offline batch, or null when none is dated. */
export function nextBatchLabel(lang: Lang, now: Date = new Date()): string | null {
  const batch = upcomingBatches(now).find((b): b is typeof b & { id: 'mumbai' | 'ahmedabad' | 'vadodara' } => b.id === 'mumbai' || b.id === 'ahmedabad' || b.id === 'vadodara')
  if (batch === undefined) return null
  return `${CITY[batch.id][lang]} ${dayRange(batch)} ${startMonth(batch, lang)}`
}

/** The workshop page in the visitor's language. */
export const workshopHref = (lang: Lang): string => (lang === 'hi' ? '/telepathy-workshop?lang=hi' : '/telepathy-workshop')
