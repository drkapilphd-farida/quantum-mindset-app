import type { BuRole } from "./passages";
import type { ClassBand } from "./types";

// Brain Unlock — every on-screen line, English and Hindi (founder spec,
// 13 Nov 2026). Honest wording: "you saw it yourself", never "guaranteed";
// real numbers only; no fake timers, seats or percentiles.

export type BuCopy = {
  pageName: string;
  langLabel: string;
  sound: { on: string; off: string };
  hook: {
    title: string;
    sub: string;
    roles: Record<BuRole, string>;
    classQ: string;
    classes: Record<ClassBand, string>;
    optional: string;
    next: string;
  };
  pain: Record<BuRole, string>;
  yes: string;
  promise: {
    title: string;
    trust: string[];
    duoQ: string;
    duo: string;
    solo: string;
    duoSub: string;
    start: string;
    noSignup: string;
  };
  progress: {
    check: string;
    superpower: (n: number) => string;
    labels: [string, string, string, string];
  };
  handoff: {
    toChild: string;
    toParent: string;
    ready: string;
    childName: string;
    parentName: string;
  };
  check: {
    intro: string;
    speedTitle: string;
    speedHint: string;
    startReading: string;
    done: string;
    oneQuestion: string;
    memoryTitle: string;
    memoryHint: string;
    show: string;
    pickTitle: string;
    picked: (n: number) => string;
    focusTitle: string;
    focusHint: string;
    go: string;
    next: (n: number) => string;
    complete: string;
    completeSub: string;
    unlockNow: string;
  };
  speed: {
    title: string;
    teach: string;
    modeTitle: string;
    modeHint: (before: number, now: number) => string;
    start: string;
    slower: string;
    faster: string;
    tapHint: string;
    paused: string;
    questions: string;
    q: (i: number, n: number) => string;
    next: string;
    reveal: string;
    improved: (b: number, a: number) => string;
    flat: (b: number, a: number) => string;
    notCounted: (a: number, b: number) => string;
  };
  memory: {
    title: string;
    recap: (n: number) => string;
    teach: string;
    play: string;
    replay: string;
    recallTitle: string;
    recallHint: string;
    backTitle: string;
    backHint: string;
    undo: string;
    check: string;
    improved: (b: number, a: number, backwards: boolean) => string;
    flat: (b: number, a: number) => string;
  };
  focus: {
    title: string;
    teach: string;
    breatheIn: string;
    breatheOut: string;
    gridTitle: string;
    improved: (b: number, a: number) => string;
    flat: (b: number, a: number) => string;
  };
  kind: string;
  sawIt: string;
  unlocked: string;
  nextSuperpower: string;
  seeReport: string;
  report: {
    title: string;
    speed: string;
    memory: string;
    focus: string;
    wpm: string;
    score: string;
    yourType: string;
    disclaimer: string;
    main: string;
    roleLine: Record<BuRole, string>;
    team: string;
    duoLine: (b: number, a: number) => string;
    you: string;
    child: string;
    notCounted: string;
  };
  lead: {
    title: string;
    name: string;
    phone: string;
    email: string;
    submit: string;
    saving: string;
    privacy: string;
    sent: string;
    sentSub: string;
    again: string;
  };
  share: { title: string; image: string; download: string; whatsapp: string };
  offer: {
    reviewsTitle: string;
    stripTitle: string;
    plansTitle: string;
    recommended: string;
    selfName: string;
    selfSub: string;
    liveName: string;
    liveSub: string;
    oneTime: string;
    selfCta: string;
    liveCta: string;
    whatsapp: string;
    batch: (date: string, seats: number | null) => string;
    guaranteeLink: string;
    faqTitle: string;
    faq: { q: string; a: string }[];
    retake: string;
  };
  error: string;
};

const en: BuCopy = {
  pageName: "Brain Unlock",
  langLabel: "Language",
  sound: { on: "Sound on", off: "Sound off" },
  hook: {
    title: "Who is this for?",
    sub: "One tap — then 4 minutes of brain play.",
    roles: {
      parent: "👩‍👧 Parent (for my child)",
      student: "👨‍🎓 Student",
      professional: "💼 Professional",
    },
    classQ: "Which class?",
    classes: {
      "5-8": "Class 5–8",
      "9-10": "Class 9–10",
      "11-12": "Class 11–12",
      college: "College",
    },
    optional: "Optional",
    next: "Next →",
  },
  pain: {
    parent: "Does your child study for hours, but still forget in the exam?",
    student: "Does your mind drift away while you study?",
    professional: "You read a lot every day, but remember little?",
  },
  yes: "Yes, that’s me",
  promise: {
    title: "In 4 minutes, let’s unlock 3 hidden superpowers of your brain.",
    trust: [
      "10,000+ learners",
      "500+ workshops",
      "Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach",
    ],
    duoQ: "How do you want to play?",
    duo: "👩‍👧 Play together with your child",
    solo: "🙋 Just me",
    duoSub: "Take turns on one phone. See both results side by side.",
    start: "Start Brain Unlock →",
    noSignup: "No sign-up. Free.",
  },
  progress: {
    check: "Brain Check",
    superpower: (n) => `Superpower ${n} of 3`,
    labels: ["Check", "⚡ Speed", "🧠 Memory", "🎯 Focus"],
  },
  handoff: {
    toChild: "Now hand the phone to your child 👉",
    toParent: "Now hand the phone back to the parent 👈",
    ready: "Ready — let’s go!",
    childName: "Child’s turn",
    parentName: "Parent’s turn",
  },
  check: {
    intro: "First, a quick Brain Check (about 1 minute). No scores yet!",
    speedTitle: "Read this at your normal speed",
    speedHint: "Read it once, like you usually do. Then tap Done.",
    startReading: "Start reading",
    done: "Done ✓",
    oneQuestion: "One quick question",
    memoryTitle: "Remember 5 words",
    memoryHint: "Each word shows for 2 seconds.",
    show: "Show the words",
    pickTitle: "Tap the 5 words you saw",
    picked: (n) => `${n} of 5 picked`,
    focusTitle: "Tap 1 to 16 in order",
    focusHint: "As fast as you can. Start with 1.",
    go: "Go!",
    next: (n) => `Next: ${n}`,
    complete: "Brain Check complete ✅",
    completeSub: "Now let’s unlock!",
    unlockNow: "Unlock my superpowers →",
  },
  speed: {
    title: "⚡ Speed Superpower",
    teach:
      "Your eyes usually jump around while reading. Now the words will come to your eyes. Just keep looking at the red letter.",
    modeTitle: "Word Flash: a NEW passage, one word at a time",
    modeHint: (before, now) =>
      `Your normal speed: ${before} WPM → Now: ${now} WPM ⚡`,
    start: "Start ▶",
    slower: "Slower",
    faster: "Faster",
    tapHint: "Tap the box to pause. Use − / + to change the speed.",
    paused: "Paused. Tap to continue",
    questions: "Two quick questions about what you just read",
    q: (i, n) => `Question ${i} of ${n}`,
    next: "Next",
    reveal: "See my result",
    improved: (b, a) => `⚡ ${b} → ${a} WPM, and you understood it!`,
    flat: (b, a) => `⚡ ${b} → ${a} WPM, with understanding`,
    notCounted: (a, b) =>
      `You read at ${a} WPM, but the questions were tricky this time. Your speed today: ${b} WPM.`,
  },
  memory: {
    title: "🧠 Memory Superpower",
    recap: (n) => `Earlier you remembered ${n} of 5.`,
    teach:
      "The secret: your brain loves pictures and stories. Let’s link 5 NEW words into one crazy story. See each picture in your mind.",
    play: "Play the story ▶",
    replay: "I can see it! Test me →",
    recallTitle: "Tap the words in story order",
    recallHint: "First word first.",
    backTitle: "Bonus: now say them backwards! 🔄",
    backHint: "Last word first.",
    undo: "Undo",
    check: "Check",
    improved: (b, a, back) =>
      back
        ? `🧠 ${b}/5 → ${a}/5, and backwards too! 🎉`
        : `🧠 ${b}/5 → ${a}/5, in order! 🎉`,
    flat: (b, a) => `🧠 ${b}/5 → ${a}/5`,
  },
  focus: {
    title: "🎯 Focus Superpower",
    teach:
      "Look softly at the glowing dot. Breathe in for 4… and out for 6. Let your mind settle.",
    breatheIn: "Breathe in…",
    breatheOut: "Breathe out…",
    gridTitle: "A NEW grid. Tap 1 to 16 in order",
    improved: (b, a) => `🎯 Focus time ${b}s → ${a}s`,
    flat: (b, a) => `🎯 Focus time ${b}s → ${a}s`,
  },
  kind: "Great effort! In 30 days of practice this grows step by step.",
  sawIt: "You just saw it yourself.",
  unlocked: "Superpower unlocked!",
  nextSuperpower: "Next superpower →",
  seeReport: "See my Brain Unlock Report →",
  report: {
    title: "Your Brain Unlock Report",
    speed: "Reading speed",
    memory: "Memory",
    focus: "Focus",
    wpm: "WPM",
    score: "Brain Unlock Score",
    yourType: "Your Brain Type",
    disclaimer:
      "Brain Types are a fun way to show your result, not a medical or psychological test.",
    main: "This was just 4 minutes. In Sharp Brain, this happens every day for 30 days, with Dr. Kapil.",
    roleLine: {
      parent:
        "Your child doesn’t need more hours. They need the right method. You just saw it work.",
      student: "Imagine your exam prep with this speed and memory.",
      professional:
        "Get back hours every week with faster reading and stronger recall.",
    },
    team: "Team Score",
    duoLine: (b, a) =>
      `You just watched your child go from ${b}/5 to ${a}/5 in one minute.`,
    you: "You",
    child: "Child",
    notCounted: "today",
  },
  lead: {
    title: "Get your full Brain Unlock Report + your 30-day plan on WhatsApp",
    name: "Your name",
    phone: "WhatsApp number",
    email: "Email (optional)",
    submit: "Get my report on WhatsApp",
    saving: "Opening WhatsApp…",
    privacy:
      "We use your number only to send your report and Sharp Brain updates. Reply STOP any time.",
    sent: "Your report is saved ✅",
    sentSub:
      "WhatsApp opened with your report typed in. Just tap Send and Dr. Kapil will send your 30-day plan. Your plans are just below.",
    again: "Open WhatsApp again",
  },
  share: {
    title: "Share your Brain Type",
    image: "Share my result card",
    download: "Download report image",
    whatsapp: "Share on WhatsApp",
  },
  offer: {
    reviewsTitle: "Real learners, real change",
    stripTitle: "Real students’ reading speed, before → after:",
    plansTitle: "Choose your Sharp Brain plan",
    recommended: "Recommended",
    selfName: "Self-paced",
    selfSub: "All 7 classes recorded · 30 days of app practice",
    liveName: "Live batch",
    liveSub: "7 live classes with Dr. Kapil · 30 days of app practice",
    oneTime: "one-time",
    selfCta: "Start Self-paced ₹2,999",
    liveCta: "Join the Live Batch",
    whatsapp: "Talk on WhatsApp",
    batch: (date, seats) =>
      seats === null
        ? `Next live batch: ${date}`
        : `Next live batch: ${date} · ${seats} seats left`,
    guaranteeLink: "See full terms",
    faqTitle: "Questions",
    faq: [
      {
        q: "How many minutes a day?",
        a: "10–15 minutes of app practice a day, plus the 7 classes (live or recorded).",
      },
      {
        q: "What age is it for?",
        a: "Students from Class 5, college students, exam aspirants and working professionals.",
      },
      {
        q: "Online or offline?",
        a: "Online: classes on Zoom (or recorded) and practice in the app on any phone.",
      },
      {
        q: "What is the Results Guarantee?",
        a: "A full refund if you complete all 30 days and all 7 classes, take both reading tests, and on Day 30 neither your effective reading speed nor your retention has improved.",
      },
      {
        q: "What happens after payment?",
        a: "The app unlocks at once for the email you pay with, and our team sends you a WhatsApp welcome with the next steps.",
      },
    ],
    retake: "Take Brain Unlock",
  },
  error: "Something went wrong. Please try again.",
};

const hi: BuCopy = {
  pageName: "Brain Unlock",
  langLabel: "भाषा",
  sound: { on: "आवाज़ चालू", off: "आवाज़ बंद" },
  hook: {
    title: "यह किसके लिए है?",
    sub: "एक tap — फिर 4 मिनट का brain play.",
    roles: {
      parent: "👩‍👧 Parent (अपने बच्चे के लिए)",
      student: "👨‍🎓 Student",
      professional: "💼 Professional",
    },
    classQ: "कौन-सी class?",
    classes: {
      "5-8": "Class 5–8",
      "9-10": "Class 9–10",
      "11-12": "Class 11–12",
      college: "College",
    },
    optional: "ज़रूरी नहीं",
    next: "आगे →",
  },
  pain: {
    parent: "क्या आपका बच्चा घंटों पढ़ता है, फिर भी exam में भूल जाता है?",
    student: "पढ़ते-पढ़ते दिमाग़ कहीं और चला जाता है?",
    professional: "रोज़ बहुत पढ़ते हैं, लेकिन याद कम रहता है?",
  },
  yes: "हाँ, बिल्कुल",
  promise: {
    title: "4 मिनट में आपके दिमाग़ की 3 छुपी शक्तियाँ unlock करते हैं।",
    trust: [
      "10,000+ learners",
      "500+ workshops",
      "Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach",
    ],
    duoQ: "कैसे खेलना चाहेंगे?",
    duo: "👩‍👧 बच्चे के साथ मिलकर",
    solo: "🙋 सिर्फ़ मैं",
    duoSub: "एक ही फ़ोन पर बारी-बारी से। दोनों के नतीजे साथ-साथ।",
    start: "Brain Unlock शुरू करें →",
    noSignup: "कोई sign-up नहीं। मुफ़्त।",
  },
  progress: {
    check: "Brain Check",
    superpower: (n) => `Superpower ${n} / 3`,
    labels: ["Check", "⚡ Speed", "🧠 Memory", "🎯 Focus"],
  },
  handoff: {
    toChild: "अब फ़ोन अपने बच्चे को दीजिए 👉",
    toParent: "अब फ़ोन वापस parent को दीजिए 👈",
    ready: "तैयार — चलिए!",
    childName: "बच्चे की बारी",
    parentName: "Parent की बारी",
  },
  check: {
    intro: "पहले एक छोटा-सा Brain Check (लगभग 1 मिनट)। अभी कोई score नहीं!",
    speedTitle: "इसे अपनी normal speed से पढ़िए",
    speedHint: "जैसे आप हमेशा पढ़ते हैं, एक बार पढ़िए। फिर Done दबाइए।",
    startReading: "पढ़ना शुरू करें",
    done: "Done ✓",
    oneQuestion: "एक छोटा-सा सवाल",
    memoryTitle: "5 शब्द याद रखिए",
    memoryHint: "हर शब्द 2 सेकंड दिखेगा।",
    show: "शब्द दिखाइए",
    pickTitle: "जो 5 शब्द देखे, उन पर tap कीजिए",
    picked: (n) => `5 में से ${n} चुने`,
    focusTitle: "1 से 16 तक क्रम से tap कीजिए",
    focusHint: "जितनी जल्दी हो सके। 1 से शुरू कीजिए।",
    go: "शुरू!",
    next: (n) => `अगला: ${n}`,
    complete: "Brain Check पूरा ✅",
    completeSub: "अब unlock करते हैं!",
    unlockNow: "मेरी superpowers unlock करें →",
  },
  speed: {
    title: "⚡ Speed Superpower",
    teach:
      "आपकी आँखें पढ़ते समय इधर-उधर भटकती हैं। अब शब्द ख़ुद आपकी आँखों तक आएँगे, बस दोनों निशानों के बीच नज़र टिकाइए।",
    modeTitle: "Word Flash: एक नया passage, एक बार में एक शब्द",
    modeHint: (before, now) =>
      `आपकी सामान्य speed: ${before} WPM → अब: ${now} WPM ⚡`,
    start: "शुरू ▶",
    slower: "धीमा",
    faster: "तेज़",
    tapHint: "रुकने के लिए बॉक्स पर टैप करें। speed बदलने के लिए − / + दबाइए।",
    paused: "रुका है, जारी रखने के लिए टैप करें",
    questions: "अभी जो पढ़ा, उस पर दो छोटे सवाल",
    q: (i, n) => `सवाल ${i} / ${n}`,
    next: "आगे",
    reveal: "मेरा नतीजा देखें",
    improved: (b, a) => `⚡ ${b} → ${a} WPM, और आपने समझा भी!`,
    flat: (b, a) => `⚡ ${b} → ${a} WPM, समझ के साथ`,
    notCounted: (a, b) =>
      `आपने ${a} WPM पर पढ़ा, पर इस बार सवाल मुश्किल रहे। आज आपकी speed: ${b} WPM.`,
  },
  memory: {
    title: "🧠 Memory Superpower",
    recap: (n) => `पहले आपको 5 में से ${n} याद रहे।`,
    teach:
      "राज़ यह है: दिमाग़ को तस्वीरें और कहानियाँ पसंद हैं। चलिए 5 नए शब्दों को एक मज़ेदार कहानी में जोड़ते हैं। हर तस्वीर को मन में देखिए।",
    play: "कहानी चलाइए ▶",
    replay: "मुझे दिख रहा है! अब पूछिए →",
    recallTitle: "कहानी के क्रम में शब्दों पर tap कीजिए",
    recallHint: "पहला शब्द सबसे पहले।",
    backTitle: "Bonus: अब उल्टे क्रम में! 🔄",
    backHint: "आख़िरी शब्द सबसे पहले।",
    undo: "Undo",
    check: "Check",
    improved: (b, a, back) =>
      back
        ? `🧠 ${b}/5 → ${a}/5, और उल्टा भी! 🎉`
        : `🧠 ${b}/5 → ${a}/5, क्रम से! 🎉`,
    flat: (b, a) => `🧠 ${b}/5 → ${a}/5`,
  },
  focus: {
    title: "🎯 Focus Superpower",
    teach:
      "चमकते हुए बिंदु को हल्के से देखिए। 4 तक साँस लीजिए… और 6 तक छोड़िए। मन को शांत होने दीजिए।",
    breatheIn: "साँस लीजिए…",
    breatheOut: "साँस छोड़िए…",
    gridTitle: "एक नया grid। 1 से 16 तक क्रम से tap कीजिए",
    improved: (b, a) => `🎯 Focus time ${b}s → ${a}s`,
    flat: (b, a) => `🎯 Focus time ${b}s → ${a}s`,
  },
  kind: "बहुत बढ़िया कोशिश! 30 दिन की practice में यह कदम-दर-कदम बढ़ता है।",
  sawIt: "आपने यह खुद देखा।",
  unlocked: "Superpower unlock हुई!",
  nextSuperpower: "अगली superpower →",
  seeReport: "मेरी Brain Unlock Report देखें →",
  report: {
    title: "आपकी Brain Unlock Report",
    speed: "Reading speed",
    memory: "Memory",
    focus: "Focus",
    wpm: "WPM",
    score: "Brain Unlock Score",
    yourType: "आपका Brain Type",
    disclaimer:
      "Brain Types नतीजा दिखाने का एक मज़ेदार तरीका हैं, कोई medical या psychological test नहीं।",
    main: "ये सिर्फ़ 4 मिनट थे। Sharp Brain में यही 30 दिन रोज़ होता है, Dr. Kapil के साथ।",
    roleLine: {
      parent:
        "आपके बच्चे को ज़्यादा घंटों की नहीं, सही तरीके की ज़रूरत है। आपने उसे काम करते देखा।",
      student: "सोचिए, इस speed और memory के साथ आपकी exam की तैयारी कैसी होगी।",
      professional: "तेज़ पढ़ाई और पक्की याद से हर हफ़्ते घंटों का समय बचाइए।",
    },
    team: "Team Score",
    duoLine: (b, a) =>
      `आपने अभी अपने बच्चे को एक मिनट में ${b}/5 से ${a}/5 तक जाते देखा।`,
    you: "आप",
    child: "बच्चा",
    notCounted: "आज",
  },
  lead: {
    title: "अपनी पूरी Brain Unlock Report + 30-दिन का plan WhatsApp पर पाइए",
    name: "आपका नाम",
    phone: "WhatsApp नंबर",
    email: "Email (ज़रूरी नहीं)",
    submit: "मेरी report WhatsApp पर पाइए",
    saving: "WhatsApp खोल रहे हैं…",
    privacy:
      "आपका नंबर सिर्फ़ report और Sharp Brain updates भेजने के लिए। कभी भी STOP लिखकर बंद करें।",
    sent: "आपकी report save हो गई ✅",
    sentSub:
      "WhatsApp में आपकी report लिखी हुई खुल गई है। बस Send दबाइए, Dr. Kapil आपका 30-दिन का plan भेजेंगे। आपके plans नीचे हैं।",
    again: "WhatsApp फिर से खोलें",
  },
  share: {
    title: "अपना Brain Type share कीजिए",
    image: "मेरा result card share करें",
    download: "Report image download करें",
    whatsapp: "WhatsApp पर share करें",
  },
  offer: {
    reviewsTitle: "असली learners, असली बदलाव",
    stripTitle: "असली students की reading speed, पहले → बाद में:",
    plansTitle: "अपना Sharp Brain plan चुनिए",
    recommended: "Recommended",
    selfName: "Self-paced",
    selfSub: "सभी 7 classes recorded · 30 दिन app practice",
    liveName: "Live batch",
    liveSub: "Dr. Kapil के साथ 7 live classes · 30 दिन app practice",
    oneTime: "एक बार",
    selfCta: "Self-paced शुरू करें ₹2,999",
    liveCta: "Live Batch join करें",
    whatsapp: "WhatsApp पर बात करें",
    batch: (date, seats) =>
      seats === null
        ? `अगला live batch: ${date}`
        : `अगला live batch: ${date} · ${seats} seats बाकी`,
    guaranteeLink: "पूरी शर्तें देखें",
    faqTitle: "सवाल-जवाब",
    faq: [
      {
        q: "रोज़ कितने मिनट?",
        a: "रोज़ 10–15 मिनट app practice, और 7 classes (live या recorded)।",
      },
      {
        q: "किस उम्र के लिए?",
        a: "Class 5 से students, college students, exam की तैयारी करने वाले और working professionals.",
      },
      {
        q: "Online या offline?",
        a: "Online: Zoom पर classes (या recorded) और किसी भी फ़ोन पर app में practice.",
      },
      {
        q: "Results Guarantee क्या है?",
        a: "अगर आप सभी 30 दिन और 7 classes पूरी करते हैं, दोनों reading tests देते हैं, और Day 30 पर न effective reading speed बढ़ी न retention, तो पूरा refund.",
      },
      {
        q: "Payment के बाद क्या होगा?",
        a: "जिस email से payment करेंगे, उसके लिए app तुरंत unlock हो जाएगा, और हमारी team WhatsApp पर welcome और अगले steps भेजेगी।",
      },
    ],
    retake: "Brain Unlock करें",
  },
  error: "कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।",
};

export const buCopy: Record<"en" | "hi", BuCopy> = { en, hi };
