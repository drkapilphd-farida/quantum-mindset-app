// Brain Unlock passages — server-side only: the answer key lives here and
// must never reach the browser (only ./actions.ts and the page's server
// component import this file; the page strips correctIndex before sending).
//
// Per role and language: 3 Brain Check passages (~40 words, 1 question) and 3
// different RSVP passages for the Speed unlock (at most 80 words, 2 questions)
// — shortened 15 Nov 2026 so the whole challenge takes about 4 minutes.
// One of each is picked per session (never the same one twice for a person
// until all are used — sets.ts), so any "after" gain comes from the
// technique, never from reading the same text twice. Positive brain facts and
// short stories; every question needs the passage. Duo Mode: the parent reads
// the parent passages, the child the student ones.

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

const p = (
  role: BuRole,
  lang: "en" | "hi",
  kind: "check" | "sharp",
  n: number,
  text: string,
  questions: readonly BuQuestion[],
): BuPassage => ({
  id: `bu-${role}-${lang}-${kind}-${n}`,
  role,
  lang,
  kind,
  text,
  questions,
});

export const BU_PASSAGES: readonly BuPassage[] = [
  // ── Parent · English ──────────────────────────────────────────────────
  p(
    "parent",
    "en",
    "check",
    1,
    "Every evening, Kabir read his science chapter three times, yet by morning most of it was gone. His teacher gave him a tip: after each page, close the notebook and explain it aloud to someone at home. Kabir chose his grandmother as his listener.",
    [
      q(
        "Whom did Kabir choose as his listener?",
        ["His grandmother", "His teacher", "His elder sister"],
        0,
      ),
    ],
  ),
  p(
    "parent",
    "en",
    "check",
    2,
    "On Sundays, Meena read out ten grocery items once, and her daughter Tara had to remember them all the way to the shop. At first she forgot half. Then she pictured each item doing something silly, like a pumpkin wearing sunglasses. Soon she remembered them all.",
    [
      q(
        "What helped Tara remember the items?",
        [
          "Picturing each item doing something silly",
          "Writing the list on her hand",
          "Reading the list five times",
        ],
        0,
      ),
    ],
  ),
  p(
    "parent",
    "en",
    "check",
    3,
    "Rohan’s father noticed that Rohan studied best right after a short game of football. So the family made a new rule: fifteen minutes of play in the park, then forty minutes of homework. Rohan sat down calmer, and his marks in the next test went up.",
    [
      q(
        "What did the family do before homework?",
        [
          "A short nap",
          "Fifteen minutes of play in the park",
          "Watching a cartoon",
        ],
        1,
      ),
    ],
  ),
  p(
    "parent",
    "en",
    "sharp",
    1,
    "Your child’s brain is the hungriest part of the body. It weighs about one and a half kilograms, yet uses around one fifth of all our energy. Deep inside sits a small part called the hippocampus. It works like a librarian, deciding which of the day’s lessons are stored for the long term. Much of this sorting happens during sleep. That is why a good night’s sleep before an exam often helps more than an extra hour of late-night reading.",
    [
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
  ),
  p(
    "parent",
    "en",
    "sharp",
    2,
    "Praise can make a child braver or more fearful. In a famous study, children praised for being clever chose easy puzzles next time, because they did not want to lose that label. Children praised for their effort chose harder puzzles and enjoyed them more. So instead of saying “you are so smart”, try “you worked really hard on this”. Children then learn that the brain grows stronger when it is challenged.",
    [
      q(
        "Which children chose harder puzzles?",
        [
          "Children praised for being clever",
          "Children who were not praised",
          "Children praised for their effort",
        ],
        2,
      ),
      q(
        "What does the passage suggest saying to a child?",
        [
          "You worked really hard on this",
          "You are so smart",
          "You must win next time",
        ],
        0,
      ),
    ],
  ),
  p(
    "parent",
    "en",
    "sharp",
    3,
    "Screens are not the enemy, but timing matters. Bright light from a phone in the evening tells the brain it is still daytime, so the sleep hormone, melatonin, arrives late. A child who scrolls until eleven may lie awake until midnight. Many families now follow a gentle rule: all screens go into a charging basket one hour before bed. In that hour, children read a paper book or talk about their day.",
    [
      q(
        "What does bright evening light do, according to the passage?",
        [
          "Helps children fall asleep faster",
          "Makes the sleep hormone arrive late",
          "Improves eyesight",
        ],
        1,
      ),
      q(
        "Where do the screens go one hour before bed?",
        [
          "Into a charging basket",
          "Into the parents’ cupboard",
          "Into the school bag",
        ],
        0,
      ),
    ],
  ),

  // ── Parent · Hindi ────────────────────────────────────────────────────
  p(
    "parent",
    "hi",
    "check",
    1,
    "हर शाम कबीर विज्ञान का अध्याय तीन बार पढ़ता, फिर भी सुबह तक ज़्यादातर भूल जाता। उसकी टीचर ने एक तरीका बताया: हर पन्ने के बाद कॉपी बंद करो और घर में किसी को ज़ोर से समझाओ। कबीर ने सुनने के लिए अपनी दादी को चुना।",
    [
      q(
        "कबीर ने सुनने के लिए किसे चुना?",
        ["अपनी दादी को", "अपनी टीचर को", "अपनी बड़ी बहन को"],
        0,
      ),
    ],
  ),
  p(
    "parent",
    "hi",
    "check",
    2,
    "रविवार को मीना एक बार दस चीज़ें सुनाती, और बेटी तारा को दुकान तक सब याद रखनी होतीं। पहले वह आधी भूल जाती थी। फिर वह हर चीज़ को कुछ मज़ेदार करते हुए सोचने लगी, जैसे धूप का चश्मा पहने कद्दू। जल्द ही उसे पूरी लिस्ट याद रहने लगी।",
    [
      q(
        "तारा को चीज़ें याद रखने में किस बात से मदद मिली?",
        [
          "हर चीज़ को कुछ मज़ेदार करते हुए सोचने से",
          "हाथ पर लिस्ट लिखने से",
          "लिस्ट पाँच बार पढ़ने से",
        ],
        0,
      ),
    ],
  ),
  p(
    "parent",
    "hi",
    "check",
    3,
    "रोहन के पापा ने देखा कि रोहन फ़ुटबॉल के छोटे खेल के ठीक बाद सबसे अच्छा पढ़ता है। तो परिवार ने नियम बनाया: पहले पार्क में पंद्रह मिनट खेल, फिर चालीस मिनट होमवर्क। रोहन शांत होकर बैठने लगा, और अगले टेस्ट में उसके नंबर बढ़ गए।",
    [
      q(
        "होमवर्क से पहले परिवार क्या करता था?",
        ["थोड़ी देर सोना", "पार्क में पंद्रह मिनट खेल", "कार्टून देखना"],
        1,
      ),
    ],
  ),
  p(
    "parent",
    "hi",
    "sharp",
    1,
    "आपके बच्चे का दिमाग़ शरीर का सबसे भूखा हिस्सा है। इसका वज़न लगभग डेढ़ किलो है, पर यह हमारी कुल ऊर्जा का करीब पाँचवाँ हिस्सा इस्तेमाल करता है। इसके अंदर एक छोटा हिस्सा है: हिप्पोकैम्पस। यह एक लाइब्रेरियन की तरह तय करता है कि दिन के कौन-से सबक लंबे समय तक रखे जाएँ। यह छँटाई नींद में होती है। इसीलिए exam से पहले अच्छी नींद देर रात की एक घंटे की extra पढ़ाई से ज़्यादा मदद करती है।",
    [
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
  ),
  p(
    "parent",
    "hi",
    "sharp",
    2,
    "तारीफ़ बच्चे को बहादुर भी बना सकती है और डरपोक भी। एक मशहूर रिसर्च में जिन बच्चों की तारीफ़ होशियार होने के लिए हुई, उन्होंने अगली बार आसान पहेलियाँ चुनीं। जिनकी तारीफ़ मेहनत के लिए हुई, उन्होंने कठिन पहेलियाँ चुनीं और ज़्यादा मज़ा लिया। इसलिए “तुम बहुत होशियार हो” की जगह कहिए “तुमने इस पर बहुत मेहनत की”। तब बच्चा सीखता है कि चुनौती से दिमाग़ मज़बूत होता है।",
    [
      q(
        "किन बच्चों ने कठिन पहेलियाँ चुनीं?",
        [
          "जिनकी तारीफ़ होशियार होने के लिए हुई",
          "जिनकी तारीफ़ नहीं हुई",
          "जिनकी तारीफ़ मेहनत के लिए हुई",
        ],
        2,
      ),
      q(
        "passage बच्चे से क्या कहने की सलाह देता है?",
        ["तुमने इस पर बहुत मेहनत की", "तुम बहुत होशियार हो", "अगली बार जीतना ही है"],
        0,
      ),
    ],
  ),
  p(
    "parent",
    "hi",
    "sharp",
    3,
    "स्क्रीन दुश्मन नहीं है, पर समय मायने रखता है। शाम को फ़ोन की तेज़ रोशनी दिमाग़ को बताती है कि अभी दिन है, इसलिए नींद का हार्मोन, मेलाटोनिन, देर से आता है। जो बच्चा ग्यारह बजे तक स्क्रॉल करता है, वह आधी रात तक जागता रह सकता है। कई परिवार अब एक हल्का नियम मानते हैं: सोने से एक घंटा पहले सारी स्क्रीन चार्जिंग टोकरी में। उस घंटे बच्चे किताब पढ़ते हैं या दिन की बातें करते हैं।",
    [
      q(
        "passage के अनुसार शाम की तेज़ रोशनी क्या करती है?",
        [
          "बच्चों को जल्दी सुलाती है",
          "नींद का हार्मोन देर से लाती है",
          "आँखों की रोशनी बढ़ाती है",
        ],
        1,
      ),
      q(
        "सोने से एक घंटा पहले स्क्रीन कहाँ जाती हैं?",
        ["चार्जिंग टोकरी में", "माता-पिता की अलमारी में", "स्कूल बैग में"],
        0,
      ),
    ],
  ),

  // ── Student · English ─────────────────────────────────────────────────
  p(
    "student",
    "en",
    "check",
    1,
    "Riya wanted to finish her history chapter, but notifications kept popping up. So she put her device in another room and set a timer for 25 minutes. To her surprise, she finished eleven pages in one sitting, more than she usually read in an hour.",
    [
      q(
        "Where did Riya put her device?",
        ["In another room", "In her school bag", "Under her pillow"],
        0,
      ),
    ],
  ),
  p(
    "student",
    "en",
    "check",
    2,
    "Aman highlighted almost every line of his textbook, so nothing stood out. His cousin showed him a better way: read a paragraph, close the book, and write one question about it in the margin. Before the test, Aman answered his own questions and remembered far more.",
    [
      q(
        "What did Aman write in the margin?",
        [
          "A short summary of the chapter",
          "One question about each paragraph",
          "The page number",
        ],
        1,
      ),
    ],
  ),
  p(
    "student",
    "en",
    "check",
    3,
    "Neha was nervous about speaking in front of the science fair judges. Her coach gave her one tip: practise the talk out loud while walking, three times a day. On the day, the words came easily, and her project on saving rainwater won second prize.",
    [
      q(
        "What was Neha’s project about?",
        ["Solar power", "Plant growth", "Saving rainwater"],
        2,
      ),
    ],
  ),
  p(
    "student",
    "en",
    "sharp",
    1,
    "When you read, your eyes do not glide smoothly along a line. They jump. Each jump is called a saccade, and between jumps your eyes pause to take in a few words. Slow readers stop on every word and keep going back. When words come to your eyes one at a time, there is no jumping and no going back, so your mind stays on the meaning. Athletes train the same way: a little faster than comfortable, every day.",
    [
      q(
        "What is each jump of the eyes called?",
        ["A saccade", "A blink", "A focus point"],
        0,
      ),
      q(
        "How do athletes train, according to the passage?",
        [
          "Only before a big match",
          "A little faster than comfortable, every day",
          "As slowly as possible",
        ],
        1,
      ),
    ],
  ),
  p(
    "student",
    "en",
    "sharp",
    2,
    "Your memory loves to be tested. Scientists call this the testing effect. In one experiment, one group of students read a passage four times. Another group read it once and then tried to write down everything they could remember. A week later, the second group remembered far more, even with less reading time. So next time you revise, close the book and quiz yourself. Struggling to remember is how memories grow stronger.",
    [
      q(
        "What did the second group do after reading once?",
        [
          "Read it three more times",
          "Watched a video about it",
          "Tried to write down what they remembered",
        ],
        2,
      ),
      q(
        "What does the passage say about struggling to remember?",
        [
          "It is how memories grow stronger",
          "It is a sign of failure",
          "It wastes time",
        ],
        0,
      ),
    ],
  ),
  p(
    "student",
    "en",
    "sharp",
    3,
    "The human brain has about eighty-six billion nerve cells, called neurons. Every time you learn something new, some neurons connect a little more strongly. Practise the same skill again and again, and the connection becomes like a well-used road through a forest: easy and quick to travel. That is why a hard maths method feels slow on day one but natural after two weeks, and why short daily practice beats one long session.",
    [
      q(
        "What are the brain’s nerve cells called?",
        ["Neurons", "Atoms", "Vitamins"],
        0,
      ),
      q(
        "What does a practised connection become like?",
        [
          "A locked door",
          "A well-used road through a forest",
          "A busy railway station",
        ],
        1,
      ),
    ],
  ),

  // ── Student · Hindi ───────────────────────────────────────────────────
  p(
    "student",
    "hi",
    "check",
    1,
    "रिया इतिहास का अध्याय पूरा करना चाहती थी, पर notifications बार-बार आ रहे थे। तो उसने अपना डिवाइस दूसरे कमरे में रखा और 25 मिनट का टाइमर लगाया। हैरानी की बात, उसने एक ही बार में ग्यारह पन्ने पढ़ लिए, जितने वह आमतौर पर एक घंटे में पढ़ती थी।",
    [
      q(
        "रिया ने अपना डिवाइस कहाँ रखा?",
        ["दूसरे कमरे में", "स्कूल बैग में", "तकिये के नीचे"],
        0,
      ),
    ],
  ),
  p(
    "student",
    "hi",
    "check",
    2,
    "अमन किताब की लगभग हर लाइन हाइलाइट करता था, तो कुछ भी अलग नहीं दिखता था। कज़िन ने बेहतर तरीका बताया: एक पैराग्राफ़ पढ़ो, किताब बंद करो, और हाशिये में उसके बारे में एक सवाल लिखो। टेस्ट से पहले अमन ने अपने सवालों के जवाब दिए, और उसे ज़्यादा याद रहा।",
    [
      q(
        "अमन ने हाशिये में क्या लिखा?",
        ["अध्याय का छोटा सार", "हर पैराग्राफ़ के बारे में एक सवाल", "पन्ने का नंबर"],
        1,
      ),
    ],
  ),
  p(
    "student",
    "hi",
    "check",
    3,
    "नेहा साइंस फ़ेयर के जजों के सामने बोलने से घबरा रही थी। उसके कोच ने एक टिप दी: दिन में तीन बार, टहलते हुए अपनी बात ज़ोर से बोलकर अभ्यास करो। फ़ेयर के दिन शब्द आसानी से निकले, और बारिश का पानी बचाने पर उसके प्रोजेक्ट को दूसरा इनाम मिला।",
    [
      q(
        "नेहा का प्रोजेक्ट किस बारे में था?",
        ["सौर ऊर्जा", "पौधों का बढ़ना", "बारिश का पानी बचाना"],
        2,
      ),
    ],
  ),
  p(
    "student",
    "hi",
    "sharp",
    1,
    "जब आप पढ़ते हैं, तो आपकी आँखें लाइन पर आराम से फिसलती नहीं, कूदती हैं। हर छलांग को सकेड (saccade) कहते हैं, और छलांगों के बीच आँखें पल भर रुककर कुछ शब्द पकड़ती हैं। धीमे पढ़ने वाले हर शब्द पर रुकते हैं और बार-बार लौटते हैं। जब शब्द एक-एक करके आँखों तक आते हैं, तो न कूदना पड़ता है न लौटना, और दिमाग़ मतलब पर टिका रहता है। खिलाड़ी भी ऐसे ही अभ्यास करते हैं: रोज़, आराम से थोड़ा तेज़।",
    [
      q(
        "आँखों की हर छलांग को क्या कहते हैं?",
        ["सकेड (saccade)", "पलक झपकना", "फ़ोकस पॉइंट"],
        0,
      ),
      q(
        "passage के अनुसार खिलाड़ी कैसे अभ्यास करते हैं?",
        ["सिर्फ़ बड़े मैच से पहले", "रोज़, आराम से थोड़ा तेज़", "जितना हो सके धीरे"],
        1,
      ),
    ],
  ),
  p(
    "student",
    "hi",
    "sharp",
    2,
    "आपकी याददाश्त को परखा जाना पसंद है। वैज्ञानिक इसे testing effect कहते हैं। एक प्रयोग में एक समूह ने पाठ चार बार पढ़ा। दूसरे समूह ने एक बार पढ़ा और फिर जो याद था, सब लिखने की कोशिश की। एक हफ़्ते बाद दूसरे समूह को कहीं ज़्यादा याद था, जबकि उन्होंने कम समय पढ़ा था। तो अगली बार दोहराते समय किताब बंद करके खुद से सवाल पूछिए। याद करने की मेहनत से ही याददाश्त मज़बूत होती है।",
    [
      q(
        "दूसरे समूह ने एक बार पढ़ने के बाद क्या किया?",
        ["तीन बार और पढ़ा", "उस पर वीडियो देखा", "जो याद था, लिखने की कोशिश की"],
        2,
      ),
      q(
        "याद करने की मेहनत के बारे में passage क्या कहता है?",
        [
          "इसी से याददाश्त मज़बूत होती है",
          "यह नाकामी की निशानी है",
          "यह समय की बर्बादी है",
        ],
        0,
      ),
    ],
  ),
  p(
    "student",
    "hi",
    "sharp",
    3,
    "इंसान के दिमाग़ में लगभग छियासी अरब नर्व सेल होते हैं, जिन्हें न्यूरॉन कहते हैं। जब भी आप कुछ नया सीखते हैं, कुछ न्यूरॉन आपस में थोड़ा और मज़बूती से जुड़ जाते हैं। एक ही हुनर का बार-बार अभ्यास करें, तो यह जुड़ाव जंगल के बीच एक चलते-फिरते रास्ते जैसा बन जाता है: आसान और तेज़। इसीलिए मुश्किल तरीका पहले दिन धीमा लगता है, पर दो हफ़्ते बाद सहज।",
    [
      q("दिमाग़ के नर्व सेल को क्या कहते हैं?", ["न्यूरॉन", "परमाणु", "विटामिन"], 0),
      q(
        "अभ्यास किया हुआ जुड़ाव किसके जैसा बन जाता है?",
        ["बंद दरवाज़े जैसा", "जंगल के बीच चलते-फिरते रास्ते जैसा", "भीड़ वाले रेलवे स्टेशन जैसा"],
        1,
      ),
    ],
  ),

  // ── Professional · English ────────────────────────────────────────────
  p(
    "professional",
    "en",
    "check",
    1,
    "Vikram, a bank manager in Indore, read forty emails before lunch daily, yet recalled only a few by evening. Before opening each long email, he began asking himself one question: what do I need from this? By Friday, his inbox was done twenty minutes earlier.",
    [
      q(
        "What question did Vikram ask himself before each long email?",
        ["Who sent this?", "What do I need from this?", "Can I delete this?"],
        1,
      ),
    ],
  ),
  p(
    "professional",
    "en",
    "check",
    2,
    "Sunita, a team lead in Pune, began each day checking messages and by eleven had done no real work. So for the first ninety minutes, she worked only on her most important task, with notifications off. Her team soon finished two projects early.",
    [
      q(
        "What did Sunita do for the first ninety minutes?",
        [
          "Worked only on her most important task",
          "Checked all her messages",
          "Held team meetings",
        ],
        0,
      ),
    ],
  ),
  p(
    "professional",
    "en",
    "check",
    3,
    "Arjun ran a travel agency in Jaipur and often forgot what clients said on the phone. So after every call, he spent one minute writing three lines: the client’s name, what they wanted and the next step. His repeat bookings doubled within a year.",
    [
      q(
        "How long did Arjun spend writing after each call?",
        ["Ten minutes", "Half an hour", "One minute"],
        2,
      ),
    ],
  ),
  p(
    "professional",
    "en",
    "sharp",
    1,
    "In 1885, a German scientist, Hermann Ebbinghaus, tested his own memory with long lists of made-up words. He found that we forget most new information surprisingly fast: within a day, much of it is gone. This became the famous forgetting curve. The good news came from the same experiments. Each time he reviewed a list at the right moment, the curve became flatter and the memory lasted longer. Busy professionals use this today.",
    [
      q(
        "What did Ebbinghaus use to test his memory?",
        ["Lists of made-up words", "Pictures of faces", "Telephone numbers"],
        0,
      ),
      q(
        "What made the forgetting curve flatter?",
        [
          "Drinking more water",
          "Reviewing at the right moment",
          "Reading faster",
        ],
        1,
      ),
    ],
  ),
  p(
    "professional",
    "en",
    "sharp",
    2,
    "Multitasking feels efficient, but the brain does not really do two thinking tasks at once. It switches between them, and every switch costs time and focus. Researchers estimate that constant switching can waste up to forty percent of a working day. The fix is called single-tasking. Choose one task, close the other tabs, and work on it for a fixed block, such as twenty-five minutes. Then take a short break.",
    [
      q(
        "How much of a working day can constant switching waste?",
        ["About five percent", "Up to forty percent", "Almost nothing"],
        1,
      ),
      q(
        "What is the fix called?",
        ["Single-tasking", "Speed reading", "Power napping"],
        0,
      ),
    ],
  ),
  p(
    "professional",
    "en",
    "sharp",
    3,
    "A short walk can be a powerful thinking tool. In a study at Stanford University, people came up with about sixty percent more creative ideas while walking than while sitting. The walk did not need to be long; even a few minutes on a treadmill helped. Many leaders hold walking meetings for this reason. Next time you are stuck on a problem, step away from the desk, walk for ten minutes and let your brain connect the dots.",
    [
      q(
        "Where was the walking study done?",
        ["Oxford University", "Stanford University", "IIT Delhi"],
        1,
      ),
      q(
        "How many more creative ideas did people have while walking?",
        ["About sixty percent more", "About ten percent more", "Twice as many"],
        0,
      ),
    ],
  ),

  // ── Professional · Hindi ──────────────────────────────────────────────
  p(
    "professional",
    "hi",
    "check",
    1,
    "इंदौर के बैंक मैनेजर विक्रम रोज़ दोपहर से पहले चालीस ईमेल पढ़ते थे, पर शाम तक कुछ ही याद रहते। उनका हल आसान था। हर लंबा ईमेल खोलने से पहले वे खुद से एक सवाल पूछते: मुझे इससे क्या चाहिए? शुक्रवार तक उनका inbox बीस मिनट पहले ख़त्म होने लगा।",
    [
      q(
        "हर लंबे ईमेल से पहले विक्रम खुद से क्या पूछते थे?",
        ["यह किसने भेजा?", "मुझे इससे क्या चाहिए?", "क्या मैं इसे डिलीट कर दूँ?"],
        1,
      ),
    ],
  ),
  p(
    "professional",
    "hi",
    "check",
    2,
    "पुणे में टीम लीड सुनीता दिन की शुरुआत मैसेज देखकर करती थीं, और ग्यारह बजे तक असली काम कुछ नहीं होता था। फिर पहले नब्बे मिनट वे notifications बंद करके सिर्फ़ अपने सबसे ज़रूरी काम पर लगने लगीं। जल्द ही उनकी टीम ने दो प्रोजेक्ट समय से पहले पूरे किए।",
    [
      q(
        "सुनीता पहले नब्बे मिनट क्या करती थीं?",
        [
          "सिर्फ़ अपने सबसे ज़रूरी काम पर लगती थीं",
          "सारे मैसेज देखती थीं",
          "टीम मीटिंग करती थीं",
        ],
        0,
      ),
    ],
  ),
  p(
    "professional",
    "hi",
    "check",
    3,
    "जयपुर में अर्जुन की ट्रैवल एजेंसी थी, और वे भूल जाते थे कि क्लाइंट ने फ़ोन पर क्या कहा। तो हर कॉल के बाद वे एक मिनट में तीन लाइन लिखते: क्लाइंट का नाम, उन्हें क्या चाहिए, और अगला कदम। एक साल में उनकी दोबारा बुकिंग दोगुनी हो गई।",
    [
      q(
        "हर कॉल के बाद अर्जुन कितनी देर लिखते थे?",
        ["दस मिनट", "आधा घंटा", "एक मिनट"],
        2,
      ),
    ],
  ),
  p(
    "professional",
    "hi",
    "sharp",
    1,
    "सन 1885 में जर्मन वैज्ञानिक हरमन एबिंगहाउस ने बनावटी शब्दों की लंबी लिस्ट से अपनी याददाश्त परखी। उन्होंने पाया कि हम नई जानकारी हैरानी भरी तेज़ी से भूलते हैं: एक दिन में उसका बड़ा हिस्सा चला जाता है। इसी से मशहूर forgetting curve मिला। अच्छी ख़बर भी इन्हीं प्रयोगों से आई। जब भी उन्होंने सही समय पर लिस्ट दोहराई, curve चपटा होता गया और याद ज़्यादा देर टिकी।",
    [
      q(
        "एबिंगहाउस ने अपनी याददाश्त किससे परखी?",
        ["बनावटी शब्दों की लिस्ट से", "चेहरों की तस्वीरों से", "टेलीफ़ोन नंबरों से"],
        0,
      ),
      q(
        "forgetting curve किससे चपटा हुआ?",
        ["ज़्यादा पानी पीने से", "सही समय पर दोहराने से", "तेज़ पढ़ने से"],
        1,
      ),
    ],
  ),
  p(
    "professional",
    "hi",
    "sharp",
    2,
    "एक साथ कई काम करना कुशल लगता है, पर दिमाग़ सोचने वाले दो काम एक साथ नहीं करता। वह उनके बीच अदला-बदली करता है, और हर बदलाव में समय और ध्यान खर्च होता है। रिसर्च के अनुमान से लगातार अदला-बदली काम के दिन का चालीस प्रतिशत तक बर्बाद कर सकती है। इसका इलाज है single-tasking। एक काम चुनिए, बाकी टैब बंद कीजिए, और पच्चीस मिनट उसी पर काम कीजिए।",
    [
      q(
        "लगातार अदला-बदली काम के दिन का कितना हिस्सा बर्बाद कर सकती है?",
        ["लगभग पाँच प्रतिशत", "चालीस प्रतिशत तक", "लगभग कुछ नहीं"],
        1,
      ),
      q(
        "इसके इलाज को क्या कहते हैं?",
        ["single-tasking", "speed reading", "power napping"],
        0,
      ),
    ],
  ),
  p(
    "professional",
    "hi",
    "sharp",
    3,
    "थोड़ी देर टहलना सोचने का एक दमदार तरीका है। स्टैनफ़र्ड यूनिवर्सिटी की एक रिसर्च में लोगों को बैठने के मुकाबले टहलते हुए लगभग साठ प्रतिशत ज़्यादा नए आइडिया आए। टहलना लंबा होना ज़रूरी नहीं था; ट्रेडमिल पर कुछ मिनट भी काम आए। इसी वजह से कई लीडर टहलते हुए मीटिंग करते हैं। अगली बार किसी समस्या पर अटकें, तो दस मिनट टहलिए और दिमाग़ को बिंदु जोड़ने दीजिए।",
    [
      q(
        "टहलने वाली रिसर्च कहाँ हुई?",
        ["ऑक्सफ़र्ड यूनिवर्सिटी में", "स्टैनफ़र्ड यूनिवर्सिटी में", "IIT दिल्ली में"],
        1,
      ),
      q(
        "टहलते हुए लोगों को कितने ज़्यादा नए आइडिया आए?",
        ["लगभग साठ प्रतिशत ज़्यादा", "लगभग दस प्रतिशत ज़्यादा", "दोगुने"],
        0,
      ),
    ],
  ),
];

export function passagesFor(
  role: BuRole,
  lang: "en" | "hi",
  kind: "check" | "sharp",
): BuPassage[] {
  return BU_PASSAGES.filter(
    (x) => x.role === role && x.lang === lang && x.kind === kind,
  );
}

/** The first passage of a kind (a safe default when no choice was made). */
export function findPassage(
  role: BuRole,
  lang: "en" | "hi",
  kind: "check" | "sharp",
): BuPassage {
  const found = passagesFor(role, lang, kind)[0];
  if (found === undefined)
    throw new Error(`Brain Unlock: no ${kind} passage for ${role}/${lang}`);
  return found;
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

export function toPublic(x: BuPassage): PublicPassage {
  return {
    id: x.id,
    text: x.text,
    wordCount: countWords(x.text),
    questions: x.questions.map(({ question, options }) => ({
      question,
      options,
    })),
  };
}

/** Number of correct answers (unanswered = -1 = wrong). */
export function countCorrect(x: BuPassage, answers: readonly number[]): number {
  return x.questions.reduce(
    (n, question, i) => n + (answers[i] === question.correctIndex ? 1 : 0),
    0,
  );
}
