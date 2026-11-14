import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lineUrl, VOICE_LINES, voiceSources, voiceText } from "./voiceLines";
import { linePace, sameWords, ttsText } from "./voiceTts";

const pub = (url: string): string => path.join(process.cwd(), "public", url);
const manifest = (
  lang: "en" | "hi",
): {
  voice: string;
  lines: Record<string, { text: string }>;
} =>
  JSON.parse(
    fs.readFileSync(pub(`/audio/brain-unlock/${lang}/manifest.json`), "utf8"),
  ) as { voice: string; lines: Record<string, { text: string }> };

describe("Brain Unlock voice lines (go-live voice: Sarvam shubh)", () => {
  it("every line, EN and HI, has its shubh file — nothing falls back to text", () => {
    for (const lang of ["en", "hi"] as const) {
      expect(VOICE_LINES[lang].length).toBeGreaterThanOrEqual(22);
      expect(manifest(lang).voice).toBe("shubh");
      for (const l of VOICE_LINES[lang]) {
        expect(fs.existsSync(pub(lineUrl(lang, l.id))), `${lang}/${l.id}`).toBe(
          true,
        );
        // Voiced from the current script text (a changed line must be voiced again).
        expect(manifest(lang).lines[l.id]?.text, `${lang}/${l.id}`).toBe(
          l.text,
        );
      }
    }
  });
  it("Dr. Kapil's clone files are stored but never played", () => {
    expect(fs.existsSync(pub("/audio/brain-unlock/clone/hi/hook.mp3"))).toBe(
      true,
    );
    for (const lang of ["en", "hi"] as const)
      for (const l of VOICE_LINES[lang])
        expect(
          voiceSources(lang, l.id, {}).some((u) => u.includes("/clone/")),
        ).toBe(false);
  });
  it("EN and HI have the same lines, including the five new ones", () => {
    expect(VOICE_LINES.hi.map((l) => l.id)).toEqual(
      VOICE_LINES.en.map((l) => l.id),
    );
    for (const id of [
      "hook",
      "check-intro",
      "reveal-up",
      "reveal-kind",
      "report-ready",
    ])
      expect(voiceText("hi", id), id).not.toBe("");
  });
  it("sources in order: his own upload → the bundled file", () => {
    expect(voiceSources("hi", "hook", {})).toEqual([
      "/audio/brain-unlock/hi/hook.mp3",
    ]);
    expect(
      voiceSources("en", "hook", { hook: "https://cdn.test/own.mp3" }),
    ).toEqual(["https://cdn.test/own.mp3", "/audio/brain-unlock/en/hook.mp3"]);
  });
  it("captions drop the pause marks", () => {
    expect(voiceText("en", "focus-done")).toBe(
      "Beautiful. Your mind is calm and sharp.",
    );
  });
});

describe("regenerate (one piece, checked)", () => {
  it("voices the whole line in one go, without the caption pause marks", () => {
    expect(ttsText("Beautiful. ... Your mind is calm.")).toBe(
      "Beautiful. Your mind is calm.",
    );
    expect(ttsText("A huge gorilla...")).toBe("A huge gorilla");
  });
  it("memory story and focus are calmer; the rest natural", () => {
    expect(linePace("storyA-3")).toBeLessThan(1);
    expect(linePace("focus-in")).toBeLessThan(1);
    expect(linePace("hook")).toBe(1);
  });
  it("accepts the script as heard", () => {
    expect(sameWords("Wow!", "Wow.")).toBe(true);
    expect(
      sameWords(
        "तीस दिन की practice में यह कदम-दर-कदम बढ़ता है।",
        "30 दिन की प्रैक्टिस में यह कदम दर कदम बढ़ता है।",
      ),
    ).toBe(true);
    expect(
      sameWords("तीन superpowers unlock करेंगे", "3 सुपर पावर्स अनलॉक करेंगे"),
    ).toBe(true);
    expect(sameWords("और धीरे-धीरे साँस छोड़िए।", "और धीरे-धीरे सांस छोड़िए।")).toBe(
      true,
    );
  });
  it("refuses added, repeated or missing words", () => {
    expect(sameWords("A huge gorilla", "a huge gorilla of of force")).toBe(
      false,
    );
    expect(sameWords("Beautiful.", "Beautiful. Beautiful.")).toBe(false);
    expect(sameWords("वाह!", "वाह वाह")).toBe(false);
    expect(
      sameWords("ये आपके अपने, असली नंबर हैं।", "यह आपके अपने असली नंबर हैं, असली नंबर हैं।"),
    ).toBe(false);
    expect(
      sameWords("Most people read at the speed they speak.", "Most people"),
    ).toBe(false);
  });
});
