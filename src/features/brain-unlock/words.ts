// Brain Unlock word sets (founder, 14 Nov 2026): 6 Brain Check sets and 6
// linking-story sets, one of each picked at random per session (never the
// same set twice for one person until all are used — see sets.ts). The Duo
// child always gets different sets from the parent.
//
// Every set is equally easy: five concrete, everyday Indian things, short
// words, easy to picture. None of these words is used by the app's Memory
// Check (Day 1 / Day 30), Memory Studio (story items, pegs, number pictures,
// keyword cards), the Memory Palace, or Dr. Kapil's demo video — words.test.ts
// enforces it. From the founder's starting sets, these clashed and were
// replaced: बाल्टी, झाड़ू, चश्मा, गुब्बारा, रोटी, साइकिल, ताला, कंघी, ऑटो, मटका,
// बैट, तोता, टोपी, ट्रैक्टर, घंटी, अंडा, नारियल, सीढ़ी (check) and ड्रम, पिज़्ज़ा,
// पैराशूट, पेंगुइन, सोफ़ा, हेलिकॉप्टर, मोज़ा, ज़िराफ़, गिटार, रॉकेट, भालू, ट्रम्पेट,
// जहाज़, कैमरा, कछुआ, केक, सीटी, लैपटॉप (story).

export type BuLang = "en" | "hi";
export type BuWord = { id: string; en: string; hi: string; emoji: string };

const w = (id: string, en: string, hi: string, emoji = ""): BuWord => ({
  id,
  en,
  hi,
  emoji,
});

export const CHECK_SET_IDS = ["c1", "c2", "c3", "c4", "c5", "c6"] as const;
export const STORY_SET_IDS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;
export type CheckSetId = (typeof CHECK_SET_IDS)[number];
export type StorySetId = (typeof STORY_SET_IDS)[number];

/** Brain Check: 5 words, 2 s each, then pick them from 10 (the 5 + 5 from the pool). */
export const CHECK_SETS: Readonly<Record<CheckSetId, readonly BuWord[]>> = {
  c1: [
    w("helmet", "helmet", "हेलमेट"),
    w("bangle", "bangle", "चूड़ी"),
    w("samosa", "samosa", "समोसा"),
    w("blanket", "blanket", "कंबल"),
    w("scooter", "scooter", "स्कूटर"),
  ],
  c2: [
    w("pot", "pot", "पतीला"),
    w("dholak", "dholak", "ढोलक"),
    w("lantern", "lantern", "लालटेन"),
    w("mat", "mat", "चटाई"),
    w("pakora", "pakora", "पकौड़ा"),
  ],
  c3: [
    w("idli", "idli", "इडली"),
    w("truck", "truck", "ट्रक"),
    w("belt", "belt", "बेल्ट"),
    w("tabla", "tabla", "तबला"),
    w("mattress", "mattress", "गद्दा"),
  ],
  c4: [
    w("jalebi", "jalebi", "जलेबी"),
    w("jacket", "jacket", "जैकेट"),
    w("cupboard", "cupboard", "अलमारी"),
    w("conch", "conch", "शंख"),
    w("metro", "metro", "मेट्रो"),
  ],
  c5: [
    w("rolling-pin", "rolling pin", "बेलन"),
    w("laddoo", "laddoo", "लड्डू"),
    w("turban", "turban", "पगड़ी"),
    w("bulb", "bulb", "बल्ब"),
    w("hockey", "hockey stick", "हॉकी"),
  ],
  c6: [
    w("purse", "purse", "पर्स"),
    w("dosa", "dosa", "डोसा"),
    w("cooler", "cooler", "कूलर"),
    w("sword", "sword", "तलवार"),
    w("swing", "swing", "झूला"),
  ],
};

/** The 5 "others" on the Brain Check pick screen come from this pool (never a target anywhere). */
export const CHECK_POOL: readonly BuWord[] = [
  w("brick", "brick", "ईंट"),
  w("wallet", "wallet", "बटुआ"),
  w("thread", "thread", "धागा"),
  w("eraser", "eraser", "रबड़"),
  w("slipper", "slipper", "चप्पल"),
  w("curtain", "curtain", "पर्दा"),
  w("stool", "stool", "स्टूल"),
  w("poster", "poster", "पोस्टर"),
  w("button", "button", "बटन"),
  w("jug", "jug", "जग"),
  w("bench", "bench", "बेंच"),
  w("papaya", "papaya", "पपीता"),
  w("cushion", "cushion", "कुशन"),
  w("heater", "heater", "हीटर"),
  w("quilt", "quilt", "रज़ाई"),
];

/** Unlock 2: the linking story — 5 NEW words (with a picture each), recalled in order, then backwards. */
export const STORY_SETS: Readonly<Record<StorySetId, readonly BuWord[]>> = {
  s1: [
    w("gorilla", "gorilla", "गोरिल्ला", "🦍"),
    w("suitcase", "suitcase", "सूटकेस", "🧳"),
    w("curd", "curd", "दही", "🥣"),
    w("drone", "drone", "ड्रोन", "🛸"),
    w("tiffin", "tiffin", "टिफ़िन", "🍱"),
  ],
  s2: [
    w("crocodile", "crocodile", "मगरमच्छ", "🐊"),
    w("piano", "piano", "पियानो", "🎹"),
    w("burger", "burger", "बर्गर", "🍔"),
    w("skateboard", "skateboard", "स्केटबोर्ड", "🛹"),
    w("cooker", "cooker", "कुकर", "🍲"),
  ],
  s3: [
    w("panda", "panda", "पांडा", "🐼"),
    w("headphones", "headphones", "हेडफ़ोन", "🎧"),
    w("icecream", "ice cream", "आइसक्रीम", "🍦"),
    w("crane", "crane", "क्रेन", "🏗️"),
    w("sandal", "sandal", "सैंडल", "🩴"),
  ],
  s4: [
    w("shark", "shark", "शार्क", "🦈"),
    w("microphone", "microphone", "माइक", "🎤"),
    w("biryani", "biryani", "बिरयानी", "🍛"),
    w("battery", "battery", "बैटरी", "🔋"),
    w("mask", "mask", "मुखौटा", "🎭"),
  ],
  s5: [
    w("lizard", "lizard", "छिपकली", "🦎"),
    w("football", "football", "फ़ुटबॉल", "⚽"),
    w("popcorn", "popcorn", "पॉपकॉर्न", "🍿"),
    w("printer", "printer", "प्रिंटर", "🖨️"),
    w("lipstick", "lipstick", "लिपस्टिक", "💄"),
  ],
  s6: [
    w("sheep", "sheep", "भेड़", "🐑"),
    w("bullock-cart", "bullock cart", "बैलगाड़ी", "🐂"),
    w("noodles", "noodles", "नूडल्स", "🍜"),
    w("medal", "medal", "मेडल", "🏅"),
    w("speaker", "speaker", "स्पीकर", "🔊"),
  ],
};

/** The 5 "others" on the story recall screen come from this pool (never a target anywhere). */
export const STORY_POOL: readonly BuWord[] = [
  w("needle", "needle", "सुई"),
  w("carpet", "carpet", "कालीन"),
  w("sponge", "sponge", "स्पंज"),
  w("brush", "brush", "ब्रश"),
  w("pipe", "pipe", "पाइप"),
  w("fridge", "fridge", "फ़्रिज"),
  w("hanger", "hanger", "हैंगर"),
  w("gate", "gate", "गेट"),
  w("lift", "lift", "लिफ़्ट"),
  w("sticker", "sticker", "स्टिकर"),
  w("paneer", "paneer", "पनीर"),
  w("peanut", "peanut", "मूँगफली"),
  w("shovel", "shovel", "फावड़ा"),
  w("toothbrush", "toothbrush", "टूथब्रश"),
  w("kurta", "kurta", "कुर्ता"),
];

/**
 * Each set's funny visual story, one line per word (each line holds its word).
 * "..." marks a pause in the caption; the voice files are /audio/brain-unlock/<lang>/<setId>-<n>.mp3.
 */
export const STORY_LINES: Readonly<
  Record<StorySetId, Readonly<Record<BuLang, readonly string[]>>>
> = {
  s1: {
    en: [
      "A huge gorilla...",
      "...opens a giant suitcase.",
      "Instead of clothes, curd pours out of the suitcase!",
      "The curd soaks a flying drone...",
      "...and the heavy drone falls right into your tiffin.",
    ],
    hi: [
      "एक विशाल गोरिल्ला...",
      "...ने बड़ा-सा सूटकेस खोला।",
      "कपड़ों की जगह सूटकेस से दही बहने लगा!",
      "दही से उड़ता ड्रोन भीग गया...",
      "...और भारी ड्रोन सीधे आपके टिफ़िन में आ गिरा।",
    ],
  },
  s2: {
    en: [
      "A big green crocodile...",
      "...sits down and plays the piano.",
      "Out of the piano jumps a giant burger!",
      "The burger rides away on a skateboard...",
      "...and crashes right into a whistling cooker.",
    ],
    hi: [
      "एक बड़ा हरा मगरमच्छ...",
      "...बैठकर पियानो बजाने लगा।",
      "पियानो में से एक बड़ा-सा बर्गर उछल पड़ा!",
      "बर्गर स्केटबोर्ड पर बैठकर भागा...",
      "...और सीधे सीटी मारते कुकर से टकरा गया।",
    ],
  },
  s3: {
    en: [
      "A sleepy panda...",
      "...puts on big headphones.",
      "The music is so loud that ice cream shoots out of the headphones!",
      "The ice cream lands on a tall crane...",
      "...and the crane drops it right into your sandal.",
    ],
    hi: [
      "एक नींद में डूबा पांडा...",
      "...बड़े-बड़े हेडफ़ोन लगाता है।",
      "गाना इतना तेज़ है कि हेडफ़ोन से आइसक्रीम उछलने लगी!",
      "आइसक्रीम एक ऊँची क्रेन पर जा गिरी...",
      "...और क्रेन ने उसे सीधे आपकी सैंडल में गिरा दिया।",
    ],
  },
  s4: {
    en: [
      "A smiling shark...",
      "...sings loudly into a microphone.",
      "The microphone fills up with hot biryani!",
      "The biryani is so spicy that it charges a battery...",
      "...and the battery flies off and puts on a funny mask!",
    ],
    hi: [
      "एक मुस्कुराती शार्क...",
      "...माइक में ज़ोर-ज़ोर से गाना गाती है।",
      "माइक गरम-गरम बिरयानी से भर गया!",
      "बिरयानी इतनी तीखी है कि बैटरी चार्ज हो गई...",
      "...और बैटरी ने उड़कर एक मज़ेदार मुखौटा पहन लिया!",
    ],
  },
  s5: {
    en: [
      "A tiny lizard...",
      "...kicks a huge football.",
      "The football bursts and popcorn rains everywhere!",
      "The popcorn falls into a printer...",
      "...and the printer prints a giant lipstick.",
    ],
    hi: [
      "एक छोटी-सी छिपकली...",
      "...एक बड़े फ़ुटबॉल को किक मारती है।",
      "फ़ुटबॉल फटा और हर तरफ़ पॉपकॉर्न बरसने लगे!",
      "पॉपकॉर्न एक प्रिंटर में गिरे...",
      "...और प्रिंटर ने एक बड़ी-सी लिपस्टिक छाप दी।",
    ],
  },
  s6: {
    en: [
      "A fluffy sheep...",
      "...drives a bullock cart.",
      "The bullock cart is full of long, wiggly noodles!",
      "The sheep eats all the noodles and wins a shiny medal...",
      "...and the medal starts singing like a loud speaker.",
    ],
    hi: [
      "एक रुई जैसी भेड़...",
      "...बैलगाड़ी चला रही है।",
      "बैलगाड़ी लंबे-लंबे नूडल्स से भरी है!",
      "भेड़ सारे नूडल्स खाकर एक चमकता मेडल जीत गई...",
      "...और मेडल किसी तेज़ स्पीकर की तरह गाने लगा।",
    ],
  },
};

/** Voice line id for a story step (1-based). */
export const storyLineId = (set: StorySetId, n: number): string =>
  `${set}-${n}`;

export function wordText(word: BuWord, lang: BuLang): string {
  return word[lang];
}

/** `n` words from a pool, at random (the pick screen's "others"). */
export function pickOthers(
  pool: readonly BuWord[],
  n: number,
  rng: () => number = Math.random,
): BuWord[] {
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a.slice(0, n);
}

export const isCheckSetId = (v: string): v is CheckSetId =>
  (CHECK_SET_IDS as readonly string[]).includes(v);
export const isStorySetId = (v: string): v is StorySetId =>
  (STORY_SET_IDS as readonly string[]).includes(v);

/** Every word Brain Unlock shows (for the overlap test). */
export const ALL_BRAIN_UNLOCK_WORDS: readonly BuWord[] = [
  ...Object.values(CHECK_SETS).flat(),
  ...CHECK_POOL,
  ...Object.values(STORY_SETS).flat(),
  ...STORY_POOL,
];
