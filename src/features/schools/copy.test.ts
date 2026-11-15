import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { COACH_LINE_EN, CONSENT_PDF, SCHOOLS_COPY } from "./copy";
import { CONSENT } from "./consent";

// The founder's rules for the Schools page (brief, 15 Nov 2026).

/** Every string in a value, deeply (functions are called with a sample school). */
function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (typeof v === "function") return [String((v as (s: string) => string)("Sample School"))];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (typeof v === "object" && v !== null) return Object.values(v).flatMap(strings);
  return [];
}

const pageText = (lang: "en" | "hi"): string => strings(SCHOOLS_COPY[lang]).join("\n");

describe("Schools page copy rules", () => {
  it("says 'EEG headband' and never a device brand name", () => {
    for (const lang of ["en", "hi"] as const) {
      const all = pageText(lang) + strings(CONSENT[lang]).join("\n");
      expect(all).toMatch(/EEG headband/);
      expect(all).not.toMatch(/\b(muse|neurosity|crown|emotiv|neurosky|mindwave|neuphony|brainbit|interaxon|openbci|dreem)\b/i);
    }
  });

  it("uses no medical words on the page", () => {
    const en = pageText("en");
    expect(en).not.toMatch(/\b(adhd|add|dyslexi\w*|depress\w*|diagnos\w*|disorder\w*|autis\w*|anxiety|patient|treat(ment)?|therapy|cure)\b/i);
    // "medical" only in the disclaimer "not a medical test".
    expect(en.replace(/not a medical test/gi, "")).not.toMatch(/medical/i);
    const hi = pageText("hi");
    expect(hi).not.toMatch(/निदान|बीमारी|रोग|इलाज|डिप्रेशन|डिस्लेक्सिया|ADHD|मरीज़|मरीज/);
    expect(hi.replace(/मेडिकल टेस्ट नहीं/g, "")).not.toMatch(/मेडिकल/);
  });

  it("has the exact disclaimer", () => {
    expect(SCHOOLS_COPY.en.disclaimer).toBe("Educational assessment, not a medical test.");
  });

  it("names Dr. Kapil exactly as the founder wrote it (English), with the same name and title in Hindi", () => {
    expect(COACH_LINE_EN).toBe(
      "Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach · 12+ years of mind coaching · 15 years as a professor · 500+ workshops · 10,000+ learners",
    );
    expect(SCHOOLS_COPY.en.about.coachLine).toBe(COACH_LINE_EN);
    expect(SCHOOLS_COPY.hi.about.coachLine.startsWith("Dr. Kapil Dev Sharma, Brain, Mind & Meditation Coach · ")).toBe(true);
  });

  it("uses the founder's hero lines", () => {
    expect(SCHOOLS_COPY.en.hero.h1).toBe("See your students' Focus, Memory and Reading Speed with EEG, and grow them in 30 days.");
    expect(SCHOOLS_COPY.hi.hero.h1).toBe("अपने students का Focus, Memory और Reading Speed EEG से देखिए, और 30 दिन में बढ़ाइए।");
    expect(SCHOOLS_COPY.en.hero.whatsappText).toBe("Hello, I'm from [school], interested in Sharp Brain for Schools");
  });

  it("English and Hindi have the same structure (same number of points, steps, cards, packages, FAQ)", () => {
    const shape = (v: unknown): unknown =>
      Array.isArray(v) ? v.map(shape) : typeof v === "object" && v !== null ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shape(x)])) : typeof v;
    expect(shape(SCHOOLS_COPY.hi)).toEqual(shape(SCHOOLS_COPY.en));
    expect(shape(CONSENT.hi)).toEqual(shape(CONSENT.en));
  });

  it("keeps the 5 steps, 4 cards, 3 packages, 7 FAQs and 4 challenge points in order", () => {
    const c = SCHOOLS_COPY.en;
    expect(c.challenge.points).toHaveLength(4);
    expect(c.how.steps.map((s) => s.title)).toEqual([
      "Fit the EEG headband",
      "Focus task",
      "Reading task",
      "Memory task",
      "Brain Passport on WhatsApp",
    ]);
    expect(c.gets.cards.map((x) => x.who)).toEqual(["Students", "Parents", "School", "Teachers"]);
    expect(c.packages.items.map((p) => p.id)).toEqual(["pilot", "camp", "program"]);
    expect(c.faq.items).toHaveLength(7);
  });
});

describe("Parent consent form", () => {
  it("is the founder's English text", () => {
    expect(CONSENT.en.title).toBe("Sharp Brain EEG Brain & Focus Assessment, Mind Ur Mind: Parent Consent");
    expect(CONSENT.en.points).toHaveLength(5);
    expect(CONSENT.en.boxes).toHaveLength(2);
    expect(CONSENT.en.fields).toEqual(["Student name", "Class & section", "Age", "Parent/guardian name", "WhatsApp number", "Signature", "Date"]);
    for (const lang of ["en", "hi"] as const) expect(strings(CONSENT[lang]).join(" ")).toContain("info@mindurmind.org.in");
  });

  it("the PDFs exist and are exactly one A4 page each", () => {
    for (const lang of ["en", "hi"] as const) {
      const pdf = fs.readFileSync(`public${CONSENT_PDF[lang]}`).toString("latin1");
      expect(pdf.startsWith("%PDF-")).toBe(true);
      expect(pdf.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).toHaveLength(1);
      // A4 = 595.92 × 842.88 pt (Chromium rounds to 594.96 × 841.92).
      const box = /\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/.exec(pdf);
      expect(box).not.toBeNull();
      expect(Math.abs(Number(box?.[1]) - 595)).toBeLessThan(2);
      expect(Math.abs(Number(box?.[2]) - 842)).toBeLessThan(2);
    }
  });
});
