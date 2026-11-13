// Brain Unlock word lists (founder spec, 13 Nov 2026). None of these words is
// used by the app's Memory Check (Day 1 / Day 30), the Memory Palace or the
// Memory Studio (story items, pegs, number pictures, keyword cards), so the
// free funnel can never make the app's own checks easier — words.test.ts
// enforces it. The spec's suggested words (ring, train, lion; elephant,
// umbrella, milk, kite, phone) are memory-check or Memory Palace words, so
// they were replaced with these.
//
// Set A is the main player; set B is the child in Duo Mode, so a child who
// watched the parent's turn never sees the same words.

export type BuLang = "en" | "hi";
export type BuWord = { id: string; en: string; hi: string; emoji: string };

const w = (id: string, en: string, hi: string, emoji: string): BuWord => ({
  id,
  en,
  hi,
  emoji,
});

export type WordSet = "A" | "B";

/** Brain Check: 5 words, 2 s each, then pick them from 10 (the 5 + 5 others). */
export const CHECK_WORDS: Readonly<
  Record<WordSet, { targets: readonly BuWord[]; others: readonly BuWord[] }>
> = {
  A: {
    targets: [
      w("helmet", "helmet", "हेलमेट", ""),
      w("samosa", "samosa", "समोसा", ""),
      w("bangle", "bangle", "चूड़ी", ""),
      w("blanket", "blanket", "कंबल", ""),
      w("scooter", "scooter", "स्कूटर", ""),
    ],
    others: [
      w("brick", "brick", "ईंट", ""),
      w("towel", "towel", "तौलिया", ""),
      w("wallet", "wallet", "बटुआ", ""),
      w("cushion", "cushion", "कुशन", ""),
      w("thread", "thread", "धागा", ""),
    ],
  },
  B: {
    targets: [
      w("bench", "bench", "बेंच", ""),
      w("jug", "jug", "जग", ""),
      w("torch", "torch", "टॉर्च", ""),
      w("button", "button", "बटन", ""),
      w("papaya", "papaya", "पपीता", ""),
    ],
    others: [
      w("curtain", "curtain", "पर्दा", ""),
      w("eraser", "eraser", "रबड़", ""),
      w("poster", "poster", "पोस्टर", ""),
      w("slipper", "slipper", "चप्पल", ""),
      w("stool", "stool", "स्टूल", ""),
    ],
  },
};

/** Unlock 2: the linking story — 5 NEW words, recalled in order, then backwards. */
export const STORY_WORDS: Readonly<
  Record<WordSet, { targets: readonly BuWord[]; others: readonly BuWord[] }>
> = {
  A: {
    targets: [
      w("gorilla", "gorilla", "गोरिल्ला", "🦍"),
      w("suitcase", "suitcase", "सूटकेस", "🧳"),
      w("curd", "curd", "दही", "🥣"),
      w("drone", "drone", "ड्रोन", "🛸"),
      w("tiffin", "tiffin", "टिफ़िन", "🍱"),
    ],
    others: [
      w("needle", "needle", "सुई", ""),
      w("carpet", "carpet", "कालीन", ""),
      w("sponge", "sponge", "स्पंज", ""),
      w("brush", "brush", "ब्रश", ""),
      w("pipe", "pipe", "पाइप", ""),
    ],
  },
  B: {
    targets: [
      w("squirrel", "squirrel", "गिलहरी", "🐿️"),
      w("cooker", "cooker", "कुकर", "🍲"),
      w("popcorn", "popcorn", "पॉपकॉर्न", "🍿"),
      w("buffalo", "buffalo", "भैंस", "🐃"),
      w("remote", "remote", "रिमोट", "📺"),
    ],
    others: [
      w("fridge", "fridge", "फ़्रिज", ""),
      w("hanger", "hanger", "हैंगर", ""),
      w("gate", "gate", "गेट", ""),
      w("lift", "lift", "लिफ़्ट", ""),
      w("sticker", "sticker", "स्टिकर", ""),
    ],
  },
};

/** The story itself, one line per word (each line ends on its word's picture). */
export const STORY_LINES: Readonly<
  Record<WordSet, Readonly<Record<BuLang, readonly string[]>>>
> = {
  A: {
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
  B: {
    en: [
      "A cheeky squirrel...",
      "...jumps into a big cooker.",
      "The cooker whistles and shoots out popcorn!",
      "The popcorn lands on a sleeping buffalo...",
      "...and the buffalo sits right on your TV remote.",
    ],
    hi: [
      "एक नटखट गिलहरी...",
      "...एक बड़े कुकर में कूद गई।",
      "कुकर ने सीटी मारी और पॉपकॉर्न उड़ने लगे!",
      "पॉपकॉर्न एक सोती हुई भैंस पर गिरे...",
      "...और भैंस सीधे आपके TV के रिमोट पर बैठ गई।",
    ],
  },
};

export function wordText(word: BuWord, lang: BuLang): string {
  return word[lang];
}

/** Every word Brain Unlock shows (for the overlap test). */
export const ALL_BRAIN_UNLOCK_WORDS: readonly BuWord[] = (
  ["A", "B"] as const
).flatMap((s) => [
  ...CHECK_WORDS[s].targets,
  ...CHECK_WORDS[s].others,
  ...STORY_WORDS[s].targets,
  ...STORY_WORDS[s].others,
]);
