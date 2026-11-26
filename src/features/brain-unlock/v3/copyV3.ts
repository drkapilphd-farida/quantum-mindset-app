// Brain Test v3 — every on-screen line, English and Hindi (same pattern as
// ../copy.ts). Honest wording: the person's own numbers only, no percentiles,
// no comparisons with other people, no promises. No prices on this page.

export type V3Copy = {
  roundOf: string
  hello: string
  r1Instruction: string
  next: string
  penalty: string
  focusScore: string
  name: {
    title: string
    label: string
    placeholder: string
    who: string
    child: string
    student: string
    adult: string
    tooLong: string
    pickWho: string
    continue: string
  }
  breathIntro: { line: string; start: string }
  breath: { in: string; out: string; count: string; skip: string }
  r2: { faster: string; settling: string; compare: string }
  memory: { remember: string; pick: string; picked: string; done: string; score: string; falsePicks: string }
  rsvp: { ready: string; getReady: string; question: string; correct: string; correctSub: string; wrong: string }
  result: {
    title: string
    focus: string
    boost: string
    memory: string
    reading: string
    strongestGrowth: string
    balanced: string
    button: string
    saving: string
    chatSent: string
    chatAgain: string
    autoSending: string
    autoSent: string
    autoSentSub: string
    openWhatsApp: string
    chatMessage: string
  }
  continue: string
}

const en: V3Copy = {
  roundOf: 'Round {n} of 4',
  hello: 'Namaste {name} 👋',
  r1Instruction: 'Tap 1 to 16 as fast as you can',
  next: 'Next: {n}',
  penalty: '+1s',
  focusScore: 'Focus: {s} sec ⚡',
  name: {
    title: 'Nice! Who is playing?',
    label: 'First name (optional)',
    placeholder: 'Your first name',
    who: 'Who is playing?',
    child: 'Child',
    student: 'Student',
    adult: 'Adult',
    tooLong: 'Please use at most 30 letters.',
    pickWho: 'Please choose who is playing.',
    continue: 'Continue',
  },
  breathIntro: { line: 'Now take 3 slow breaths… then play the grid again and see if you get faster.', start: 'Start breathing' },
  breath: { in: 'Breathe in…', out: 'Breathe out…', count: 'Breath {n} of 3', skip: 'Skip' },
  r2: {
    faster: 'Just 3 breaths made your focus {pct}% faster!',
    settling: 'Your brain is settling — this is how training begins.',
    compare: '{a} sec → {b} sec',
  },
  memory: {
    remember: 'Remember these 7',
    pick: 'Tap the 7 you saw',
    picked: '{n} of 7 picked',
    done: 'Done',
    score: 'Memory: {n}/7 🧠',
    falsePicks: '{n} picked that were not shown',
  },
  rsvp: {
    ready: 'Words will flash one by one. Read them.',
    getReady: 'Get ready',
    question: 'One question',
    correct: 'You read at 350 words per minute — and understood it ✓',
    correctSub: 'Most people read at about 200–250 words per minute.',
    wrong: 'You read at 350 words per minute. Understanding can grow with practice.',
  },
  result: {
    title: 'Your Brain Score',
    focus: 'Focus',
    boost: 'Breath boost',
    memory: 'Memory',
    reading: 'Reading',
    strongestGrowth: 'Strongest today: {a}. Most room to grow: {b}.',
    balanced: 'Focus and Memory are balanced.',
    button: 'Send my report on WhatsApp',
    saving: 'Opening WhatsApp…',
    chatSent: 'WhatsApp is open — just tap Send.',
    chatAgain: 'Open WhatsApp again',
    autoSending: 'Sending your report to WhatsApp…',
    autoSent: '{name}, your report is on WhatsApp ✓',
    autoSentSub: 'Open WhatsApp to see it.',
    openWhatsApp: 'Open WhatsApp',
    chatMessage: 'Hi! I just took the Brain Test. My Brain Score: {score}/100. Please send my report.',
  },
  continue: 'Continue',
}

const hi: V3Copy = {
  roundOf: 'राउंड {n} / 4',
  hello: 'नमस्ते {name} जी 👋',
  r1Instruction: '1 से 16 तक जितनी जल्दी हो सके टैप करें',
  next: 'अगला: {n}',
  penalty: '+1s',
  focusScore: 'Focus: {s} सेकंड ⚡',
  name: {
    title: 'बढ़िया! कौन खेल रहा है?',
    label: 'पहला नाम (ज़रूरी नहीं)',
    placeholder: 'आपका पहला नाम',
    who: 'कौन खेल रहा है?',
    child: 'बच्चा',
    student: 'विद्यार्थी',
    adult: 'बड़े',
    tooLong: 'ज़्यादा से ज़्यादा 30 अक्षर लिखें।',
    pickWho: 'कृपया चुनें कि कौन खेल रहा है।',
    continue: 'आगे बढ़ें',
  },
  breathIntro: { line: 'अब 3 गहरी साँसें लें… फिर grid दोबारा खेलें और देखें कि आप तेज़ हुए या नहीं।', start: 'साँस लेना शुरू करें' },
  breath: { in: 'साँस अंदर…', out: 'साँस बाहर…', count: 'साँस {n} / 3', skip: 'छोड़ें' },
  r2: {
    faster: 'सिर्फ़ 3 साँसों से आपका focus {pct}% तेज़ हो गया!',
    settling: 'आपका दिमाग़ शांत हो रहा है — training ऐसे ही शुरू होती है।',
    compare: '{a} सेकंड → {b} सेकंड',
  },
  memory: {
    remember: 'इन 7 को याद रखिए',
    pick: 'जो 7 देखे थे, उन्हें टैप करें',
    picked: '7 में से {n} चुने',
    done: 'हो गया',
    score: 'याददाश्त: {n}/7 🧠',
    falsePicks: '{n} ऐसे चुने जो दिखाए नहीं गए थे',
  },
  rsvp: {
    ready: 'शब्द एक-एक करके चमकेंगे। उन्हें पढ़िए।',
    getReady: 'तैयार हो जाइए',
    question: 'एक सवाल',
    correct: 'आपने 350 शब्द प्रति मिनट की speed से पढ़ा — और समझा भी ✓',
    correctSub: 'ज़्यादातर लोग लगभग 200–250 शब्द प्रति मिनट पढ़ते हैं।',
    wrong: 'आपने 350 शब्द प्रति मिनट की speed से पढ़ा। समझ अभ्यास से बढ़ सकती है।',
  },
  result: {
    title: 'आपका Brain Score',
    focus: 'Focus',
    boost: 'साँस से boost',
    memory: 'याददाश्त',
    reading: 'पढ़ना',
    strongestGrowth: 'आज सबसे मज़बूत: {a}. सबसे ज़्यादा बढ़ने की जगह: {b}.',
    balanced: 'Focus और याददाश्त बराबर हैं।',
    button: 'मेरा report WhatsApp पर भेजो',
    saving: 'WhatsApp खुल रहा है…',
    chatSent: 'WhatsApp खुल गया है — बस Send दबाइए।',
    chatAgain: 'WhatsApp फिर से खोलें',
    autoSending: 'आपका report WhatsApp पर भेजा जा रहा है…',
    autoSent: '{name} जी, आपका report WhatsApp पर भेज दिया गया ✓',
    autoSentSub: 'देखने के लिए WhatsApp खोलिए।',
    openWhatsApp: 'WhatsApp खोलें',
    chatMessage: 'नमस्ते! मैंने अभी Brain Test दिया। मेरा Brain Score: {score}/100. कृपया मेरा report भेजिए।',
  },
  continue: 'आगे बढ़ें',
}

export const v3Copy: Record<'en' | 'hi', V3Copy> = { en, hi }

/** "{key}" placeholders filled in. */
export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}

/** A line with "{name}" — without the name part when the name is not known. */
export function withName(text: string, name: string | null): string {
  if (name !== null && name.trim() !== '') return text.replaceAll('{name}', name.trim())
  return text.replace(/\{name\}( जी)?,?\s*/u, '').replace(/^\s*👋\s*$/u, '')
}
