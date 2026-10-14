import { sharpBrainEnrolment } from '@/config/site.config'

// Free Reading & Memory Test — every word on the test page, English and
// Hindi. Copy rules (founder, 14 Oct 2026): no "100%", "photographic
// memory", guarantees, ESP or midbrain; every number is the person's own.
const DISCOUNT = `₹${sharpBrainEnrolment.testOffer.discountInr.toLocaleString('en-IN')}`
const HOURS = sharpBrainEnrolment.testOffer.validHours

export type MemoryTestCopy = {
  name: string
  headline: string
  sub: string
  facts: [string, string, string]
  passageLang: string
  start: string
  privacy: string
  stepOf: (n: number) => string
  steps: [string, string, string]
  readTitle: string
  readHint: string
  readDone: string
  readScroll: string
  memIntroTitle: string
  memIntro: string
  memShow: string
  memSeconds: (n: number) => string
  memPickTitle: string
  memPicked: (n: number) => string
  memCheck: string
  brilliant: string
  almost: string
  memScore: (n: number) => string
  toQuestions: string
  qIntro: string
  qOf: (n: number, total: number) => string
  next: string
  seeProfile: string
  resultTitle: string
  effective: string
  effectiveSub: (wpm: number) => string
  wpm: string
  retention: string
  retentionValue: (x: number) => string
  retentionSub: string
  memory: string
  memoryValue: (x: number) => string
  memorySub: string
  yourType: string
  tip: string
  painLine: (x: number, fast: boolean) => string
  bonusStory: string
  bonusStorySub: string
  bonusBoost: string
  bonusBoostSub: (pace: number) => string
  storyTitle: string
  storyIntro: string
  storySound: string
  storyPlay: string
  storyReplay: string
  storyRecallTitle: string
  beforeAfter: (before: number, after: number) => string
  beforeAfterFlat: (before: number, after: number) => string
  boostTitle: string
  boostIntro: (pace: number) => string
  boostStart: string
  boostQuestions: string
  boostResult: (pace: number, percent: number) => string
  boostResultSub: string
  backToProfile: string
  leadTitle: string
  leadTitleNoOffer: string
  leadSub: string
  phone: string
  firstName: string
  leadSubmit: string
  saving: string
  phoneNote: string
  shareTitle: string
  shareText: (eff: number, mem: number, url: string) => string
  shareCardLine: (mem: number) => string
  shareImage: string
  shareWhatsapp: string
  programTitle: string
  programLines: [string, string, string]
  seeProgram: string
  invalidTitle: string
  invalidTooFast: string
  invalidLow: (x: number) => string
  tryAgain: string
  error: string
}

export const memoryTestCopy: Record<'en' | 'hi', MemoryTestCopy> = {
  en: {
    name: 'Free Reading & Memory Test',
    headline: 'How much do you remember after you read? Find out in 3 minutes.',
    sub: 'Free test · Reading speed + Memory + Retention · Your personal Brain Profile',
    facts: ['About 3 minutes', 'No sign-up', 'English or Hindi'],
    passageLang: 'Read the passage in',
    start: 'Start the test →',
    privacy: 'Your answers stay on this page unless you choose to get your report on WhatsApp.',
    stepOf: (n) => `Step ${n} of 3`,
    steps: ['Read', 'Memory', 'Recall'],
    readTitle: 'Read at your normal pace',
    readHint: 'Read it once, the way you usually read. Tap Done at the end.',
    readDone: 'Done',
    readScroll: 'Scroll to the end of the passage to finish.',
    memIntroTitle: 'Memory challenge',
    memIntro: '8 pictures will show for 20 seconds. Remember as many as you can — then pick them from 16.',
    memShow: 'Show the pictures',
    memSeconds: (n) => `${n} s`,
    memPickTitle: 'Tap the 8 pictures you saw',
    memPicked: (n) => `${n} of 8 chosen`,
    memCheck: 'Check',
    brilliant: 'Brilliant!',
    almost: 'Almost there',
    memScore: (n) => `You remembered ${n} of 8 pictures.`,
    toQuestions: 'Now 4 questions about the passage →',
    qIntro: 'From memory — about the passage you read a minute ago.',
    qOf: (n, total) => `Question ${n} of ${total}`,
    next: 'Next',
    seeProfile: 'See my Brain Profile',
    resultTitle: 'Your Brain Profile',
    effective: 'Effective reading speed',
    effectiveSub: (wpm) => `${wpm} WPM × understanding`,
    wpm: 'WPM',
    retention: 'Retention',
    retentionValue: (x) => `${x} of 4`,
    retentionSub: 'facts kept after about 1 minute',
    memory: 'Memory',
    memoryValue: (x) => `${x} of 8`,
    memorySub: 'pictures remembered',
    yourType: 'Your profile',
    tip: 'Try this today',
    painLine: (x, fast) =>
      x >= 4
        ? 'You kept all 4 facts after a minute — well done. The real test is keeping them for days, not minutes: that is what a memory method is for.'
        : `${fast ? 'You read fast' : 'You read carefully'} — but kept only ${x} of 4 facts after a minute. That's normal: most of what we read fades unless we use a method.`,
    bonusStory: '🎁 Double your memory in 30 seconds →',
    bonusStorySub: 'Learn the Story method, then try 8 new pictures.',
    bonusBoost: '⚡ Can your brain read 20% faster? 60-second Brain Boost →',
    bonusBoostSub: (pace) => `Words flash one at a time at ${pace} WPM, then 3 quick questions.`,
    storyTitle: 'The Story method',
    storyIntro: 'Watch and listen: we link 8 new pictures into one funny story. Picture each moment clearly.',
    storySound: 'Turn your sound on 🔊',
    storyPlay: 'Play the story',
    storyReplay: 'I’ve got the story →',
    storyRecallTitle: 'Now tap the 8 pictures from the story',
    beforeAfter: (b, a) => `Before ${b}/8 → With the method ${a}/8 🎉`,
    beforeAfterFlat: (b, a) => `Before ${b}/8 → With the method ${a}/8. It gets easier with a little practice — the 30-day program trains this every day.`,
    boostTitle: '60-second Brain Boost',
    boostIntro: (pace) => `Words will appear one at a time at ${pace} WPM — about 20% faster than your test. Keep your eyes on the centre.`,
    boostStart: 'Start',
    boostQuestions: '3 quick questions',
    boostResult: (pace, percent) => `You just read at ${pace} WPM and understood ${percent}%.`,
    boostResultSub: 'Guided practice like this is how the 30-day program builds your own speed.',
    backToProfile: 'Back to my Brain Profile',
    leadTitle: `Get your full report, 3 personal tips and ${DISCOUNT} off Sharp Brain for ${HOURS} hours — on WhatsApp`,
    leadTitleNoOffer: 'Get your full report and 3 personal tips on WhatsApp',
    leadSub: 'Free. No spam.',
    phone: 'WhatsApp number',
    firstName: 'First name (optional)',
    leadSubmit: 'Send it to my WhatsApp',
    saving: 'Saving…',
    phoneNote: 'We’ll send your report on WhatsApp and may tell you about Sharp Brain. Ask us any time to delete your number.',
    shareTitle: 'Share your result',
    shareText: (eff, mem, url) => `I read at ${eff} WPM and remembered ${mem}/8 — what’s yours? ${url}`,
    shareCardLine: (mem) => `Remembered ${mem} of 8 pictures`,
    shareImage: 'Share result card',
    shareWhatsapp: 'Share on WhatsApp',
    programTitle: 'Want to train these skills?',
    programLines: [
      'Sharp Brain is a 30-day program for reading, focus and memory.',
      '7 live classes with Dr. Kapil Dev Sharma + 10–15 minutes of guided app practice a day.',
      '8 memory methods for names, numbers, chapters and more — practised on real lists and books.',
    ],
    seeProgram: 'See the 30-day program →',
    invalidTitle: 'Let’s try again with a new passage',
    invalidTooFast: 'That was faster than a passage can really be read — it may have been skimmed. Read the next one at your normal pace.',
    invalidLow: (x) => `Only ${x} of 4 facts came back this time. It happens — read the next passage once, at your normal pace.`,
    tryAgain: 'Try again with a new passage',
    error: 'Something went wrong. Please try again.',
  },
  hi: {
    name: 'मुफ़्त Reading और Memory Test',
    headline: 'पढ़ने के बाद आपको कितना याद रहता है? 3 मिनट में जानिए।',
    sub: 'मुफ़्त टेस्ट · पढ़ने की रफ़्तार + याददाश्त + याद टिकना · आपकी अपनी Brain Profile',
    facts: ['लगभग 3 मिनट', 'साइन-अप नहीं', 'हिंदी या अंग्रेज़ी'],
    passageLang: 'लेख इस भाषा में पढ़ें',
    start: 'टेस्ट शुरू करें →',
    privacy: 'आपके जवाब इसी पेज पर रहते हैं, जब तक आप WhatsApp पर रिपोर्ट नहीं मँगाते।',
    stepOf: (n) => `3 में से चरण ${n}`,
    steps: ['पढ़ें', 'याद रखें', 'जवाब दें'],
    readTitle: 'अपनी सामान्य रफ़्तार से पढ़ें',
    readHint: 'जैसे आप आम तौर पर पढ़ते हैं, वैसे एक बार पढ़ें। अंत में “हो गया” दबाएँ।',
    readDone: 'हो गया',
    readScroll: 'ख़त्म करने के लिए लेख के अंत तक स्क्रॉल करें।',
    memIntroTitle: 'याददाश्त चुनौती',
    memIntro: '8 तस्वीरें 20 सेकंड के लिए दिखेंगी। जितनी हो सके याद रखें — फिर उन्हें 16 में से चुनें।',
    memShow: 'तस्वीरें दिखाएँ',
    memSeconds: (n) => `${n} सेकंड`,
    memPickTitle: 'जो 8 तस्वीरें आपने देखीं, उन पर टैप करें',
    memPicked: (n) => `8 में से ${n} चुनी`,
    memCheck: 'जाँचें',
    brilliant: 'शानदार!',
    almost: 'लगभग पहुँच गए',
    memScore: (n) => `आपको 8 में से ${n} तस्वीरें याद रहीं।`,
    toQuestions: 'अब लेख के बारे में 4 सवाल →',
    qIntro: 'याद से — उस लेख के बारे में जो आपने एक मिनट पहले पढ़ा।',
    qOf: (n, total) => `${total} में से सवाल ${n}`,
    next: 'आगे',
    seeProfile: 'मेरी Brain Profile देखें',
    resultTitle: 'आपकी Brain Profile',
    effective: 'असरदार पढ़ने की रफ़्तार',
    effectiveSub: (wpm) => `${wpm} WPM × समझ`,
    wpm: 'WPM',
    retention: 'याद टिकना',
    retentionValue: (x) => `4 में से ${x}`,
    retentionSub: 'बातें लगभग 1 मिनट बाद याद रहीं',
    memory: 'याददाश्त',
    memoryValue: (x) => `8 में से ${x}`,
    memorySub: 'तस्वीरें याद रहीं',
    yourType: 'आपकी प्रोफ़ाइल',
    tip: 'आज यह आज़माएँ',
    painLine: (x, fast) =>
      x >= 4
        ? 'एक मिनट बाद भी आपको चारों बातें याद रहीं — बहुत अच्छा। असली परीक्षा उन्हें मिनटों नहीं, दिनों तक याद रखना है: इसी के लिए याद रखने का तरीका होता है।'
        : `${fast ? 'आप तेज़ पढ़ते हैं' : 'आप ध्यान से पढ़ते हैं'} — पर 1 मिनट बाद 4 में से सिर्फ़ ${x} बातें याद रहीं। यह आम है: बिना तरीके के पढ़ा हुआ जल्दी भूल जाता है।`,
    bonusStory: '🎁 30 सेकंड में अपनी याददाश्त दोगुनी करें →',
    bonusStorySub: 'Story method सीखें, फिर 8 नई तस्वीरें आज़माएँ।',
    bonusBoost: '⚡ क्या आपका दिमाग़ 20% तेज़ पढ़ सकता है? 60 सेकंड का Brain Boost →',
    bonusBoostSub: (pace) => `शब्द एक-एक करके ${pace} WPM पर आएँगे, फिर 3 छोटे सवाल।`,
    storyTitle: 'Story method',
    storyIntro: 'देखिए और सुनिए: हम 8 नई तस्वीरों को एक मज़ेदार कहानी में जोड़ते हैं। हर पल को साफ़-साफ़ मन में देखिए।',
    storySound: 'आवाज़ चालू करें 🔊',
    storyPlay: 'कहानी चलाएँ',
    storyReplay: 'कहानी याद हो गई →',
    storyRecallTitle: 'अब कहानी वाली 8 तस्वीरों पर टैप करें',
    beforeAfter: (b, a) => `पहले ${b}/8 → तरीके के साथ ${a}/8 🎉`,
    beforeAfterFlat: (b, a) => `पहले ${b}/8 → तरीके के साथ ${a}/8। थोड़े अभ्यास से यह आसान हो जाता है — 30 दिन का प्रोग्राम रोज़ यही अभ्यास कराता है।`,
    boostTitle: '60 सेकंड का Brain Boost',
    boostIntro: (pace) => `शब्द एक-एक करके ${pace} WPM पर आएँगे — आपके टेस्ट से लगभग 20% तेज़। नज़र बीच में रखें।`,
    boostStart: 'शुरू करें',
    boostQuestions: '3 छोटे सवाल',
    boostResult: (pace, percent) => `आपने अभी ${pace} WPM पर पढ़ा और ${percent}% समझा।`,
    boostResultSub: 'ऐसे गाइडेड अभ्यास से ही 30 दिन का प्रोग्राम आपकी अपनी रफ़्तार बढ़ाता है।',
    backToProfile: 'मेरी Brain Profile पर वापस',
    leadTitle: `अपनी पूरी रिपोर्ट, 3 निजी टिप्स और ${HOURS} घंटे के लिए Sharp Brain पर ${DISCOUNT} की छूट — WhatsApp पर पाएँ`,
    leadTitleNoOffer: 'अपनी पूरी रिपोर्ट और 3 निजी टिप्स WhatsApp पर पाएँ',
    leadSub: 'मुफ़्त। कोई स्पैम नहीं।',
    phone: 'WhatsApp नंबर',
    firstName: 'पहला नाम (वैकल्पिक)',
    leadSubmit: 'मेरे WhatsApp पर भेजें',
    saving: 'सेव हो रहा है…',
    phoneNote: 'हम आपकी रिपोर्ट WhatsApp पर भेजेंगे और Sharp Brain के बारे में बता सकते हैं। आप कभी भी अपना नंबर हटाने को कह सकते हैं।',
    shareTitle: 'अपना नतीजा शेयर करें',
    shareText: (eff, mem, url) => `मैंने ${eff} WPM पर पढ़ा और 8 में से ${mem} याद रखीं — आपका कितना है? ${url}`,
    shareCardLine: (mem) => `8 में से ${mem} तस्वीरें याद रहीं`,
    shareImage: 'रिज़ल्ट कार्ड शेयर करें',
    shareWhatsapp: 'WhatsApp पर शेयर करें',
    programTitle: 'क्या आप ये कौशल ट्रेन करना चाहते हैं?',
    programLines: [
      'Sharp Brain पढ़ने, फ़ोकस और याददाश्त का 30 दिन का प्रोग्राम है।',
      'डॉ. कपिल देव शर्मा के साथ 7 लाइव क्लास + रोज़ 10–15 मिनट ऐप में गाइडेड अभ्यास।',
      'नाम, अंक, चैप्टर और बहुत कुछ के लिए याद रखने के 8 तरीके — असली सूचियों और किताबों पर अभ्यास।',
    ],
    seeProgram: '30 दिन का प्रोग्राम देखें →',
    invalidTitle: 'चलिए, एक नए लेख के साथ फिर से कोशिश करते हैं',
    invalidTooFast: 'यह इतनी तेज़ी थी कि लेख सच में पढ़ा नहीं जा सकता — शायद सरसरी नज़र डाली गई। अगला लेख अपनी सामान्य रफ़्तार से पढ़ें।',
    invalidLow: (x) => `इस बार 4 में से सिर्फ़ ${x} बातें याद आईं। ऐसा होता है — अगला लेख एक बार, अपनी सामान्य रफ़्तार से पढ़ें।`,
    tryAgain: 'नए लेख के साथ फिर से कोशिश करें',
    error: 'कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।',
  },
}
