import { sharpBrainOffer } from '@/config/site.config'

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
}

const PRICE = `₹${sharpBrainOffer.introInr.toLocaleString('en-IN')}`
const SEATS = sharpBrainOffer.introSeats

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
      `पैरेंट्स के लिए Sharp Brain — पहली ${SEATS} सीट ${PRICE} में`,
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
    `Sharp Brain for parents — ${PRICE} for the first ${SEATS} seats`,
    `Please send my full report and tips.`,
  ]
    .filter((l): l is string => l !== null)
    .join('\n')
}
