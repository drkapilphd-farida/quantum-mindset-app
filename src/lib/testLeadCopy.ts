// Phase 5 — the screen after a free test's result (copy/tests.md; English
// from PHASE-5 part C): name + WhatsApp number, then "Sent".
// Nov 2026 (owner): the next step is Sharp Brain after the Reading & Memory
// Test and Personal Sessions after the Overthinking Test — no workshop.

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
    nextStep: 'Your next step:',
    seeSharpBrain: 'See Sharp Brain',
    seeSessions: 'See Personal Sessions',
  },
  hi: {
    title: 'आपका रिज़ल्ट तैयार है',
    sub: 'वॉट्सऐप पर भेज दें? पूरी रिपोर्ट और अगला कदम साथ मिलेगा।',
    name: 'नाम',
    phone: 'वॉट्सऐप नंबर',
    button: 'रिज़ल्ट वॉट्सऐप पर भेजिए',
    small: 'कोई स्पैम नहीं। दिन में एक मैसेज से ज़्यादा नहीं।',
    sent: 'भेज दिया। आपकी रिपोर्ट वॉट्सऐप पर है।',
    nextStep: 'आपका अगला कदम:',
    seeSharpBrain: 'Sharp Brain देखिए',
    seeSessions: 'पर्सनल सेशन देखिए',
  },
} as const satisfies Record<Lang, Record<string, string>>

/** After the Reading & Memory Test: Sharp Brain in the visitor's language. */
export const sharpBrainHref = (lang: Lang): string => (lang === 'hi' ? '/programs/sharp-brain?lang=hi' : '/programs/sharp-brain')

/** After the Overthinking Test: Personal Sessions (English page). */
export const sessionsHref = '/personal-sessions'
