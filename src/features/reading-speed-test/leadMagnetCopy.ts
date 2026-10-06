import { sharpBrainEnrolment } from '@/config/site.config'
import type { ReadingProfileType, SpeedBand } from './scoring'

// Copy for the Reading Profile flow (start screen, steps, profile, share
// card, Brain Boost, WhatsApp capture, soft program offer). EN/HI like the
// rest of the website. Plain language; no medical or psychological claims —
// a profile describes how this one passage was read, nothing more.

const DISCOUNT = `₹${sharpBrainEnrolment.testOffer.discountInr.toLocaleString('en-IN')}`
const HOURS = sharpBrainEnrolment.testOffer.validHours

export type ProfileText = { name: string; summary: [string, string]; tips: [string, string, string] }

export type LeadMagnetCopy = {
  headline: string
  sub: string
  youGetTitle: string
  youGet: [string, string, string]
  steps: [string, string, string]
  stepOf: (n: number) => string
  questionOf: (n: number, total: number) => string
  back: string
  next: string
  profileEyebrow: string
  bands: Record<SpeedBand, string>
  scaleNote: string
  yourType: string
  profiles: Record<ReadingProfileType, ProfileText>
  tipsTitle: string
  shareTitle: string
  shareNamePlaceholder: string
  shareImage: string
  shareWhatsapp: string
  shareCardLine: (eff: number) => string
  shareCardName: (name: string) => string
  shareCardAsk: string
  shareText: (eff: number, url: string) => string
  boostCta: string
  boostCtaSub: string
  boostIntro: (pace: number) => string
  boostResult: (pace: number, percent: number) => string
  boostResultSub: string
  leadTitle: string
  leadSub: string
  leadSubmit: string
  leadSaved: string
  programTitle: string
  programLines: [string, string, string]
  seeProgram: string
  useOffer: string
  offerSaved: string
  offerValid: string
  invalidTitle: string
}

export const leadMagnetCopy: Record<'en' | 'hi', LeadMagnetCopy> = {
  en: {
    headline: 'How fast does your brain really read — and how much does it keep?',
    sub: '3-minute test · free · your personal Reading Profile at the end.',
    youGetTitle: 'You’ll get',
    youGet: [
      'Your Effective Reading Speed — speed × understanding',
      'Your comprehension score',
      'A Reading Profile with 3 personal tips you can use today',
    ],
    steps: ['Read', 'Questions', 'Your profile'],
    stepOf: (n) => `Step ${n} of 3`,
    questionOf: (n, total) => `Question ${n} of ${total}`,
    back: '← Back',
    next: 'Next →',
    profileEyebrow: 'Your Reading Profile',
    bands: { developing: 'Developing', average: 'Average', strong: 'Strong', advanced: 'Advanced' },
    scaleNote: 'Most students and adults read with understanding at roughly 200–300 WPM.',
    yourType: 'Your reading type',
    profiles: {
      careful: {
        name: 'The Careful Re-reader',
        summary: [
          'You take your time and make sure you understand — a strong base.',
          'Speed is usually held back by going back over lines and stopping on single words.',
        ],
        tips: [
          'Run a finger or pen under the line and keep it moving forward — don’t go back.',
          'Read in groups of 2–3 words instead of word by word.',
          'Before you start, look at the headings for 30 seconds so you know what’s coming.',
        ],
      },
      innerVoice: {
        name: 'The Inner-Voice Reader',
        summary: [
          'You read at about the pace of speaking — clear and steady.',
          'Many readers “hear” each word in their head, which keeps speed close to talking speed.',
        ],
        tips: [
          'Read some lines a little faster than you could say them — let your eyes lead.',
          'Look at phrases (“in the morning”, “on the way home”) as one picture, not three words.',
          'Practise 5 minutes a day with easy text, a little faster each time.',
        ],
      },
      skimmer: {
        name: 'The Fast Skimmer',
        summary: [
          'Your eyes move quickly — that’s a real strength.',
          'Some details slip by, so the next step is keeping more of what you read.',
        ],
        tips: [
          'After each paragraph, say its main idea in one line before moving on.',
          'Slow down slightly on names, numbers and new terms.',
          'Ask yourself one question before reading — then look for the answer.',
        ],
      },
      balanced: {
        name: 'The Balanced Reader',
        summary: [
          'You read quickly and still keep most of it — a great combination.',
          'Your next gains come from longer, harder texts without losing understanding.',
        ],
        tips: [
          'Try 10 minutes a day with more difficult text at the same speed.',
          'Summarise each page in one sentence to lock in what you read.',
          'Review key points the next day — you’ll remember far more a week later.',
        ],
      },
    },
    tipsTitle: '3 tips you can use today',
    shareTitle: 'Share your result',
    shareNamePlaceholder: 'First name on the card (optional)',
    shareImage: 'Share result card',
    shareWhatsapp: 'Share on WhatsApp',
    shareCardLine: (eff) => `I read at ${eff} effective WPM.`,
    shareCardName: (name) => `${name}’s Reading Profile`,
    shareCardAsk: 'What’s yours?',
    shareText: (eff, url) => `I read at ${eff} effective WPM on the free Reading Speed Test. What’s yours? ${url}`,
    boostCta: '🧠 Can your brain go 20% faster without losing understanding?',
    boostCtaSub: 'Try the 60-second Brain Boost →',
    boostIntro: (pace) => `Words will appear one at a time at ${pace} WPM — about 20% faster than your test. Keep your eyes on the centre. Then 3 quick questions.`,
    boostResult: (pace, percent) => `You just read at ${pace} WPM and understood ${percent}%.`,
    boostResultSub: 'This is what daily training builds — faster reading that you still understand.',
    leadTitle: 'Get your full Reading Profile + a free 7-day practice plan on WhatsApp',
    leadSub: 'We’ll send it to your WhatsApp. No spam.',
    leadSubmit: 'Send it to my WhatsApp',
    leadSaved: 'Done! Dr. Kapil’s team will send your Reading Profile and 7-day plan on WhatsApp.',
    programTitle: 'Want to train these skills properly?',
    programLines: [
      'Sharp Brain is a 30-day program for reading, focus and memory.',
      '7 live classes with Dr. Kapil Dev Sharma + 10–15 minutes of daily app practice.',
      'You take a reading test in Class 1 and Class 7 — and see your own change.',
    ],
    seeProgram: 'See the 30-day program',
    useOffer: `Use my ${DISCOUNT} offer`,
    offerSaved: `Your ${DISCOUNT} offer is saved. Time left:`,
    offerValid: `Valid for ${HOURS} hours from now.`,
    invalidTitle: 'Let’s try that again',
  },
  hi: {
    headline: 'आपका दिमाग असल में कितनी तेज़ी से पढ़ता है — और कितना याद रखता है?',
    sub: '3 मिनट का टेस्ट · फ्री · आखिर में आपकी अपनी Reading Profile।',
    youGetTitle: 'आपको मिलेगा',
    youGet: [
      'आपकी Effective Reading Speed — रफ़्तार × समझ',
      'आपका समझ का स्कोर',
      '3 निजी टिप्स के साथ Reading Profile, जो आप आज ही अपना सकते हैं',
    ],
    steps: ['पढ़ें', 'सवाल', 'आपकी प्रोफ़ाइल'],
    stepOf: (n) => `3 में से चरण ${n}`,
    questionOf: (n, total) => `सवाल ${n} / ${total}`,
    back: '← पीछे',
    next: 'आगे →',
    profileEyebrow: 'आपकी Reading Profile',
    bands: { developing: 'शुरुआती', average: 'औसत', strong: 'मज़बूत', advanced: 'उन्नत' },
    scaleNote: 'ज़्यादातर छात्र और वयस्क समझ के साथ लगभग 200–300 WPM की गति से पढ़ते हैं।',
    yourType: 'आप किस तरह पढ़ते हैं',
    profiles: {
      careful: {
        name: 'सावधान, दोबारा पढ़ने वाले पाठक',
        summary: ['आप आराम से पढ़ते हैं और समझ पक्की करते हैं — यह मज़बूत नींव है।', 'रफ़्तार अक्सर पंक्तियाँ दोबारा पढ़ने और एक-एक शब्द पर रुकने से कम होती है।'],
        tips: [
          'उंगली या पेन को पंक्ति के नीचे आगे बढ़ाते रहें — पीछे न लौटें।',
          'शब्द-शब्द की जगह 2–3 शब्दों के समूह में पढ़ें।',
          'शुरू करने से पहले 30 सेकंड हेडिंग देख लें, ताकि पता हो क्या आने वाला है।',
        ],
      },
      innerVoice: {
        name: 'मन में बोलकर पढ़ने वाले पाठक',
        summary: ['आप लगभग बोलने की रफ़्तार से पढ़ते हैं — साफ़ और स्थिर।', 'कई लोग हर शब्द को मन में “सुनते” हैं, जिससे रफ़्तार बोलने जितनी रह जाती है।'],
        tips: [
          'कुछ पंक्तियाँ बोलने से थोड़ा तेज़ पढ़ें — आँखों को आगे चलने दें।',
          '“सुबह के समय”, “घर के रास्ते में” जैसे वाक्यांशों को एक तस्वीर की तरह देखें।',
          'रोज़ 5 मिनट आसान पाठ से अभ्यास करें, हर बार थोड़ा तेज़।',
        ],
      },
      skimmer: {
        name: 'तेज़ नज़र दौड़ाने वाले पाठक',
        summary: ['आपकी आँखें तेज़ चलती हैं — यह असली ताकत है।', 'कुछ बातें छूट जाती हैं, इसलिए अगला कदम है जो पढ़ा उसे ज़्यादा याद रखना।'],
        tips: [
          'हर पैराग्राफ़ के बाद उसकी मुख्य बात एक लाइन में कहें, फिर आगे बढ़ें।',
          'नाम, नंबर और नए शब्दों पर थोड़ा धीमे पढ़ें।',
          'पढ़ने से पहले खुद से एक सवाल पूछें — फिर उसका जवाब ढूँढें।',
        ],
      },
      balanced: {
        name: 'संतुलित पाठक',
        summary: ['आप तेज़ पढ़ते हैं और ज़्यादातर याद भी रखते हैं — बढ़िया मेल।', 'अगली बढ़त लंबे, कठिन पाठ बिना समझ खोए पढ़ने से आएगी।'],
        tips: [
          'रोज़ 10 मिनट कठिन पाठ उसी रफ़्तार से पढ़ने की कोशिश करें।',
          'हर पेज का सार एक वाक्य में लिखें, ताकि बात पक्की हो जाए।',
          'अगले दिन मुख्य बातें दोहराएँ — एक हफ़्ते बाद कहीं ज़्यादा याद रहेगा।',
        ],
      },
    },
    tipsTitle: 'आज ही अपनाने लायक 3 टिप्स',
    shareTitle: 'अपना नतीजा शेयर करें',
    shareNamePlaceholder: 'कार्ड पर पहला नाम (वैकल्पिक)',
    shareImage: 'रिज़ल्ट कार्ड शेयर करें',
    shareWhatsapp: 'WhatsApp पर शेयर करें',
    shareCardLine: (eff) => `मेरी Effective Reading Speed: ${eff} WPM`,
    shareCardName: (name) => `${name} की Reading Profile`,
    shareCardAsk: 'आपकी कितनी है?',
    shareText: (eff, url) => `फ्री Reading Speed Test में मेरी Effective Speed ${eff} WPM आई। आपकी कितनी है? ${url}`,
    boostCta: '🧠 क्या आपका दिमाग बिना समझ खोए 20% तेज़ पढ़ सकता है?',
    boostCtaSub: '60 सेकंड का Brain Boost आज़माएँ →',
    boostIntro: (pace) => `शब्द एक-एक करके ${pace} WPM पर दिखेंगे — आपके टेस्ट से लगभग 20% तेज़। नज़र बीच में रखें। फिर 3 छोटे सवाल।`,
    boostResult: (pace, percent) => `आपने अभी ${pace} WPM पर पढ़ा और ${percent}% समझा।`,
    boostResultSub: 'रोज़ की ट्रेनिंग यही बनाती है — तेज़ पढ़ना, और समझ भी बनी रहे।',
    leadTitle: 'अपनी पूरी Reading Profile + 7 दिन का फ्री अभ्यास प्लान WhatsApp पर पाएँ',
    leadSub: 'हम इसे आपके WhatsApp पर भेजेंगे। कोई स्पैम नहीं।',
    leadSubmit: 'मेरे WhatsApp पर भेजें',
    leadSaved: 'हो गया! डॉ. कपिल की टीम आपकी Reading Profile और 7 दिन का प्लान WhatsApp पर भेजेगी।',
    programTitle: 'क्या आप ये कौशल ठीक से ट्रेन करना चाहते हैं?',
    programLines: [
      'Sharp Brain पढ़ने, फ़ोकस और याददाश्त का 30 दिन का प्रोग्राम है।',
      'डॉ. कपिल देव शर्मा के साथ 7 लाइव क्लास + रोज़ 10–15 मिनट ऐप प्रैक्टिस।',
      'क्लास 1 और क्लास 7 में आप रीडिंग टेस्ट देते हैं — और अपना बदलाव खुद देखते हैं।',
    ],
    seeProgram: '30 दिन का प्रोग्राम देखें',
    useOffer: `मेरा ${DISCOUNT} ऑफ़र इस्तेमाल करें`,
    offerSaved: `आपका ${DISCOUNT} ऑफ़र सेव है। बाकी समय:`,
    offerValid: `अभी से ${HOURS} घंटे के लिए मान्य।`,
    invalidTitle: 'चलिए, एक बार फिर कोशिश करते हैं',
  },
}
