// Brain Unlock passages — server-side only: the answer key lives here and
// must never reach the browser (only ./actions.ts and the page's server
// component import this file; the page strips correctIndex before sending).
//
// Per role and language: a ~60-word Brain Check passage (1 question) and a
// DIFFERENT ~120-word Sharp Reading passage (2 questions), so any "after"
// gain comes from the technique, never from reading the same text twice.
// Positive brain facts and short stories; every question needs the passage.
// Duo Mode: the parent reads the parent passages, the child the student ones.

export type BuRole = "parent" | "student" | "professional";
export type BuQuestion = {
  question: string;
  options: readonly string[];
  correctIndex: number;
};
export type BuPassage = {
  id: string;
  role: BuRole;
  lang: "en" | "hi";
  kind: "check" | "sharp";
  text: string;
  questions: readonly BuQuestion[];
};

const q = (
  question: string,
  options: readonly string[],
  correctIndex: number,
): BuQuestion => ({ question, options, correctIndex });

export const BU_PASSAGES: readonly BuPassage[] = [
  // ── Parent ────────────────────────────────────────────────────────────
  {
    id: "bu-parent-en-check",
    role: "parent",
    lang: "en",
    kind: "check",
    text: "Every evening at seven, Anu sat with her son Kabir for homework. Kabir read his science chapter three times, yet by morning most of it was gone. One day his teacher, Mrs. Dsouza, gave him a small tip: after each page, close the notebook and explain it aloud to someone at home. Kabir chose his grandmother as his listener.",
    questions: [
      q(
        "Whom did Kabir choose as his listener?",
        ["His grandmother", "His teacher", "His elder sister"],
        0,
      ),
    ],
  },
  {
    id: "bu-parent-en-sharp",
    role: "parent",
    lang: "en",
    kind: "sharp",
    text: "Your brain is the hungriest part of your body. It weighs only about one and a half kilograms, yet it uses around one fifth of all the energy you eat. Deep inside sits a small, curved part called the hippocampus. It works like a librarian: it decides which of the day’s lessons are stored for the long term. Much of this sorting happens while a child sleeps. That is why a good night’s sleep before an exam often helps more than one extra hour of late-night reading. Children who revise a lesson in short bursts, spread over a few days, usually remember far more than children who read it again and again in one long sitting.",
    questions: [
      q(
        "What does the passage compare the hippocampus to?",
        ["A computer", "A librarian", "A teacher"],
        1,
      ),
      q(
        "What often helps more than an extra hour of late-night reading?",
        [
          "A good night’s sleep",
          "A big breakfast",
          "Reading the chapter twice",
        ],
        0,
      ),
    ],
  },
  {
    id: "bu-parent-hi-check",
    role: "parent",
    lang: "hi",
    kind: "check",
    text: "हर शाम सात बजे अनु अपने बेटे कबीर के साथ होमवर्क करने बैठती थी। कबीर विज्ञान का अध्याय तीन बार पढ़ता, फिर भी सुबह तक ज़्यादातर भूल जाता। एक दिन उसकी टीचर, मिसेज़ डिसूज़ा, ने एक छोटा-सा तरीका बताया: हर पन्ने के बाद कॉपी बंद करो और घर में किसी को ज़ोर से समझाओ। कबीर ने सुनने के लिए अपनी दादी को चुना।",
    questions: [
      q(
        "कबीर ने सुनने के लिए किसे चुना?",
        ["अपनी दादी को", "अपनी टीचर को", "अपनी बड़ी बहन को"],
        0,
      ),
    ],
  },
  {
    id: "bu-parent-hi-sharp",
    role: "parent",
    lang: "hi",
    kind: "sharp",
    text: "आपका दिमाग़ शरीर का सबसे भूखा हिस्सा है। इसका वज़न सिर्फ़ लगभग डेढ़ किलो होता है, फिर भी यह आपके खाने की कुल ऊर्जा का करीब पाँचवाँ हिस्सा इस्तेमाल करता है। इसके अंदर गहराई में एक छोटा, मुड़ा हुआ हिस्सा है जिसे हिप्पोकैम्पस कहते हैं। यह एक लाइब्रेरियन की तरह काम करता है: यह तय करता है कि दिन के कौन-से सबक लंबे समय के लिए रखे जाएँ। यह छँटाई ज़्यादातर तब होती है जब बच्चा सोता है। इसीलिए exam से पहले अच्छी नींद अक्सर देर रात की एक घंटे की extra पढ़ाई से ज़्यादा मदद करती है। जो बच्चे एक पाठ को कुछ दिनों में छोटे-छोटे हिस्सों में दोहराते हैं, वे आमतौर पर एक ही बार में बार-बार पढ़ने वालों से कहीं ज़्यादा याद रखते हैं।",
    questions: [
      q(
        "इस passage में हिप्पोकैम्पस की तुलना किससे की गई है?",
        ["कंप्यूटर से", "लाइब्रेरियन से", "टीचर से"],
        1,
      ),
      q(
        "देर रात की एक घंटे की extra पढ़ाई से ज़्यादा क्या मदद करता है?",
        ["अच्छी नींद", "भरपेट नाश्ता", "अध्याय दो बार पढ़ना"],
        0,
      ),
    ],
  },

  // ── Student ───────────────────────────────────────────────────────────
  {
    id: "bu-student-en-check",
    role: "student",
    lang: "en",
    kind: "check",
    text: "Riya wanted to finish her history chapter before dinner, but notifications kept popping up. She tried something new. She put her device in another room, set a timer for 25 minutes and promised herself a short walk when it rang. To her surprise, she finished eleven pages in that one sitting, more than she usually read in an hour.",
    questions: [
      q(
        "How long was Riya’s timer set for?",
        ["15 minutes", "25 minutes", "45 minutes"],
        1,
      ),
    ],
  },
  {
    id: "bu-student-en-sharp",
    role: "student",
    lang: "en",
    kind: "sharp",
    text: "When you read, your eyes do not glide smoothly along a line. They jump. Each jump is called a saccade, and between the jumps your eyes stop for a fraction of a second to take in a few words at once. Slow readers often stop on every single word, and many of them also go back to read words they have already seen. A moving guide, like a finger or a soft light under the line, helps the eyes make longer, steadier jumps. Many readers find that they understand more, not less, because the mind has less time to wander. Athletes train their muscles in the same way: a little faster than comfortable, every day, until the new pace starts to feel normal.",
    questions: [
      q(
        "What is a saccade?",
        [
          "A pause between two chapters",
          "A type of reading glasses",
          "A jump of the eyes while reading",
        ],
        2,
      ),
      q(
        "Why do many readers understand more with a moving guide?",
        [
          "The words look bigger",
          "The mind has less time to wander",
          "They read every word twice",
        ],
        1,
      ),
    ],
  },
  {
    id: "bu-student-hi-check",
    role: "student",
    lang: "hi",
    kind: "check",
    text: "रिया खाने से पहले इतिहास का अध्याय पूरा करना चाहती थी, लेकिन notifications बार-बार आ रहे थे। उसने कुछ नया किया। उसने अपना डिवाइस दूसरे कमरे में रख दिया, 25 मिनट का टाइमर लगाया और खुद से वादा किया कि टाइमर बजने पर थोड़ी देर टहलेगी। उसे हैरानी हुई कि उसने एक ही बार में ग्यारह पन्ने पढ़ लिए, जितने वह आमतौर पर एक घंटे में पढ़ती थी उससे भी ज़्यादा।",
    questions: [
      q(
        "रिया ने टाइमर कितने मिनट का लगाया?",
        ["15 मिनट", "25 मिनट", "45 मिनट"],
        1,
      ),
    ],
  },
  {
    id: "bu-student-hi-sharp",
    role: "student",
    lang: "hi",
    kind: "sharp",
    text: "जब आप पढ़ते हैं, तो आपकी आँखें लाइन पर आराम से फिसलती नहीं हैं। वे कूदती हैं। हर छलांग को सकेड (saccade) कहते हैं, और दो छलांगों के बीच आँखें पल भर के लिए रुककर एक साथ कुछ शब्द पकड़ती हैं। धीमे पढ़ने वाले अक्सर हर एक शब्द पर रुकते हैं, और उनमें से कई पढ़े हुए शब्दों पर वापस भी जाते हैं। एक चलता हुआ guide, जैसे उँगली या लाइन के नीचे हल्की रोशनी, आँखों को लंबी और स्थिर छलांग लगाने में मदद करता है। कई पढ़ने वालों को लगता है कि वे कम नहीं, बल्कि ज़्यादा समझते हैं, क्योंकि दिमाग़ को भटकने का समय कम मिलता है। खिलाड़ी भी अपनी मांसपेशियों को ऐसे ही तैयार करते हैं: रोज़ आराम से थोड़ा तेज़, जब तक नई रफ़्तार सामान्य न लगने लगे।",
    questions: [
      q(
        "सकेड (saccade) क्या है?",
        [
          "दो अध्यायों के बीच का ब्रेक",
          "पढ़ने का एक तरह का चश्मा",
          "पढ़ते समय आँखों की छलांग",
        ],
        2,
      ),
      q(
        "चलते हुए guide से कई लोग ज़्यादा क्यों समझते हैं?",
        [
          "शब्द बड़े दिखते हैं",
          "दिमाग़ को भटकने का समय कम मिलता है",
          "वे हर शब्द दो बार पढ़ते हैं",
        ],
        1,
      ),
    ],
  },

  // ── Professional ──────────────────────────────────────────────────────
  {
    id: "bu-professional-en-check",
    role: "professional",
    lang: "en",
    kind: "check",
    text: "Vikram, a manager at a bank in Indore, read at least forty emails before lunch every day. By evening he could recall only a few of them. His solution was simple. Before opening each long email, he asked himself one question: what do I need from this? By Friday, he noticed that he was finishing his inbox twenty minutes earlier.",
    questions: [
      q(
        "Where did Vikram work?",
        [
          "At a bank in Indore",
          "At a school in Bhopal",
          "At a hospital in Pune",
        ],
        0,
      ),
    ],
  },
  {
    id: "bu-professional-en-sharp",
    role: "professional",
    lang: "en",
    kind: "sharp",
    text: "In 1885, a German scientist named Hermann Ebbinghaus tested his own memory with long lists of made-up words. He found that we forget most new information surprisingly fast: within a day, much of it is gone unless we do something with it. His work gave us the famous forgetting curve. The good news came from the same experiments. Each time he reviewed a list at the right moment, the curve became flatter, and the memory lasted longer. Today, busy professionals use the same idea. They read a report with a clear question in mind, write three key points in their own words, and look at those points again the next morning. It takes only a few minutes, but it saves hours of reading the same pages twice.",
    questions: [
      q(
        "How did Ebbinghaus test his memory?",
        [
          "With photographs of faces",
          "With lists of made-up words",
          "With long novels",
        ],
        1,
      ),
      q(
        "What do the professionals in the passage do the next morning?",
        [
          "Read the whole report again",
          "Write a new report",
          "Look at their three key points again",
        ],
        2,
      ),
    ],
  },
  {
    id: "bu-professional-hi-check",
    role: "professional",
    lang: "hi",
    kind: "check",
    text: "इंदौर के एक बैंक में मैनेजर विक्रम रोज़ दोपहर के खाने से पहले कम से कम चालीस ईमेल पढ़ते थे। शाम तक उन्हें उनमें से कुछ ही याद रहते थे। उनका हल बहुत आसान था। हर लंबा ईमेल खोलने से पहले वे खुद से एक सवाल पूछते: मुझे इससे क्या चाहिए? शुक्रवार तक उन्होंने देखा कि उनका inbox बीस मिनट पहले ख़त्म होने लगा था।",
    questions: [
      q(
        "विक्रम कहाँ काम करते थे?",
        ["इंदौर के एक बैंक में", "भोपाल के एक स्कूल में", "पुणे के एक अस्पताल में"],
        0,
      ),
    ],
  },
  {
    id: "bu-professional-hi-sharp",
    role: "professional",
    lang: "hi",
    kind: "sharp",
    text: "सन 1885 में हरमन एबिंगहाउस नाम के एक जर्मन वैज्ञानिक ने बनावटी शब्दों की लंबी लिस्ट से अपनी ही याददाश्त को परखा। उन्होंने पाया कि हम नई जानकारी को हैरानी भरी तेज़ी से भूल जाते हैं: एक दिन के अंदर उसका बड़ा हिस्सा चला जाता है, जब तक हम उसके साथ कुछ करें नहीं। उनके काम से हमें मशहूर forgetting curve मिला। अच्छी ख़बर भी इन्हीं प्रयोगों से आई। जब भी उन्होंने सही समय पर लिस्ट को दोहराया, curve चपटा होता गया और याद ज़्यादा देर टिकी। आज व्यस्त professionals यही तरीका अपनाते हैं। वे एक साफ़ सवाल के साथ रिपोर्ट पढ़ते हैं, अपने शब्दों में तीन मुख्य बातें लिखते हैं, और अगली सुबह उन्हें फिर से देखते हैं। इसमें कुछ ही मिनट लगते हैं, लेकिन एक ही पन्ने दो बार पढ़ने के घंटों बच जाते हैं।",
    questions: [
      q(
        "एबिंगहाउस ने अपनी याददाश्त कैसे परखी?",
        ["चेहरों की तस्वीरों से", "बनावटी शब्दों की लिस्ट से", "लंबे उपन्यासों से"],
        1,
      ),
      q(
        "passage में professionals अगली सुबह क्या करते हैं?",
        [
          "पूरी रिपोर्ट फिर से पढ़ते हैं",
          "नई रिपोर्ट लिखते हैं",
          "अपनी तीन मुख्य बातें फिर से देखते हैं",
        ],
        2,
      ),
    ],
  },
];

export function findPassage(
  role: BuRole,
  lang: "en" | "hi",
  kind: "check" | "sharp",
): BuPassage {
  const p = BU_PASSAGES.find(
    (x) => x.role === role && x.lang === lang && x.kind === kind,
  );
  if (p === undefined)
    throw new Error(`Brain Unlock: no ${kind} passage for ${role}/${lang}`);
  return p;
}

export function passageById(id: string): BuPassage | null {
  return BU_PASSAGES.find((x) => x.id === id) ?? null;
}

/** What the browser gets: the text and questions, never the answers. */
export type PublicPassage = {
  id: string;
  text: string;
  wordCount: number;
  questions: { question: string; options: readonly string[] }[];
};

export function countWords(text: string): number {
  const t = text.trim();
  return t === "" ? 0 : t.split(/\s+/u).length;
}

export function toPublic(p: BuPassage): PublicPassage {
  return {
    id: p.id,
    text: p.text,
    wordCount: countWords(p.text),
    questions: p.questions.map(({ question, options }) => ({
      question,
      options,
    })),
  };
}

/** Number of correct answers (unanswered = -1 = wrong). */
export function countCorrect(p: BuPassage, answers: readonly number[]): number {
  return p.questions.reduce(
    (n, question, i) => n + (answers[i] === question.correctIndex ? 1 : 0),
    0,
  );
}
