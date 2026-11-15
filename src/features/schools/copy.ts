// "Sharp Brain for Schools" (/schools) — page copy, English and Hindi
// (founder brief, 15 Nov 2026). Rules this file must keep (tested in
// copy.test.ts):
// - "EEG headband", never a device brand name.
// - Every report or score says "Educational assessment, not a medical test."
// - No medical words (ADHD, dyslexia, depression, diagnosis …): "focus,
//   memory, reading strengths".
// - No numbers that are not real: results, sample values and prices come
//   from the admin settings (settings.ts) and their sections hide when empty.

export type SchoolsLang = "en" | "hi";

export type FaqItem = { q: string; a: string };

/** Dr. Kapil's credentials, exactly as the founder wrote them (English). */
export const COACH_LINE_EN =
  "Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach · 12+ years of mind coaching · 15 years as a professor · 500+ workshops · 10,000+ learners";

export const SCHOOLS_PATH = "/schools";

export type SchoolsCopy = {
  meta: { title: string; description: string };
  nav: { cta: string; language: string };
  disclaimer: string;
  example: string;
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    book: string;
    whatsapp: string;
    whatsappText: string;
    mediaAlt: string;
  };
  challenge: { title: string; points: { title: string; text: string }[]; line: string };
  how: { title: string; steps: { title: string; text: string }[]; note: string[] };
  gets: { title: string; cards: { who: string; title: string; items: string[] }[] };
  passport: {
    title: string;
    sub: string;
    sampleNote: string;
    compareTitle: string;
    day1: string;
    day30: string;
    metrics: { focus: string; memory: string; reading: string; retention: string };
  };
  packages: {
    title: string;
    sub: string;
    free: string;
    onRequest: string;
    popular: string;
    cta: string;
    items: { id: "pilot" | "camp" | "program"; name: string; who: string; includes: string[]; note: string }[];
  };
  results: { title: string; sub: string; students: string; day1: string; day30: string };
  about: { title: string; coachLine: string; bio: string[]; photoAlt: string };
  safety: {
    title: string;
    points: { title: string; text: string }[];
    consentTitle: string;
    consentText: string;
    download: string;
    downloadOther: string;
  };
  faq: { title: string; items: FaqItem[] };
  form: {
    title: string;
    sub: string;
    school: string;
    city: string;
    contact: string;
    role: string;
    roles: Record<SchoolRole, string>;
    phone: string;
    phoneHint: string;
    email: string;
    students: string;
    month: string;
    monthAny: string;
    message: string;
    messageHint: string;
    choose: string;
    optional: string;
    submit: string;
    sending: string;
    privacy: string;
    errors: { phone: string; generic: string; check: string };
    thanks: { title: string; text: string; whatsapp: string; whatsappText: (school: string) => string };
  };
};

export const SCHOOL_ROLES = [
  "principal",
  "director",
  "vice_principal",
  "coordinator",
  "teacher",
  "other",
] as const;
export type SchoolRole = (typeof SCHOOL_ROLES)[number];

const en: SchoolsCopy = {
  meta: {
    title: "Sharp Brain for Schools: EEG Brain & Focus Assessment | Mind Ur Mind",
    description:
      "An 8-minute EEG Brain & Focus Assessment for every student, a personal Brain Passport for parents and a class dashboard for the school, then 30 days to grow focus, memory and reading speed. Book a free pilot for one class.",
  },
  nav: { cta: "Book a free pilot", language: "हिंदी" },
  disclaimer: "Educational assessment, not a medical test.",
  example: "Example",
  hero: {
    eyebrow: "Sharp Brain for Schools",
    h1: "See your students' Focus, Memory and Reading Speed with EEG, and grow them in 30 days.",
    sub: "An 8-minute EEG Brain & Focus Assessment · a personal Brain Passport for every student · a class dashboard for the school",
    book: "Book a free pilot for your school",
    whatsapp: "WhatsApp us",
    whatsappText: "Hello, I'm from [school], interested in Sharp Brain for Schools",
    mediaAlt: "A student wearing the EEG headband during the assessment",
  },
  challenge: {
    title: "The challenge every school sees",
    points: [
      { title: "Long hours, low retention", text: "Students study for hours, and much of it is gone by the exam." },
      { title: "Attention broken by phones", text: "Notifications and short videos train the mind to jump every few seconds." },
      { title: "Slow, word-by-word reading", text: "Most students still read one word at a time, so every chapter takes longer." },
      { title: "Board-exam stress", text: "Pressure builds, and a stressed mind finds it harder to focus and recall." },
    ],
    line: "Schools teach what to learn. Very few teach how to focus, read and remember.",
  },
  how: {
    title: "How it works on the day",
    steps: [
      { title: "Fit the EEG headband", text: "A soft headband that only reads signals. It takes under a minute." },
      { title: "Focus task", text: "A short task that shows how steadily the student holds attention." },
      { title: "Reading task", text: "Normal reading, then RSVP (one word at a time), to see reading speed and understanding." },
      { title: "Memory task", text: "A quick, fun recall task for memory and retention." },
      { title: "Brain Passport on WhatsApp", text: "The parent receives the student's personal Brain Passport." },
    ],
    note: [
      "~8 minutes per student",
      "a class of 40 in about one school day",
      "no disruption to the timetable",
      "Day 30 re-assessment with the same equipment",
    ],
  },
  gets: {
    title: "What everyone gets",
    cards: [
      {
        who: "Students",
        title: "Brain Passport",
        items: ["Sharp Brain Score", "Focus, Memory, Reading Speed, Retention", "A fun Brain Type", "Badges to unlock"],
      },
      {
        who: "Parents",
        title: "Report on WhatsApp",
        items: ["The child's Brain Passport", "3 home tips", "A 30-day plan", "Day 30 comparison"],
      },
      {
        who: "School",
        title: "Class-wise dashboard",
        items: ["Class averages, no names", "Day 30 progress report", "\"Brain-Smart School\" certificate"],
      },
      {
        who: "Teachers",
        title: "1-hour workshop",
        items: ["3 classroom techniques for focus and recall", "Easy to use in any subject", "Works with the existing timetable"],
      },
    ],
  },
  passport: {
    title: "A sample Brain Passport",
    sub: "Every student gets one, and the parent receives it on WhatsApp.",
    sampleNote: "Sample report with a fictional name.",
    compareTitle: "Day 1 vs Day 30",
    day1: "Day 1",
    day30: "Day 30",
    metrics: { focus: "Focus", memory: "Memory", reading: "Reading speed", retention: "Retention" },
  },
  packages: {
    title: "Packages for schools",
    sub: "Start with a free pilot in one class. Grow from there.",
    free: "Free",
    onRequest: "On request",
    popular: "Most complete",
    cta: "Book a free pilot",
    items: [
      {
        id: "pilot",
        name: "Pilot",
        who: "One class (up to 40 students)",
        includes: ["EEG Brain & Focus Assessment", "A Brain Passport for every student", "Class summary for the school"],
        note: "Free for your first class.",
      },
      {
        id: "camp",
        name: "Brain Focus Camp",
        who: "2–3 days at your school",
        includes: [
          "EEG Brain & Focus Assessment",
          "Focus & memory session for students",
          "Brain Passports",
          "Teacher workshop",
          "Class-wise dashboard",
        ],
        note: "Per-student fee · revenue share for the school · on request.",
      },
      {
        id: "program",
        name: "Sharp Brain 30-Day Program",
        who: "The full 30-day journey",
        includes: [
          "Everything in the Camp",
          "30 days of app practice",
          "7 classes",
          "Day 30 EEG re-assessment",
          "Progress report for the school",
        ],
        note: "Special school rate.",
      },
    ],
  },
  results: {
    title: "Results so far",
    sub: "Real class averages from schools, Day 1 vs Day 30.",
    students: "students",
    day1: "Day 1",
    day30: "Day 30",
  },
  about: {
    title: "Who leads it",
    coachLine: COACH_LINE_EN,
    bio: [
      "Dr. Kapil has spent more than 12 years helping students and professionals focus better, read faster and remember more.",
      "He created the Sharp Brain program that this assessment and the 30-day plan are built on.",
    ],
    photoAlt: "Dr. Kapil Dev Sharma",
  },
  safety: {
    title: "Safety, privacy and honesty",
    points: [
      { title: "Non-invasive", text: "The EEG headband only reads signals. Nothing enters the body. It is cleaned between students." },
      { title: "Parent consent first", text: "No student is assessed without written consent from a parent or guardian." },
      { title: "Reports go to parents", text: "Each report goes only to the parent. The school sees class-level results without names, unless the parent agrees." },
      { title: "Data used only for the report", text: "We use the data only to prepare the report and measure progress. It is never sold or shared." },
      { title: "No labels", text: "We describe focus, memory and reading strengths and the next steps. We never label a child." },
      { title: "Under 8: suggestions only", text: "Children under 8 get friendly suggestions, with no scores." },
    ],
    consentTitle: "Parent consent form",
    consentText: "A one-page form for parents, in English and Hindi. Print it and send it home before the assessment day.",
    download: "Download parent consent form (PDF)",
    downloadOther: "Hindi version (PDF)",
  },
  faq: {
    title: "Questions principals ask",
    items: [
      {
        q: "How long does it take?",
        a: "About 8 minutes per student, so a class of 40 takes about one school day. We work around your timetable, a few students at a time, so classes carry on.",
      },
      {
        q: "How much space do you need?",
        a: "A quiet room or a calm corner with a table, two chairs and a power socket. We bring the EEG headbands and everything else.",
      },
      {
        q: "Is it safe?",
        a: "Yes. The EEG headband is soft and non-invasive: it only reads signals, nothing enters the body, and it is cleaned between students. A student can stop at any time.",
      },
      {
        q: "Where does the data go?",
        a: "Each student's report goes only to their parent on WhatsApp. The school sees class-level results without names, unless a parent agrees. The data is used only for the report and progress, and a parent can ask us to delete it at any time.",
      },
      {
        q: "What do we tell parents?",
        a: "We give you a one-page consent form in English and Hindi and a short note for parents. It explains that this is an educational assessment of focus, memory and reading, not a medical test, and that the report comes to them.",
      },
      {
        q: "What does it cost the school?",
        a: "The pilot for one class is free. For the Brain Focus Camp there is a per-student fee with a revenue share for the school, and the 30-Day Program has a special school rate. We share the exact numbers when we talk.",
      },
      {
        q: "Do you come to our city?",
        a: "We are based in Vadodara, Gujarat, and we travel to schools in other cities. Tell us your city in the form below and we will plan the dates with you.",
      },
    ],
  },
  form: {
    title: "Book a free pilot",
    sub: "Tell us about your school, and we will call or WhatsApp you.",
    school: "School name",
    city: "City",
    contact: "Your name",
    role: "Your role",
    roles: {
      principal: "Principal",
      director: "Director / Trustee",
      vice_principal: "Vice principal",
      coordinator: "Coordinator",
      teacher: "Teacher",
      other: "Other",
    },
    phone: "Phone (WhatsApp)",
    phoneHint: "10-digit Indian mobile number",
    email: "Email",
    students: "Number of students",
    month: "Preferred month",
    monthAny: "Not sure yet",
    message: "Message",
    messageHint: "Classes you have in mind, questions, anything else",
    choose: "Choose…",
    optional: "optional",
    submit: "Book my free pilot",
    sending: "Sending…",
    privacy: "We use these details only to contact you about the pilot.",
    errors: {
      phone: "Please enter a valid 10-digit Indian mobile number.",
      generic: "Something went wrong. Please try again, or message us on WhatsApp.",
      check: "Please fill in every required field.",
    },
    thanks: {
      title: "Thank you!",
      text: "We have your request and will contact you soon. For a faster reply, message us on WhatsApp.",
      whatsapp: "Message us on WhatsApp",
      whatsappText: (school) =>
        `Hello, I'm from ${school}, interested in Sharp Brain for Schools. I have just booked a free pilot on your website.`,
    },
  },
};

const hi: SchoolsCopy = {
  meta: {
    title: "Sharp Brain for Schools: EEG Brain & Focus Assessment | Mind Ur Mind",
    description:
      "हर student के लिए 8 मिनट का EEG Brain & Focus Assessment, parents के लिए personal Brain Passport और school के लिए class dashboard, फिर 30 दिन में focus, memory और reading speed बढ़ाइए। एक class के लिए मुफ़्त pilot बुक कीजिए।",
  },
  nav: { cta: "मुफ़्त pilot बुक करें", language: "English" },
  disclaimer: "शैक्षिक आकलन है, मेडिकल टेस्ट नहीं।",
  example: "उदाहरण",
  hero: {
    eyebrow: "Sharp Brain for Schools",
    h1: "अपने students का Focus, Memory और Reading Speed EEG से देखिए, और 30 दिन में बढ़ाइए।",
    sub: "8 मिनट का EEG Brain & Focus Assessment · हर student के लिए personal Brain Passport · school के लिए class dashboard",
    book: "अपने school के लिए मुफ़्त pilot बुक करें",
    whatsapp: "WhatsApp करें",
    whatsappText: "नमस्ते, मैं [school] से हूँ, Sharp Brain for Schools के बारे में जानना चाहता/चाहती हूँ",
    mediaAlt: "Assessment के दौरान EEG headband पहने एक student",
  },
  challenge: {
    title: "हर school यह चुनौती देखता है",
    points: [
      { title: "घंटों पढ़ाई, कम याद", text: "Students घंटों पढ़ते हैं, पर exam तक उसमें से बहुत कुछ भूल जाते हैं।" },
      { title: "फ़ोन से टूटता ध्यान", text: "Notifications और छोटे videos मन को हर कुछ सेकंड में भटकना सिखा देते हैं।" },
      { title: "धीमी, शब्द-शब्द पढ़ाई", text: "ज़्यादातर students अब भी एक-एक शब्द पढ़ते हैं, इसलिए हर chapter में ज़्यादा समय लगता है।" },
      { title: "Board exam का तनाव", text: "दबाव बढ़ता है, और तनाव में मन के लिए ध्यान लगाना और याद करना मुश्किल हो जाता है।" },
    ],
    line: "School सिखाते हैं कि क्या पढ़ना है। बहुत कम सिखाते हैं कि ध्यान कैसे लगाएँ, कैसे पढ़ें और कैसे याद रखें।",
  },
  how: {
    title: "Assessment के दिन क्या होता है",
    steps: [
      { title: "EEG headband पहनाना", text: "एक नरम headband जो सिर्फ़ signals पढ़ता है। एक मिनट से कम लगता है।" },
      { title: "Focus task", text: "एक छोटा task जो दिखाता है कि student कितनी देर एक जगह ध्यान टिका पाता है।" },
      { title: "Reading task", text: "पहले सामान्य पढ़ाई, फिर RSVP (एक बार में एक शब्द), ताकि reading speed और समझ दोनों दिखें।" },
      { title: "Memory task", text: "Memory और retention के लिए एक छोटा, मज़ेदार task।" },
      { title: "WhatsApp पर Brain Passport", text: "Parent को student का personal Brain Passport मिलता है।" },
    ],
    note: [
      "हर student के लिए ~8 मिनट",
      "40 students की class लगभग एक school day में",
      "timetable में कोई रुकावट नहीं",
      "30वें दिन उसी equipment से दोबारा assessment",
    ],
  },
  gets: {
    title: "किसे क्या मिलता है",
    cards: [
      {
        who: "Students",
        title: "Brain Passport",
        items: ["Sharp Brain Score", "Focus, Memory, Reading Speed, Retention", "एक मज़ेदार Brain Type", "Badges"],
      },
      {
        who: "Parents",
        title: "WhatsApp पर report",
        items: ["बच्चे का Brain Passport", "घर के लिए 3 tips", "30 दिन का plan", "30वें दिन की तुलना"],
      },
      {
        who: "School",
        title: "Class-wise dashboard",
        items: ["Class का औसत, बिना नामों के", "30वें दिन की progress report", "\"Brain-Smart School\" certificate"],
      },
      {
        who: "Teachers",
        title: "1 घंटे का workshop",
        items: ["Focus और याद के लिए class में 3 तरीके", "किसी भी subject में आसान", "मौजूदा timetable के साथ"],
      },
    ],
  },
  passport: {
    title: "Brain Passport का एक नमूना",
    sub: "हर student को मिलता है, और parent को WhatsApp पर भेजा जाता है।",
    sampleNote: "नमूना report, काल्पनिक नाम के साथ।",
    compareTitle: "पहला दिन बनाम 30वाँ दिन",
    day1: "पहला दिन",
    day30: "30वाँ दिन",
    metrics: { focus: "Focus", memory: "Memory", reading: "Reading speed", retention: "Retention" },
  },
  packages: {
    title: "Schools के लिए packages",
    sub: "एक class में मुफ़्त pilot से शुरू कीजिए, फिर आगे बढ़िए।",
    free: "मुफ़्त",
    onRequest: "पूछने पर",
    popular: "सबसे पूरा",
    cta: "मुफ़्त pilot बुक करें",
    items: [
      {
        id: "pilot",
        name: "Pilot",
        who: "एक class (40 students तक)",
        includes: ["EEG Brain & Focus Assessment", "हर student के लिए Brain Passport", "School के लिए class summary"],
        note: "आपकी पहली class के लिए मुफ़्त।",
      },
      {
        id: "camp",
        name: "Brain Focus Camp",
        who: "आपके school में 2–3 दिन",
        includes: [
          "EEG Brain & Focus Assessment",
          "Students के लिए focus और memory session",
          "Brain Passports",
          "Teacher workshop",
          "Class-wise dashboard",
        ],
        note: "हर student की fee · school के लिए revenue share · पूछने पर।",
      },
      {
        id: "program",
        name: "Sharp Brain 30-Day Program",
        who: "30 दिन की पूरी यात्रा",
        includes: [
          "Camp की हर चीज़",
          "30 दिन ऐप पर practice",
          "7 classes",
          "30वें दिन EEG से दोबारा assessment",
          "School के लिए progress report",
        ],
        note: "Schools के लिए ख़ास rate।",
      },
    ],
  },
  results: {
    title: "अब तक के नतीजे",
    sub: "Schools के असली class औसत, पहला दिन बनाम 30वाँ दिन।",
    students: "students",
    day1: "पहला दिन",
    day30: "30वाँ दिन",
  },
  about: {
    title: "कौन कराते हैं",
    coachLine:
      "Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach · 12+ साल की mind coaching · 15 साल professor · 500+ workshops · 10,000+ learners",
    bio: [
      "Dr. Kapil 12 साल से ज़्यादा समय से students और professionals को बेहतर ध्यान, तेज़ पढ़ाई और ज़्यादा याद रखने में मदद कर रहे हैं।",
      "उन्होंने Sharp Brain program बनाया है, जिस पर यह assessment और 30 दिन का plan आधारित है।",
    ],
    photoAlt: "Dr. Kapil Dev Sharma",
  },
  safety: {
    title: "सुरक्षा, privacy और ईमानदारी",
    points: [
      { title: "बिना किसी चुभन के", text: "EEG headband सिर्फ़ signals पढ़ता है। शरीर में कुछ नहीं जाता। हर student के बाद इसे साफ़ किया जाता है।" },
      { title: "पहले parent की सहमति", text: "Parent या guardian की लिखित सहमति के बिना किसी student का assessment नहीं होता।" },
      { title: "Report सिर्फ़ parents को", text: "हर report सिर्फ़ parent को जाती है। School को बिना नामों के class के नतीजे दिखते हैं, जब तक parent अनुमति न दें।" },
      { title: "Data सिर्फ़ report के लिए", text: "Data का उपयोग सिर्फ़ report बनाने और progress मापने के लिए होता है। इसे न बेचा जाता है, न किसी को दिया जाता है।" },
      { title: "कोई label नहीं", text: "हम focus, memory और reading की ताक़त और अगले कदम बताते हैं। किसी बच्चे पर कोई label नहीं लगाते।" },
      { title: "8 साल से छोटे: सिर्फ़ सुझाव", text: "8 साल से छोटे बच्चों को अच्छे सुझाव मिलते हैं, कोई score नहीं।" },
    ],
    consentTitle: "Parent consent form",
    consentText: "Parents के लिए एक पेज का form, हिंदी और English में। Assessment के दिन से पहले print करके घर भेजिए।",
    download: "Parent consent form डाउनलोड करें (PDF)",
    downloadOther: "English version (PDF)",
  },
  faq: {
    title: "Principals के सवाल",
    items: [
      {
        q: "कितना समय लगता है?",
        a: "हर student के लिए लगभग 8 मिनट, यानी 40 students की class लगभग एक school day में। हम आपके timetable के हिसाब से कुछ-कुछ students को बुलाते हैं, ताकि classes चलती रहें।",
      },
      {
        q: "कितनी जगह चाहिए?",
        a: "एक शांत कमरा या शांत कोना, एक table, दो कुर्सियाँ और एक power socket। EEG headbands और बाकी सब हम लाते हैं।",
      },
      {
        q: "क्या यह सुरक्षित है?",
        a: "हाँ। EEG headband नरम है और बिना किसी चुभन के है: यह सिर्फ़ signals पढ़ता है, शरीर में कुछ नहीं जाता, और हर student के बाद साफ़ किया जाता है। Student कभी भी रुक सकता है।",
      },
      {
        q: "Data कहाँ जाता है?",
        a: "हर student की report सिर्फ़ उसके parent को WhatsApp पर जाती है। School को बिना नामों के class के नतीजे दिखते हैं, जब तक parent अनुमति न दें। Data सिर्फ़ report और progress के लिए है, और parent कभी भी इसे delete करवा सकते हैं।",
      },
      {
        q: "Parents को क्या बताएँ?",
        a: "हम आपको हिंदी और English में एक पेज का consent form और parents के लिए एक छोटा note देते हैं। उसमें लिखा है कि यह focus, memory और reading का शैक्षिक आकलन है, मेडिकल टेस्ट नहीं, और report सीधे उन्हें मिलेगी।",
      },
      {
        q: "School का कितना खर्च होगा?",
        a: "एक class का pilot मुफ़्त है। Brain Focus Camp में हर student की fee होती है और school के लिए revenue share, और 30-Day Program के लिए schools का ख़ास rate है। सही आँकड़े हम बात करते समय बताते हैं।",
      },
      {
        q: "क्या आप हमारे शहर आते हैं?",
        a: "हम वडोदरा, गुजरात में हैं और दूसरे शहरों के schools में भी जाते हैं। नीचे form में अपना शहर लिखिए, हम आपके साथ तारीख़ें तय करेंगे।",
      },
    ],
  },
  form: {
    title: "मुफ़्त pilot बुक करें",
    sub: "अपने school के बारे में बताइए, हम आपको call या WhatsApp करेंगे।",
    school: "School का नाम",
    city: "शहर",
    contact: "आपका नाम",
    role: "आपकी भूमिका",
    roles: {
      principal: "Principal",
      director: "Director / Trustee",
      vice_principal: "Vice principal",
      coordinator: "Coordinator",
      teacher: "Teacher",
      other: "अन्य",
    },
    phone: "फ़ोन (WhatsApp)",
    phoneHint: "10 अंकों का भारतीय mobile number",
    email: "Email",
    students: "Students की संख्या",
    month: "कौन-सा महीना ठीक रहेगा",
    monthAny: "अभी तय नहीं",
    message: "संदेश",
    messageHint: "कौन-सी classes, कोई सवाल, या कुछ और",
    choose: "चुनिए…",
    optional: "ज़रूरी नहीं",
    submit: "मेरा मुफ़्त pilot बुक करें",
    sending: "भेज रहे हैं…",
    privacy: "ये जानकारी सिर्फ़ pilot के बारे में आपसे संपर्क करने के लिए है।",
    errors: {
      phone: "कृपया 10 अंकों का सही भारतीय mobile number लिखिए।",
      generic: "कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें, या हमें WhatsApp करें।",
      check: "कृपया सारी ज़रूरी जानकारी भरिए।",
    },
    thanks: {
      title: "धन्यवाद!",
      text: "आपकी request हमें मिल गई है। हम जल्द संपर्क करेंगे। जल्दी जवाब के लिए हमें WhatsApp करें।",
      whatsapp: "WhatsApp पर संदेश भेजें",
      whatsappText: (school) =>
        `नमस्ते, मैं ${school} से हूँ, Sharp Brain for Schools के बारे में जानना चाहता/चाहती हूँ। मैंने अभी आपकी website पर मुफ़्त pilot बुक किया है।`,
    },
  },
};

export const SCHOOLS_COPY: Record<SchoolsLang, SchoolsCopy> = { en, hi };

/** /schools in the visitor's language (Hindi at ?lang=hi), with an optional #hash. */
export const schoolsHref = (lang: SchoolsLang, hash = ""): string =>
  lang === "hi" ? `${SCHOOLS_PATH}?lang=hi${hash}` : `${SCHOOLS_PATH}${hash}`;

/** The consent form PDFs (public/schools/), generated by scripts/schools/consent-pdf.ts. */
export const CONSENT_PDF: Record<SchoolsLang, string> = {
  en: "/schools/parent-consent-en.pdf",
  hi: "/schools/parent-consent-hi.pdf",
};
