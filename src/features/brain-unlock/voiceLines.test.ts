import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  cloneUrl,
  shubhUrl,
  VOICE_LINES,
  voiceSources,
  voiceText,
} from "./voiceLines";
import { linePieces, sameWords } from "./voiceClone";

const pub = (url: string): string => path.join(process.cwd(), "public", url);

describe("Brain Unlock voice lines", () => {
  it("every line, EN and HI, has Dr. Kapil's cloned-voice file bundled", () => {
    for (const lang of ["en", "hi"] as const) {
      expect(VOICE_LINES[lang].length).toBeGreaterThanOrEqual(22);
      for (const l of VOICE_LINES[lang])
        expect(
          fs.existsSync(pub(cloneUrl(lang, l.id))),
          `${lang}/${l.id}`,
        ).toBe(true);
    }
  });
  it("EN and HI have the same lines, and the flow's lines all exist", () => {
    expect(VOICE_LINES.hi.map((l) => l.id)).toEqual(
      VOICE_LINES.en.map((l) => l.id),
    );
    for (const id of [
      "hook",
      "check-intro",
      "speed-teach",
      "memory-teach",
      "storyA-1",
      "storyB-5",
      "memory-replay",
      "focus-intro",
      "focus-in",
      "focus-out",
      "focus-done",
      "reveal-up",
      "reveal-kind",
      "report-ready",
    ])
      expect(voiceText("hi", id), id).not.toBe("");
  });
  it("the older shubh files stay as the fallback for the original lines", () => {
    for (const lang of ["en", "hi"] as const)
      for (const id of [
        "speed-teach",
        "memory-teach",
        "storyA-1",
        "storyB-5",
        "focus-intro",
        "focus-done",
      ])
        expect(fs.existsSync(pub(shubhUrl(lang, id))), `${lang}/${id}`).toBe(
          true,
        );
  });
  it("sources in order: his own upload → clone → shubh", () => {
    expect(voiceSources("hi", "hook", {})).toEqual([
      "/audio/brain-unlock/hi/hook.mp3",
      "/audio/brain-unlock/shubh/hi/hook.mp3",
    ]);
    expect(
      voiceSources("en", "hook", { hook: "https://cdn.test/own.mp3" }),
    ).toEqual([
      "https://cdn.test/own.mp3",
      "/audio/brain-unlock/en/hook.mp3",
      "/audio/brain-unlock/shubh/en/hook.mp3",
    ]);
  });
  it("captions drop the pause marks", () => {
    expect(voiceText("en", "focus-done")).toBe(
      "Beautiful. Your mind is calm and sharp.",
    );
  });
});

describe("cloned-voice check (regenerate)", () => {
  it("accepts the script as heard", () => {
    expect(sameWords("Wow!", "Wow.")).toBe(true);
    expect(
      sameWords(
        "तीस दिन की practice में यह बढ़ता है।",
        "30 दिन की प्रैक्टिस में यह बढ़ता है।",
      ),
    ).toBe(true);
    expect(
      sameWords("तीन superpowers unlock करेंगे", "3 सुपर पावर्स अनलॉक करेंगे"),
    ).toBe(true);
    expect(sameWords("और धीरे-धीरे साँस छोड़िए।", "और धीरे-धीरे सांस छोड़िए।")).toBe(
      true,
    );
  });
  it("refuses added, repeated or stuttered words", () => {
    expect(sameWords("A huge gorilla", "a huge gorilla of of force")).toBe(
      false,
    );
    expect(sameWords("Beautiful.", "Beautiful. Beautiful.")).toBe(false);
    expect(sameWords("वाह!", "वाह वाह")).toBe(false);
    expect(
      sameWords("ये आपके अपने, असली नंबर हैं।", "यह आपके अपने असली नंबर हैं, असली नंबर हैं।"),
    ).toBe(false);
  });
  it("splits a line at its pauses", () => {
    expect(linePieces("Beautiful. ... Your mind is calm.")).toEqual([
      "Beautiful.",
      "Your mind is calm.",
    ]);
  });
});
