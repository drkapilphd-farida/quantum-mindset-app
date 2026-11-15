import { describe, expect, it } from "vitest";
import { SCHOOLS_COPY } from "./copy";
import {
  DEFAULT_SCHOOL_SETTINGS,
  faqFor,
  filledMetrics,
  heroMedia,
  priceLabel,
  resolveSchoolSettings,
  SchoolSettingsSchema,
  visibleResults,
} from "./settings";

const MEDIA = "https://abcd.supabase.co/storage/v1/object/public/school-media/schools/hero-1.jpg";

describe("Schools page settings: real data only", () => {
  it("defaults are empty, so admin-fed sections stay hidden", () => {
    const s = resolveSchoolSettings(null);
    expect(s).toEqual(DEFAULT_SCHOOL_SETTINGS);
    expect(heroMedia(s)).toBeNull();
    expect(s.sampleReports).toEqual([]);
    expect(filledMetrics(s.example)).toEqual([]);
    expect(visibleResults(s)).toEqual([]);
  });

  it("prices: Free for the pilot, On request for the rest, until set", () => {
    const s = resolveSchoolSettings(null);
    expect(priceLabel(s, "pilot", "en")).toBe("Free");
    expect(priceLabel(s, "camp", "en")).toBe("On request");
    expect(priceLabel(s, "program", "hi")).toBe("पूछने पर");
    const set = resolveSchoolSettings({ prices: { pilot: { en: "", hi: "" }, camp: { en: "₹499 per student", hi: "" }, program: { en: "₹2,499", hi: "₹2,499 प्रति student" } } });
    expect(priceLabel(set, "camp", "hi")).toBe("₹499 per student"); // Hindi empty → English
    expect(priceLabel(set, "program", "hi")).toBe("₹2,499 प्रति student");
  });

  it("a metric shows only with both Day 1 and Day 30; a result only with at least one such metric", () => {
    const metrics = { focus: { day1: 52, day30: 71 }, memory: { day1: 40, day30: null }, reading: { day1: null, day30: null }, retention: { day1: 0, day30: 10 } };
    expect(filledMetrics(metrics).map((m) => m.id)).toEqual(["focus", "retention"]);
    const s = resolveSchoolSettings({
      results: [
        { label: { en: "Class 8", hi: "" }, students: 38, metrics },
        { label: { en: "Class 9", hi: "" }, students: 40, metrics: { ...metrics, focus: { day1: 1, day30: null }, retention: { day1: null, day30: null } } },
      ],
    });
    expect(visibleResults(s).map((r) => r.label.en)).toEqual(["Class 8"]);
  });

  it("hero: an uploaded file shows; 'none' or an empty URL shows the illustration", () => {
    expect(heroMedia(resolveSchoolSettings({ hero: { kind: "image", url: MEDIA, poster: "" } }))).toEqual({ kind: "image", url: MEDIA, poster: "" });
    expect(heroMedia(resolveSchoolSettings({ hero: { kind: "video", url: "", poster: "" } }))).toBeNull();
    expect(heroMedia(resolveSchoolSettings({ hero: { kind: "none", url: MEDIA, poster: "" } }))).toBeNull();
  });

  it("only accepts files from the school-media bucket (or a site path)", () => {
    const ok = (url: string): boolean => SchoolSettingsSchema.shape.hero.safeParse({ kind: "image", url, poster: "" }).success;
    expect(ok(MEDIA)).toBe(true);
    expect(ok("/images/telepathy-workshop/dr-kapil-portrait.jpg")).toBe(true);
    expect(ok("https://evil.example/x.jpg")).toBe(false);
    expect(ok("https://abcd.supabase.co/storage/v1/object/public/guided-audio/x.mp3")).toBe(false);
    expect(ok("javascript:alert(1)")).toBe(false);
  });

  it("FAQ: the standard one until the admin saves edits", () => {
    expect(faqFor(DEFAULT_SCHOOL_SETTINGS, "hi")).toEqual(SCHOOLS_COPY.hi.faq.items);
    const s = resolveSchoolSettings({ faq: [{ en: { q: "Q?", a: "A." }, hi: { q: "प्रश्न?", a: "उत्तर।" } }] });
    expect(faqFor(s, "en")).toEqual([{ q: "Q?", a: "A." }]);
    expect(faqFor(s, "hi")).toEqual([{ q: "प्रश्न?", a: "उत्तर।" }]);
  });

  it("a broken saved field falls back to its default without losing the others", () => {
    const s = resolveSchoolSettings({ prices: "oops", sampleReports: [{ url: MEDIA, caption: { en: "Sample", hi: "" } }] });
    expect(s.prices).toEqual(DEFAULT_SCHOOL_SETTINGS.prices);
    expect(s.sampleReports).toHaveLength(1);
  });
});
