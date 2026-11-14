import { z } from "zod";

// Brain Unlock admin settings (founder spec, 13 Nov 2026): everything the
// founder may change without a deploy lives in one validated JSON row
// (brain_unlock_settings, id = 1). The defaults below are used until a row
// exists and fill in any field a saved row doesn't have. Real values only:
// an empty video ID, batch date or seat count hides that block.

const YT_ID = z
  .string()
  .trim()
  .regex(
    /^([A-Za-z0-9_-]{11})?$/,
    "A YouTube video ID is 11 characters (or leave it empty).",
  );
const Bi = z.object({
  en: z.string().trim().max(300),
  hi: z.string().trim().max(300),
});

export const BRAIN_TYPE_IDS = [
  "sprinter",
  "diver",
  "magician",
  "genius",
  "laser",
] as const;
export type BrainTypeId = (typeof BRAIN_TYPE_IDS)[number];

const BrainTypeText = z.object({
  emoji: z.string().trim().min(1).max(8),
  en: z.object({
    name: z.string().trim().min(1).max(40),
    line: z.string().trim().min(1).max(200),
  }),
  hi: z.object({
    name: z.string().trim().min(1).max(40),
    line: z.string().trim().min(1).max(200),
  }),
});

export const ScoringSchema = z.object({
  /** Points for the "after" reading speed: the highest band whose minWpm is reached. */
  speedBands: z
    .array(
      z.object({
        minWpm: z.number().int().min(0).max(2000),
        points: z.number().int().min(0).max(100),
      }),
    )
    .min(1)
    .max(12),
  /** Points per word recalled in order (of 5). */
  memoryPerWord: z.number().int().min(0).max(20),
  /** Bonus when all 5 come back backwards, and when 3–4 do. */
  backwardFull: z.number().int().min(0).max(30),
  backwardPartial: z.number().int().min(0).max(30),
  /** Points for the "after" focus grid: the first band whose maxSeconds is not exceeded (each wrong tap adds errorPenaltySeconds). */
  focusBands: z
    .array(
      z.object({
        maxSeconds: z.number().min(1).max(600),
        points: z.number().int().min(0).max(100),
      }),
    )
    .min(1)
    .max(12),
  focusFloor: z.number().int().min(0).max(100),
  errorPenaltySeconds: z.number().min(0).max(10),
  /** Label for the total score: the highest band whose min is reached. */
  scoreBands: z
    .array(
      z.object({
        min: z.number().int().min(0).max(100),
        en: z.string().trim().min(1).max(40),
        hi: z.string().trim().min(1).max(40),
      }),
    )
    .min(1)
    .max(8),
});
export type BuScoring = z.infer<typeof ScoringSchema>;

export const SettingsSchema = z.object({
  introVideoId: YT_ID,
  demoVideoId: YT_ID,
  reviewVideoIds: z.object({ parent: YT_ID, student: YT_ID }),
  numbersStrip: z.array(z.string().trim().min(1).max(40)).max(6),
  nextBatch: z.object({
    date: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
    seatsLeft: z.number().int().min(0).max(1000).nullable(),
  }),
  /**
   * Per-line voice overrides (public audio URLs), keyed by voice line id
   * (voiceLines.ts): Dr. Kapil's own upload, or a "Regenerate" from the admin
   * page. A line without one plays the bundled shubh file.
   */
  voiceLines: z.object({
    en: z.record(
      z.string().regex(/^[a-z0-9-]{1,40}$/i),
      z.string().trim().url().max(500),
    ),
    hi: z.record(
      z.string().regex(/^[a-z0-9-]{1,40}$/i),
      z.string().trim().url().max(500),
    ),
  }),
  scoring: ScoringSchema,
  brainTypes: z.object({
    sprinter: BrainTypeText,
    diver: BrainTypeText,
    magician: BrainTypeText,
    genius: BrainTypeText,
    laser: BrainTypeText,
  }),
  /** Day-30 practice goal ranges shown under each card (a goal, never a promise). */
  goals: z.object({ speed: Bi, memory: Bi, focus: Bi }),
  followups: z.object({
    enabled: z.boolean(),
    instant: z.boolean(),
    h1: z.boolean(),
    d1: z.boolean(),
    d2: z.boolean(),
    d30: z.boolean(),
  }),
});
export type BuSettings = z.infer<typeof SettingsSchema>;

export const DEFAULT_SETTINGS: BuSettings = {
  introVideoId: "",
  demoVideoId: "",
  // Real, consented reviews already on the Sharp Brain page (sharpBrainVideoReviews.ts):
  // Ruchi ji (parent) and the Class 9 student, 100 → 300 WPM.
  reviewVideoIds: { parent: "KTc1B-kajTY", student: "g135C_Dak7s" },
  // Real students' results from those review videos.
  numbersStrip: ["100 → 300 WPM", "100 → 350 WPM", "150 → 350 WPM"],
  nextBatch: { date: "", seatsLeft: null },
  voiceLines: { en: {}, hi: {} },
  scoring: {
    speedBands: [
      { minWpm: 0, points: 8 },
      { minWpm: 150, points: 14 },
      { minWpm: 200, points: 20 },
      { minWpm: 250, points: 25 },
      { minWpm: 300, points: 30 },
      { minWpm: 350, points: 33 },
    ],
    memoryPerWord: 5,
    backwardFull: 8,
    backwardPartial: 4,
    focusBands: [
      { maxSeconds: 10, points: 34 },
      { maxSeconds: 14, points: 30 },
      { maxSeconds: 18, points: 25 },
      { maxSeconds: 24, points: 20 },
      { maxSeconds: 32, points: 14 },
    ],
    focusFloor: 8,
    errorPenaltySeconds: 1,
    scoreBands: [
      { min: 0, en: "Ready to grow", hi: "बढ़ने को तैयार" },
      { min: 50, en: "Rising", hi: "उभरता दिमाग़" },
      { min: 70, en: "Sharp", hi: "तेज़ दिमाग़" },
      { min: 85, en: "Brilliant", hi: "शानदार" },
    ],
  },
  brainTypes: {
    sprinter: {
      emoji: "🚀",
      en: {
        name: "Hidden Sprinter",
        line: "Your speed jumped the most. Your eyes were waiting for this.",
      },
      hi: {
        name: "Hidden Sprinter",
        line: "आपकी speed सबसे ज़्यादा उछली। आपकी आँखें इसी का इंतज़ार कर रही थीं।",
      },
    },
    diver: {
      emoji: "🌊",
      en: {
        name: "Deep Diver",
        line: "You understand deeply. Speed will make you unstoppable.",
      },
      hi: {
        name: "Deep Diver",
        line: "आप गहराई से समझते हैं। Speed आपको रोक-न-सकने वाला बना देगी।",
      },
    },
    magician: {
      emoji: "🧠",
      en: {
        name: "Memory Magician",
        line: "Give you a method, and you remember everything.",
      },
      hi: {
        name: "Memory Magician",
        line: "आपको तरीका दीजिए, और आप सब याद रख लेते हैं।",
      },
    },
    genius: {
      emoji: "✨",
      en: {
        name: "Distracted Genius",
        line: "Huge potential, scattered focus. Train focus, and watch out!",
      },
      hi: {
        name: "Distracted Genius",
        line: "क्षमता बहुत बड़ी, focus बिखरा हुआ। Focus को train कीजिए, फिर देखिए!",
      },
    },
    laser: {
      emoji: "🎯",
      en: {
        name: "Laser Mind",
        line: "Your focus is your weapon. Now add speed and memory.",
      },
      hi: {
        name: "Laser Mind",
        line: "Focus आपकी सबसे बड़ी ताक़त है। अब speed और memory जोड़िए।",
      },
    },
  },
  goals: {
    speed: {
      en: "Day-30 practice goal: 250–400 WPM, with understanding",
      hi: "Day-30 practice goal: 250–400 WPM, समझ के साथ",
    },
    memory: {
      en: "Day-30 practice goal: 10–20 items in order",
      hi: "Day-30 practice goal: 10–20 चीज़ें क्रम से",
    },
    focus: {
      en: "Day-30 practice goal: the grid in under 12 seconds",
      hi: "Day-30 practice goal: grid 12 सेकंड से कम में",
    },
  },
  followups: {
    enabled: true,
    instant: true,
    h1: true,
    d1: true,
    d2: true,
    d30: true,
  },
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Saved values over the defaults, one level of objects deep at a time; arrays are replaced whole. */
export function mergeDeep<T>(base: T, over: unknown): T {
  if (!isObject(base) || !isObject(over))
    return over === undefined ? base : (over as T);
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over))
    out[k] = k in base ? mergeDeep((base as Record<string, unknown>)[k], v) : v;
  return out as T;
}

/** A saved row → settings. Anything invalid falls back to the defaults (the page must never break). */
export function resolveSettings(saved: unknown): BuSettings {
  if (!isObject(saved)) return DEFAULT_SETTINGS;
  const parsed = SettingsSchema.safeParse(mergeDeep(DEFAULT_SETTINGS, saved));
  return parsed.success ? parsed.data : DEFAULT_SETTINGS;
}
