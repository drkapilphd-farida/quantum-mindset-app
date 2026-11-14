// Brain Unlock passages — server-side only: the answer key lives here and
// must never reach the browser (only ./actions.ts and the page's server
// component import this file; the page strips correctIndex before sending).
//
// Per role and language: 3 Brain Check passages (~60 words, 1 question) and 3
// different RSVP passages for the Speed unlock (~80–100 words, 2 questions).
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
    "Every evening at seven, Anu sat with her son Kabir for homework. Kabir read his science chapter three times, yet by morning most of it was gone. One day his teacher, Mrs. Dsouza, gave him a small tip: after each page, close the notebook and explain it aloud to someone at home. Kabir chose his grandmother as his listener.",
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
    "On Sunday mornings, Meena and her daughter Tara turned the grocery list into a game. Meena read out ten items once, and Tara had to remember them all the way to the shop. At first she forgot half of them. Then she began picturing each item doing something silly, like a pumpkin wearing sunglasses. Within a month, Tara remembered the whole list.",
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
    "Rohan’s father noticed that Rohan studied best right after a short game of football. On those days he sat down calmer and finished his maths faster. So the family made a new rule: fifteen minutes of play in the park, then forty minutes of homework, with water and a fruit on the table. Rohan’s marks in the next test went up.",
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
    "Your child’s brain is the hungriest part of the body. It weighs about one and a half kilograms, yet it uses around one fifth of all the energy we eat. Deep inside sits a small, curved part called the hippocampus. It works like a librarian, deciding which of the day’s lessons are stored for the long term. Much of this sorting happens during sleep. That is why a good night’s sleep before an exam often helps more than an extra hour of late-night reading.",
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
    "Praise can make a child braver or more fearful, depending on how we give it. In a famous study, children who were praised for being clever chose easy puzzles next time, because they did not want to lose that label. Children who were praised for their effort chose harder puzzles and enjoyed them more. The lesson for parents is simple. Instead of saying “you are so smart”, try “you worked really hard on this”. Children then learn that the brain grows stronger when it is challenged.",
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
    "Screens are not the enemy, but timing matters. Bright light from a phone in the evening tells the brain that it is still daytime, so the sleep hormone, melatonin, arrives late. A child who scrolls until eleven may lie awake until midnight and wake up tired. Many families now follow a gentle rule: all screens go into a charging basket one hour before bed. In that hour, children read a paper book, talk about their day or listen to calm music. Teachers often notice the difference within two weeks.",
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
    "हर शाम सात बजे अनु अपने बेटे कबीर के साथ होमवर्क करने बैठती थी। कबीर विज्ञान का अध्याय तीन बार पढ़ता, फिर भी सुबह तक ज़्यादातर भूल जाता। एक दिन उसकी टीचर, मिसेज़ डिसूज़ा, ने एक छोटा-सा तरीका बताया: हर पन्ने के बाद कॉपी बंद करो और घर में किसी को ज़ोर से समझाओ। कबीर ने सुनने के लिए अपनी दादी को चुना।",
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
    "रविवार की सुबह मीना और उसकी बेटी तारा राशन की लिस्ट को एक खेल बना देती थीं। मीना एक बार दस चीज़ें पढ़कर सुनाती, और तारा को दुकान तक सब याद रखनी होतीं। पहले वह आधी चीज़ें भूल जाती थी। फिर वह हर चीज़ को कुछ मज़ेदार करते हुए सोचने लगी, जैसे धूप का चश्मा पहने कद्दू। एक महीने में तारा को पूरी लिस्ट याद रहने लगी।",
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
    "रोहन के पापा ने देखा कि रोहन फ़ुटबॉल के एक छोटे खेल के ठीक बाद सबसे अच्छा पढ़ता है। उन दिनों वह ज़्यादा शांत होकर बैठता और गणित जल्दी ख़त्म कर लेता। तो परिवार ने एक नया नियम बनाया: पहले पार्क में पंद्रह मिनट खेल, फिर चालीस मिनट होमवर्क, और मेज़ पर पानी और एक फल। अगले टेस्ट में रोहन के नंबर बढ़ गए।",
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
    "आपके बच्चे का दिमाग़ शरीर का सबसे भूखा हिस्सा है। इसका वज़न लगभग डेढ़ किलो होता है, फिर भी यह हमारे खाने की कुल ऊर्जा का करीब पाँचवाँ हिस्सा इस्तेमाल करता है। इसके अंदर एक छोटा, मुड़ा हुआ हिस्सा है जिसे हिप्पोकैम्पस कहते हैं। यह एक लाइब्रेरियन की तरह तय करता है कि दिन के कौन-से सबक लंबे समय के लिए रखे जाएँ। यह छँटाई ज़्यादातर नींद में होती है। इसीलिए exam से पहले अच्छी नींद अक्सर देर रात की एक घंटे की extra पढ़ाई से ज़्यादा मदद करती है।",
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
    "तारीफ़ बच्चे को बहादुर भी बना सकती है और डरपोक भी, यह इस पर निर्भर है कि हम कैसे करते हैं। एक मशहूर रिसर्च में जिन बच्चों की तारीफ़ होशियार होने के लिए हुई, उन्होंने अगली बार आसान पहेलियाँ चुनीं, ताकि वह पहचान न खो दें। जिनकी तारीफ़ मेहनत के लिए हुई, उन्होंने कठिन पहेलियाँ चुनीं और ज़्यादा मज़ा लिया। माता-पिता के लिए सीख आसान है। “तुम बहुत होशियार हो” की जगह कहिए “तुमने इस पर बहुत मेहनत की”। तब बच्चा सीखता है कि चुनौती से दिमाग़ मज़बूत होता है।",
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
    "स्क्रीन दुश्मन नहीं है, पर समय मायने रखता है। शाम को फ़ोन की तेज़ रोशनी दिमाग़ को बताती है कि अभी दिन है, इसलिए नींद का हार्मोन, मेलाटोनिन, देर से आता है। जो बच्चा ग्यारह बजे तक स्क्रॉल करता है, वह आधी रात तक जागता रह सकता है और थका हुआ उठता है। कई परिवार अब एक हल्का नियम मानते हैं: सोने से एक घंटा पहले सारी स्क्रीन चार्जिंग टोकरी में। उस घंटे बच्चे किताब पढ़ते हैं, दिन की बातें करते हैं या शांत संगीत सुनते हैं। टीचर अक्सर दो हफ़्तों में फ़र्क देखते हैं।",
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
    "Riya wanted to finish her history chapter before dinner, but notifications kept popping up. She tried something new. She put her device in another room, set a timer for 25 minutes and promised herself a short walk when it rang. To her surprise, she finished eleven pages in that one sitting, more than she usually read in an hour.",
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
    "Aman always highlighted almost every line of his textbook in yellow. Before his exam, the pages looked bright, but nothing stood out. His cousin showed him a better way: read a paragraph, close the book, and write one question about it in the margin. The night before the test, Aman simply answered his own questions and found he remembered far more.",
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
    "Before her science fair, Neha was nervous about speaking in front of the judges. Her coach gave her one tip: practise the talk out loud while walking, three times a day, for a week. On the day of the fair, the words came easily. Neha’s project on saving rainwater won second prize, and the judges praised how clearly she explained it.",
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
    "When you read, your eyes do not glide smoothly along a line. They jump. Each jump is called a saccade, and between jumps your eyes pause for a moment to take in a few words. Slow readers often stop on every single word and keep going back to words they have already read. When words come to your eyes one at a time, there is no jumping and no going back, so your mind stays on the meaning. Athletes train the same way: a little faster than comfortable, every day.",
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
    "Your memory loves to be tested. Scientists call this the testing effect. In one experiment, two groups of students learned the same passage. One group read it four times. The other group read it once and then tried to write down everything they could remember. A week later, the second group remembered far more, even though they had spent less time with the text. So the next time you revise, close the book and quiz yourself. Struggling to remember is how memories grow stronger.",
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
    "The human brain has about eighty-six billion nerve cells, called neurons. Every time you learn something new, some of these neurons connect to each other a little more strongly. Practise the same skill again and again, and the connection becomes like a well-used road through a forest: easy and quick to travel. This is why a difficult maths method feels slow on the first day but natural after two weeks. It is also why short daily practice beats one long session at the end of the month.",
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
    "रिया खाने से पहले इतिहास का अध्याय पूरा करना चाहती थी, लेकिन notifications बार-बार आ रहे थे। उसने कुछ नया किया। उसने अपना डिवाइस दूसरे कमरे में रख दिया, 25 मिनट का टाइमर लगाया और खुद से वादा किया कि टाइमर बजने पर थोड़ी देर टहलेगी। उसे हैरानी हुई कि उसने एक ही बार में ग्यारह पन्ने पढ़ लिए, जितने वह आमतौर पर एक घंटे में पढ़ती थी उससे भी ज़्यादा।",
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
    "अमन अपनी किताब की लगभग हर लाइन को पीले रंग से हाइलाइट करता था। exam से पहले पन्ने चमकीले तो दिखते, पर कुछ भी अलग नज़र नहीं आता था। उसके कज़िन ने उसे एक बेहतर तरीका बताया: एक पैराग्राफ़ पढ़ो, किताब बंद करो, और हाशिये में उसके बारे में एक सवाल लिखो। टेस्ट से पहले की रात अमन ने बस अपने सवालों के जवाब दिए, और पाया कि उसे कहीं ज़्यादा याद था।",
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
    "साइंस फ़ेयर से पहले नेहा जजों के सामने बोलने से घबरा रही थी। उसके कोच ने उसे एक टिप दी: एक हफ़्ते तक, दिन में तीन बार, टहलते हुए अपनी बात ज़ोर से बोलकर अभ्यास करो। फ़ेयर के दिन शब्द आसानी से निकले। बारिश का पानी बचाने पर नेहा के प्रोजेक्ट को दूसरा इनाम मिला, और जजों ने उसके साफ़ समझाने की तारीफ़ की।",
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
    "जब आप पढ़ते हैं, तो आपकी आँखें लाइन पर आराम से फिसलती नहीं हैं। वे कूदती हैं। हर छलांग को सकेड (saccade) कहते हैं, और छलांगों के बीच आँखें पल भर रुककर कुछ शब्द पकड़ती हैं। धीमे पढ़ने वाले अक्सर हर शब्द पर रुकते हैं और पढ़े हुए शब्दों पर बार-बार लौटते हैं। जब शब्द एक-एक करके आपकी आँखों तक आते हैं, तो न कूदना पड़ता है न लौटना, और दिमाग़ मतलब पर टिका रहता है। खिलाड़ी भी ऐसे ही अभ्यास करते हैं: रोज़, आराम से थोड़ा तेज़।",
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
    "आपकी याददाश्त को परखा जाना पसंद है। वैज्ञानिक इसे testing effect कहते हैं। एक प्रयोग में छात्रों के दो समूहों ने एक ही पाठ सीखा। एक समूह ने उसे चार बार पढ़ा। दूसरे समूह ने एक बार पढ़ा और फिर जो याद था, सब लिखने की कोशिश की। एक हफ़्ते बाद दूसरे समूह को कहीं ज़्यादा याद था, जबकि उन्होंने पाठ के साथ कम समय बिताया था। तो अगली बार दोहराते समय किताब बंद करके खुद से सवाल पूछिए। याद करने की मेहनत से ही याददाश्त मज़बूत होती है।",
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
    "इंसान के दिमाग़ में लगभग छियासी अरब नर्व सेल होते हैं, जिन्हें न्यूरॉन कहते हैं। जब भी आप कुछ नया सीखते हैं, कुछ न्यूरॉन आपस में थोड़ा और मज़बूती से जुड़ जाते हैं। एक ही हुनर का बार-बार अभ्यास करें, तो यह जुड़ाव जंगल के बीच एक चलते-फिरते रास्ते जैसा बन जाता है: आसान और तेज़। इसीलिए गणित का मुश्किल तरीका पहले दिन धीमा लगता है, पर दो हफ़्ते बाद सहज। इसीलिए रोज़ का छोटा अभ्यास महीने के आख़िर के एक लंबे सत्र से बेहतर है।",
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
    "Vikram, a manager at a bank in Indore, read at least forty emails before lunch every day. By evening he could recall only a few of them. His solution was simple. Before opening each long email, he asked himself one question: what do I need from this? By Friday, he noticed that he was finishing his inbox twenty minutes earlier.",
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
    "Sunita, a software team lead in Pune, used to start her day by checking messages. By eleven she felt busy but had done no real work. She changed one habit: for the first ninety minutes, she worked only on her most important task, with notifications off. Within a month, her team finished two projects ahead of schedule.",
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
    "Arjun ran a small travel agency in Jaipur and often forgot what clients told him on the phone. His solution cost nothing. After every call, he spent one minute writing three lines: the client’s name, what they wanted and the next step. Clients began to say that Arjun remembered every detail, and his repeat bookings doubled within a year.",
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
    "In 1885, a German scientist, Hermann Ebbinghaus, tested his own memory with long lists of made-up words. He found that we forget most new information surprisingly fast: within a day, much of it is gone. His work gave us the famous forgetting curve. The good news came from the same experiments. Each time he reviewed a list at the right moment, the curve became flatter and the memory lasted longer. Busy professionals use this today: three key points, reviewed again the next morning.",
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
    "Multitasking feels efficient, but the brain does not really do two thinking tasks at once. It switches between them, and every switch costs a little time and focus. Researchers estimate that constant switching can waste up to forty percent of a working day. The fix is called single-tasking. Choose one task, close the other tabs, and work on it for a fixed block of time, such as twenty-five minutes. Then take a short break. Many professionals find they finish sooner and make fewer mistakes.",
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
    "A short walk can be a powerful thinking tool. In a study at Stanford University, people came up with about sixty percent more creative ideas while walking than while sitting. The walk did not need to be outdoors or long; even a few minutes on a treadmill helped. Many leaders hold their meetings while walking for this reason. The next time you are stuck on a problem at work, step away from the desk, walk for ten minutes and let your brain connect the dots.",
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
    "इंदौर के एक बैंक में मैनेजर विक्रम रोज़ दोपहर के खाने से पहले कम से कम चालीस ईमेल पढ़ते थे। शाम तक उन्हें उनमें से कुछ ही याद रहते थे। उनका हल बहुत आसान था। हर लंबा ईमेल खोलने से पहले वे खुद से एक सवाल पूछते: मुझे इससे क्या चाहिए? शुक्रवार तक उन्होंने देखा कि उनका inbox बीस मिनट पहले ख़त्म होने लगा था।",
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
    "पुणे में सॉफ़्टवेयर टीम लीड सुनीता अपना दिन मैसेज देखकर शुरू करती थीं। ग्यारह बजे तक वे व्यस्त तो महसूस करतीं, पर असली काम कुछ नहीं होता था। उन्होंने एक आदत बदली: पहले नब्बे मिनट वे notifications बंद करके सिर्फ़ अपने सबसे ज़रूरी काम पर लगीं। एक महीने में उनकी टीम ने दो प्रोजेक्ट समय से पहले पूरे कर दिए।",
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
    "जयपुर में अर्जुन की एक छोटी ट्रैवल एजेंसी थी, और वे अक्सर भूल जाते थे कि क्लाइंट ने फ़ोन पर क्या कहा। उनका हल मुफ़्त था। हर कॉल के बाद वे एक मिनट में तीन लाइन लिखते: क्लाइंट का नाम, उन्हें क्या चाहिए, और अगला कदम। क्लाइंट कहने लगे कि अर्जुन को हर बात याद रहती है, और एक साल में उनकी दोबारा बुकिंग दोगुनी हो गई।",
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
    "सन 1885 में जर्मन वैज्ञानिक हरमन एबिंगहाउस ने बनावटी शब्दों की लंबी लिस्ट से अपनी याददाश्त परखी। उन्होंने पाया कि हम नई जानकारी हैरानी भरी तेज़ी से भूलते हैं: एक दिन में उसका बड़ा हिस्सा चला जाता है। उनके काम से हमें मशहूर forgetting curve मिला। अच्छी ख़बर भी इन्हीं प्रयोगों से आई। जब भी उन्होंने सही समय पर लिस्ट दोहराई, curve चपटा होता गया और याद ज़्यादा देर टिकी। व्यस्त professionals आज यही करते हैं: तीन मुख्य बातें, अगली सुबह फिर से देखना।",
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
    "एक साथ कई काम करना कुशल लगता है, पर दिमाग़ असल में सोचने वाले दो काम एक साथ नहीं करता। वह उनके बीच अदला-बदली करता है, और हर बदलाव में थोड़ा समय और ध्यान खर्च होता है। रिसर्च के अनुमान से लगातार अदला-बदली काम के दिन का चालीस प्रतिशत तक बर्बाद कर सकती है। इसका इलाज है single-tasking। एक काम चुनिए, बाकी टैब बंद कीजिए, और तय समय तक, जैसे पच्चीस मिनट, उसी पर काम कीजिए। फिर छोटा ब्रेक लीजिए। कई professionals पाते हैं कि काम जल्दी और कम गलतियों के साथ होता है।",
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
    "थोड़ी देर टहलना सोचने का एक दमदार तरीका है। स्टैनफ़र्ड यूनिवर्सिटी की एक रिसर्च में लोगों को बैठने के मुकाबले टहलते हुए लगभग साठ प्रतिशत ज़्यादा नए आइडिया आए। टहलना बाहर या लंबा होना ज़रूरी नहीं था; ट्रेडमिल पर कुछ मिनट भी काम आए। इसी वजह से कई लीडर टहलते हुए मीटिंग करते हैं। अगली बार काम में किसी समस्या पर अटकें, तो डेस्क से उठिए, दस मिनट टहलिए और दिमाग़ को बिंदु जोड़ने दीजिए। यह आदत मुफ़्त है और किसी भी उम्र में काम करती है।",
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
