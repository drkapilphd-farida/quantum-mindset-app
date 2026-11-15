import { z } from "zod";
import { SCHOOLS_COPY, type FaqItem, type SchoolsLang } from "./copy";

// /schools admin settings (founder brief, 15 Nov 2026): everything that may
// change without a deploy, in one validated JSON row (school_page_settings,
// id = 1). Real data only: every default is EMPTY, and a section whose data
// is empty is hidden (the hero shows a neutral illustration instead).

const Bi = (max: number): z.ZodObject<{ en: z.ZodString; hi: z.ZodString }> =>
  z.object({ en: z.string().trim().max(max), hi: z.string().trim().max(max) });

/** A file in the public school-media bucket (or a site path such as /images/…). */
const MediaUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/school-media\//.test(v),
    "Upload the file here (or use a path on this site).",
  );

const Score = z.number().min(0).max(100000).nullable();

export const METRIC_IDS = ["focus", "memory", "reading", "retention"] as const;
export type MetricId = (typeof METRIC_IDS)[number];

/** Day 1 / Day 30 values for each metric (null = not shown). */
const Metrics = z.object({
  focus: z.object({ day1: Score, day30: Score }),
  memory: z.object({ day1: Score, day30: Score }),
  reading: z.object({ day1: Score, day30: Score }),
  retention: z.object({ day1: Score, day30: Score }),
});
export type MetricValues = z.infer<typeof Metrics>;

/** Units shown after each value. */
export const METRIC_UNITS: Record<MetricId, string> = {
  focus: "/100",
  memory: "/100",
  reading: " WPM",
  retention: "%",
};

const emptyMetrics = (): MetricValues => ({
  focus: { day1: null, day30: null },
  memory: { day1: null, day30: null },
  reading: { day1: null, day30: null },
  retention: { day1: null, day30: null },
});

export const SchoolSettingsSchema = z.object({
  hero: z.object({
    kind: z.enum(["none", "image", "video"]),
    url: MediaUrl,
    /** Optional still image shown before a video plays. */
    poster: MediaUrl,
  }),
  sampleReports: z
    .array(z.object({ url: MediaUrl.refine((v) => v !== "", "Upload an image."), caption: Bi(160) }))
    .max(6),
  example: Metrics,
  prices: z.object({ pilot: Bi(80), camp: Bi(80), program: Bi(80) }),
  results: z
    .array(
      z.object({
        label: Bi(120).refine((v) => v.en !== "" || v.hi !== "", "Give each result a label."),
        students: z.number().int().min(1).max(100000).nullable(),
        metrics: Metrics,
      }),
    )
    .max(12),
  /** Empty = the default FAQ in copy.ts. */
  faq: z
    .array(z.object({ en: z.object({ q: z.string().trim().min(1).max(200), a: z.string().trim().min(1).max(1200) }), hi: z.object({ q: z.string().trim().min(1).max(200), a: z.string().trim().min(1).max(1200) }) }))
    .max(15),
});

export type SchoolSettings = z.infer<typeof SchoolSettingsSchema>;

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  hero: { kind: "none", url: "", poster: "" },
  sampleReports: [],
  example: emptyMetrics(),
  prices: { pilot: { en: "", hi: "" }, camp: { en: "", hi: "" }, program: { en: "", hi: "" } },
  results: [],
  faq: [],
};

/** A saved row over the defaults; a broken or missing row falls back to the defaults, field by field. */
export function resolveSchoolSettings(raw: unknown): SchoolSettings {
  if (typeof raw !== "object" || raw === null) return DEFAULT_SCHOOL_SETTINGS;
  const out: Record<string, unknown> = { ...DEFAULT_SCHOOL_SETTINGS };
  const shape = SchoolSettingsSchema.shape;
  for (const key of Object.keys(shape) as (keyof typeof shape)[]) {
    const parsed = shape[key].safeParse((raw as Record<string, unknown>)[key]);
    if (parsed.success) out[key] = parsed.data;
  }
  return out as SchoolSettings;
}

/** Metrics that have both a Day 1 and a Day 30 value. */
export function filledMetrics(m: MetricValues): { id: MetricId; day1: number; day30: number }[] {
  return METRIC_IDS.flatMap((id) => {
    const { day1, day30 } = m[id];
    return day1 !== null && day30 !== null ? [{ id, day1, day30 }] : [];
  });
}

export const heroMedia = (s: SchoolSettings): { kind: "image" | "video"; url: string; poster: string } | null =>
  s.hero.kind !== "none" && s.hero.url !== "" ? { kind: s.hero.kind, url: s.hero.url, poster: s.hero.poster } : null;

/** The price line for a package: the admin's text, else "Free" (pilot) / "On request". */
export function priceLabel(s: SchoolSettings, id: "pilot" | "camp" | "program", lang: SchoolsLang): string {
  const set = s.prices[id][lang] || s.prices[id].en;
  if (set !== "") return set;
  return id === "pilot" ? SCHOOLS_COPY[lang].packages.free : SCHOOLS_COPY[lang].packages.onRequest;
}

/** The FAQ shown: the admin's edits, else the default. */
export function faqFor(s: SchoolSettings, lang: SchoolsLang): FaqItem[] {
  return s.faq.length > 0 ? s.faq.map((x) => x[lang]) : SCHOOLS_COPY[lang].faq.items;
}

/** Results with at least one Day 1 / Day 30 pair. */
export const visibleResults = (s: SchoolSettings): SchoolSettings["results"] =>
  s.results.filter((r) => filledMetrics(r.metrics).length > 0);

/** Pick the text in the page language, falling back to English. */
export const pick = (b: { en: string; hi: string }, lang: SchoolsLang): string => b[lang] || b.en;
