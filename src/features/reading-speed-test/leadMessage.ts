// The WhatsApp message a test taker sends to Dr. Kapil's number right after
// leaving their number, so every lead reaches the founder even if the
// saved row is never looked at. Only the person's own results.
export type LeadMessageInput = {
  lang: 'en' | 'hi'
  firstName: string
  effectiveWpm: number | null
  wpm: number | null
  comprehensionPercent: number | null
  retention: { correct: number; total: number } | null
  memory: { correct: number; total: number } | null
  profileName: string | null
  offer: { code: string; expiresAtMs: number } | null
}

/** A short code the founder can read back from the chat: SB- + the first 6 characters of the offer id. */
export function offerCode(offerId: string): string {
  return `SB-${offerId.replace(/-/g, '').slice(0, 6).toUpperCase()}`
}

function expiry(ms: number, lang: 'en' | 'hi'): string {
  return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN-u-nu-latn' : 'en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date(ms))
}

export function leadWhatsappMessage(m: LeadMessageInput): string {
  const name = m.firstName.trim()
  if (m.lang === 'hi') {
    return [
      `नमस्ते डॉ. कपिल, मैंने मुफ़्त Reading और Memory Test दिया।`,
      name ? `नाम: ${name}` : null,
      m.effectiveWpm !== null ? `Effective speed: ${m.effectiveWpm} WPM${m.wpm !== null && m.comprehensionPercent !== null ? ` (पढ़ना ${m.wpm} WPM, समझ ${m.comprehensionPercent}%)` : ''}` : null,
      m.retention ? `Retention: ${m.retention.total} में से ${m.retention.correct}` : null,
      m.memory ? `Memory: ${m.memory.total} में से ${m.memory.correct}` : null,
      m.profileName ? `Profile: ${m.profileName}` : null,
      m.offer ? `ऑफ़र: Sharp Brain पर ₹1,000 की छूट — कोड ${m.offer.code}, ${expiry(m.offer.expiresAtMs, 'hi')} तक` : null,
      `कृपया मेरी पूरी रिपोर्ट और टिप्स भेजें।`,
    ]
      .filter((l): l is string => l !== null)
      .join('\n')
  }
  return [
    `Hi Dr. Kapil, I took the Free Reading & Memory Test.`,
    name ? `Name: ${name}` : null,
    m.effectiveWpm !== null ? `Effective speed: ${m.effectiveWpm} WPM${m.wpm !== null && m.comprehensionPercent !== null ? ` (reading ${m.wpm} WPM, understanding ${m.comprehensionPercent}%)` : ''}` : null,
    m.retention ? `Retention: ${m.retention.correct} of ${m.retention.total}` : null,
    m.memory ? `Memory: ${m.memory.correct} of ${m.memory.total}` : null,
    m.profileName ? `Profile: ${m.profileName}` : null,
    m.offer ? `Offer: ₹1,000 off Sharp Brain — code ${m.offer.code}, valid till ${expiry(m.offer.expiresAtMs, 'en')}` : null,
    `Please send my full report and tips.`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n')
}
