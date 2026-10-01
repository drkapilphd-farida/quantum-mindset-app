import { IST_OFFSET_MS } from './batches'

// Words for the batch / price / countdown UI, EN + HI. Dates are always
// shown in IST, whatever the visitor's own time zone.

export function inr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
} as const

/** "15 Oct" / "15 अक्टूबर" for an instant, in IST. */
export function istDayMonth(ms: number, lang: 'en' | 'hi'): string {
  const d = new Date(ms + IST_OFFSET_MS)
  return `${d.getUTCDate()} ${MONTHS[lang][d.getUTCMonth()]}`
}

/** The last IST day an offer ending (exclusively) at `endsAtMs` is still on, e.g. "10 Oct, 11:59 PM IST". */
export function istDeadline(endsAtMs: number, lang: 'en' | 'hi'): string {
  const last = endsAtMs - 60_000
  const d = new Date(last + IST_OFFSET_MS)
  const h = d.getUTCHours()
  const m = String(d.getUTCMinutes()).padStart(2, '0')
  const h12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? 'AM' : 'PM'
  return lang === 'hi' ? `${istDayMonth(last, 'hi')}, ${h12}:${m} ${ampm} IST` : `${istDayMonth(last, 'en')}, ${h12}:${m} ${ampm} IST`
}

export function countdownParts(remainingMs: number): { d: number; h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(remainingMs / 1000))
  return { d: Math.floor(total / 86_400), h: Math.floor((total % 86_400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 }
}

export const enrolCopy = {
  en: {
    enrolNow: (price: string) => `Enrol now · ${price}`,
    earlyBirdFor: (date: string) => `Early-bird for the ${date} batch`,
    endsIn: 'ends in',
    endsOn: (deadline: string) => `Ends ${deadline}`,
    regularLine: (date: string) => `Next batch starts ${date}`,
    oneTime: 'One-time payment',
    perDay: (price: string) => `≈ ${price} a day for 30 days`,
    chooseBatch: 'Choose your batch',
    batchOption: (date: string) => `Starts ${date}`,
    earlyBirdTag: 'Early-bird',
    offerTag: 'Your test offer',
    seatsLeft: (n: number) => `${n} seats per batch`,
    redirecting: 'Opening secure checkout…',
    emailLabel: 'Your email',
    emailHint: 'Use the email you will sign in to the app with — your access is linked to it.',
    nameLabel: 'Name (optional)',
    secure: 'Secure checkout via Razorpay',
    errors: {
      invalid_email: 'Please enter a valid email address.',
      batch_closed: 'That batch has just closed for enrolment. Please choose the next one.',
      unavailable: 'Online checkout is not available for this price right now. Please message us on WhatsApp and we will send your payment link.',
      rate_limited: 'Too many attempts. Please wait a minute and try again.',
    },
    whatsappEnrol: (date: string, price: string) => `Hi, I want to enrol in the Sharp Brain 30-Day Program (batch starting ${date}, ${price}). Please send me the payment link.`,
    chatOnWhatsapp: 'Chat on WhatsApp',
    units: { d: 'd', h: 'h', m: 'm', s: 's' },
  },
  hi: {
    enrolNow: (price: string) => `अभी जुड़ें · ${price}`,
    earlyBirdFor: (date: string) => `${date} बैच के लिए अर्ली-बर्ड`,
    endsIn: 'ख़त्म होने में',
    endsOn: (deadline: string) => `${deadline} तक`,
    regularLine: (date: string) => `अगला बैच ${date} से`,
    oneTime: 'एकमुश्त भुगतान',
    perDay: (price: string) => `30 दिनों के लिए रोज़ लगभग ${price}`,
    chooseBatch: 'अपना बैच चुनें',
    batchOption: (date: string) => `${date} से शुरू`,
    earlyBirdTag: 'अर्ली-बर्ड',
    offerTag: 'आपका टेस्ट ऑफ़र',
    seatsLeft: (n: number) => `हर बैच में ${n} सीटें`,
    redirecting: 'सुरक्षित चेकआउट खुल रहा है…',
    emailLabel: 'आपका ईमेल',
    emailHint: 'वही ईमेल डालें जिससे आप ऐप में साइन इन करेंगे — आपका एक्सेस इसी से जुड़ता है।',
    nameLabel: 'नाम (वैकल्पिक)',
    secure: 'Razorpay के ज़रिए सुरक्षित चेकआउट',
    errors: {
      invalid_email: 'कृपया सही ईमेल पता डालें।',
      batch_closed: 'इस बैच का नामांकन अभी बंद हुआ है। कृपया अगला बैच चुनें।',
      unavailable: 'इस कीमत के लिए अभी ऑनलाइन चेकआउट उपलब्ध नहीं है। कृपया WhatsApp पर संदेश भेजें, हम आपको पेमेंट लिंक भेज देंगे।',
      rate_limited: 'बहुत ज़्यादा कोशिशें। कृपया एक मिनट रुककर फिर कोशिश करें।',
    },
    whatsappEnrol: (date: string, price: string) => `नमस्ते, मुझे Sharp Brain 30-दिवसीय प्रोग्राम में जुड़ना है (बैच ${date} से, ${price})। कृपया पेमेंट लिंक भेजें।`,
    chatOnWhatsapp: 'WhatsApp पर बात करें',
    units: { d: 'दिन', h: 'घं', m: 'मि', s: 'से' },
  },
} as const
