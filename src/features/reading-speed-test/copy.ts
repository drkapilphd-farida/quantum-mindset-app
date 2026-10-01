import { sharpBrainEnrolment } from '@/config/site.config'

const inr = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`
const DISCOUNT = inr(sharpBrainEnrolment.testOffer.discountInr)
const HOURS = sharpBrainEnrolment.testOffer.validHours

export type SpeedTestCopy = {
  eyebrow: string
  title: string
  intro: string
  passageLanguage: string
  start: string
  readingHint: string
  scrollHint: string
  done: string
  questionsTitle: string
  passageHidden: string
  seeResult: string
  loading: string
  effectiveSpeed: string
  readingSpeed: string
  comprehension: string
  validNote: string
  tooFast: string
  lowComprehension: (percent: number) => string
  retry: string
  practiceCta: string
  practiceIntro: (pace: number) => string
  practiceBegin: string
  practiceQuestionsTitle: string
  practiceResult: (pace: number, percent: number) => string
  nextStep: string
  seeProgram: string
  whatsapp: string
  whatsappMessage: (effectiveWpm: number | null) => string
  phoneLabel: string
  phoneLabelOffer: string
  offerLinked: string
  offerUnlocked: (price: string, regular: string) => string
  offerValid: string
  offerWhatsapp: string
  offerWhatsappMessage: (effectiveWpm: number | null, offerUrl: string) => string
  phonePlaceholder: string
  phoneSubmit: string
  phoneSaved: string
  phoneNote: string
  nameLabel: string
  wpm: string
}

export const speedTestCopy: Record<'en' | 'hi', SpeedTestCopy> = {
  en: {
    eyebrow: 'Free Reading Speed Test',
    title: "What's your real reading speed?",
    intro:
      'Read one passage at your normal pace, then answer 5 questions about it. Your result is your Effective Reading Speed — how fast you read with understanding.',
    passageLanguage: 'Passage language',
    start: 'Start',
    readingHint: 'Read at your normal pace. Tap Done when you finish.',
    scrollHint: 'Scroll to the end of the passage to finish.',
    done: 'Done',
    questionsTitle: '5 questions about what you read',
    passageHidden: 'The passage is hidden now. Answer from memory.',
    seeResult: 'See my result',
    loading: 'Please wait…',
    effectiveSpeed: 'Effective Reading Speed',
    readingSpeed: 'Reading speed',
    comprehension: 'Comprehension',
    validNote: 'Most students and adults read with understanding at roughly 200–300 WPM.',
    tooFast: "We couldn't measure this — it looks like the passage wasn't fully read. Please try again at your normal pace.",
    lowComprehension: (percent) => `You read fast, but understood ${percent}%. Reading only helps when you remember — try again carefully.`,
    retry: 'Try again with a new passage',
    practiceCta: 'See how practice works in the Sharp Brain app →',
    practiceIntro: (pace) => `Words will appear one at a time at ${pace} WPM, as in the app's practice. Keep your eyes on the centre.`,
    practiceBegin: 'Begin',
    practiceQuestionsTitle: '3 quick questions',
    practiceResult: (pace, percent) =>
      `With guided practice you read at ${pace} WPM and understood ${percent}%. The 30-day program trains your own reading speed with this kind of practice.`,
    nextStep: 'Your next step',
    seeProgram: 'See the Sharp Brain 30-Day Program →',
    whatsapp: 'Questions? Chat on WhatsApp',
    whatsappMessage: (eff) =>
      eff === null
        ? 'I took the Reading Speed Test. I want to know about Sharp Brain.'
        : `I took the Reading Speed Test — my Effective Speed is ${eff}. I want to know about Sharp Brain.`,
    phoneLabel: 'Get your result on WhatsApp (optional)',
    phoneLabelOffer: `Get your result on WhatsApp — and unlock ${DISCOUNT} off the 30-Day Program (optional)`,
    offerLinked: 'Your offer is linked to this number.',
    offerUnlocked: (price, regular) => `Your test unlocked ${DISCOUNT} off — ${price} instead of ${regular}.`,
    offerValid: `Valid for ${HOURS} hours:`,
    offerWhatsapp: 'Send my offer link to WhatsApp',
    offerWhatsappMessage: (eff, url) =>
      `I took the Reading Speed Test${eff === null ? '' : ` — my Effective Speed is ${eff}`}. My ${DISCOUNT} Sharp Brain offer: ${url}`,
    phonePlaceholder: 'WhatsApp number',
    phoneSubmit: 'Send me my result',
    phoneSaved: "Saved. Dr. Kapil's team will send your result on WhatsApp.",
    phoneNote: "We'll send your result on WhatsApp and may contact you about Sharp Brain. You can ask us to delete your number any time.",
    nameLabel: 'First name (optional)',
    wpm: 'WPM',
  },
  hi: {
    eyebrow: 'फ्री Reading Speed Test',
    title: 'आपकी असली रीडिंग स्पीड कितनी है?',
    intro:
      'एक पैराग्राफ़ अपनी सामान्य गति से पढ़ें, फिर उस पर 5 सवालों के जवाब दें। आपका नतीजा है आपकी Effective Reading Speed — यानी आप समझ के साथ कितनी तेज़ पढ़ते हैं।',
    passageLanguage: 'पैराग्राफ़ की भाषा',
    start: 'शुरू करें',
    readingHint: 'अपनी सामान्य गति से पढ़ें। पूरा होने पर "हो गया" दबाएँ।',
    scrollHint: 'ख़त्म करने के लिए पैराग्राफ़ के अंत तक स्क्रॉल करें।',
    done: 'हो गया',
    questionsTitle: 'आपने जो पढ़ा, उस पर 5 सवाल',
    passageHidden: 'पैराग्राफ़ अब छिपा दिया गया है। याद से जवाब दें।',
    seeResult: 'मेरा नतीजा देखें',
    loading: 'कृपया रुकें…',
    effectiveSpeed: 'Effective Reading Speed',
    readingSpeed: 'पढ़ने की गति',
    comprehension: 'समझ',
    validNote: 'ज़्यादातर छात्र और वयस्क समझ के साथ लगभग 200–300 WPM की गति से पढ़ते हैं।',
    tooFast: 'हम इसे माप नहीं पाए — लगता है पैराग्राफ़ पूरा नहीं पढ़ा गया। कृपया अपनी सामान्य गति से फिर से कोशिश करें।',
    lowComprehension: (percent) => `आपने तेज़ पढ़ा, पर समझ सिर्फ़ ${percent}% रही। पढ़ना तभी काम आता है जब याद रहे — ध्यान से फिर कोशिश करें।`,
    retry: 'नए पैराग्राफ़ के साथ फिर कोशिश करें',
    practiceCta: 'देखें Sharp Brain ऐप में अभ्यास कैसे होता है →',
    practiceIntro: (pace) => `ऐप के अभ्यास की तरह, शब्द एक-एक करके ${pace} WPM की गति से दिखेंगे। नज़र बीच में रखें।`,
    practiceBegin: 'शुरू करें',
    practiceQuestionsTitle: '3 छोटे सवाल',
    practiceResult: (pace, percent) =>
      `गाइडेड अभ्यास में आपने ${pace} WPM पर पढ़ा और ${percent}% समझा। 30-दिन का प्रोग्राम इसी तरह के अभ्यास से आपकी अपनी रीडिंग स्पीड को ट्रेन करता है।`,
    nextStep: 'आपका अगला कदम',
    seeProgram: 'Sharp Brain 30-दिवसीय प्रोग्राम देखें →',
    whatsapp: 'सवाल हैं? WhatsApp पर बात करें',
    whatsappMessage: (eff) =>
      eff === null
        ? 'मैंने Reading Speed Test दिया। मुझे Sharp Brain के बारे में जानना है।'
        : `मैंने Reading Speed Test दिया — मेरी Effective Speed ${eff} है। मुझे Sharp Brain के बारे में जानना है।`,
    phoneLabel: 'अपना नतीजा WhatsApp पर पाएँ (वैकल्पिक)',
    phoneLabelOffer: `अपना नतीजा WhatsApp पर पाएँ — और 30-दिवसीय प्रोग्राम पर ${DISCOUNT} की छूट पाएँ (वैकल्पिक)`,
    offerLinked: 'आपका ऑफ़र इसी नंबर से जुड़ा है।',
    offerUnlocked: (price, regular) => `आपके टेस्ट से ${DISCOUNT} की छूट मिली — ${regular} की जगह ${price}।`,
    offerValid: `${HOURS} घंटे के लिए मान्य:`,
    offerWhatsapp: 'मेरा ऑफ़र लिंक WhatsApp पर भेजें',
    offerWhatsappMessage: (eff, url) =>
      `मैंने Reading Speed Test दिया${eff === null ? '' : ` — मेरी Effective Speed ${eff} है`}। मेरा ${DISCOUNT} वाला Sharp Brain ऑफ़र: ${url}`,
    phonePlaceholder: 'WhatsApp नंबर',
    phoneSubmit: 'मुझे नतीजा भेजें',
    phoneSaved: 'सेव हो गया। डॉ. कपिल की टीम आपका नतीजा WhatsApp पर भेजेगी।',
    phoneNote: 'हम आपका नतीजा WhatsApp पर भेजेंगे और Sharp Brain के बारे में आपसे संपर्क कर सकते हैं। आप कभी भी अपना नंबर हटाने के लिए कह सकते हैं।',
    nameLabel: 'पहला नाम (वैकल्पिक)',
    wpm: 'WPM',
  },
}
