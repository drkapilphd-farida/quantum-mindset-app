import { describe, expect, it } from "vitest";
import {
  ActiveClock,
  focusLetterIndex,
  showsFocusLetter,
  rsvpFontPx,
  rsvpStartWpm,
  rsvpWordMs,
  splitAtFocus,
  stepWpm,
} from "./rsvp";
import { wpmFrom } from "./scoring";

describe("RSVP Word Flash", () => {
  it("starts at 1.5 × the reader's own speed, between 220 and 450 WPM", () => {
    expect(rsvpStartWpm(160)).toBe(240);
    expect(rsvpStartWpm(100)).toBe(220);
    expect(rsvpStartWpm(0)).toBe(220);
    expect(rsvpStartWpm(250)).toBe(375);
    expect(rsvpStartWpm(400)).toBe(450);
  });
  it("− / + change the speed by 25 WPM, within 150–700", () => {
    expect(stepWpm(240, 1)).toBe(265);
    expect(stepWpm(240, -1)).toBe(215);
    expect(stepWpm(160, -1)).toBe(150);
    expect(stepWpm(690, 1)).toBe(700);
  });
  it("English focus letter: 1st for 1–3 letters, 2nd for 4–5, 3rd for 6–9, 4th for 10+", () => {
    expect(focusLetterIndex("a")).toBe(0);
    expect(focusLetterIndex("the")).toBe(0);
    expect(focusLetterIndex("read")).toBe(1);
    expect(focusLetterIndex("brain")).toBe(1);
    expect(focusLetterIndex("memory")).toBe(2);
    expect(focusLetterIndex("practises")).toBe(2);
    expect(focusLetterIndex("understand")).toBe(3);
    expect(focusLetterIndex("comprehension")).toBe(3);
  });
  it("punctuation is skipped when finding the focus letter", () => {
    expect(focusLetterIndex("“read")).toBe(2);
    expect(splitAtFocus("memory,")).toEqual({
      before: "me",
      focus: "m",
      after: "ory,",
    });
    expect(splitAtFocus("(brain)")).toEqual({
      before: "(b",
      focus: "r",
      after: "ain)",
    });
  });
  it("the red letter is English only: a Hindi passage shows whole words (even its English words/numbers)", () => {
    expect(showsFocusLetter("en")).toBe(true);
    expect(showsFocusLetter("hi")).toBe(false);
    // A number in an English passage still gets its focus digit.
    expect(splitAtFocus("1885,")).toEqual({
      before: "1",
      focus: "8",
      after: "85,",
    });
  });
  it("natural rhythm: comma ×1.5, full stop ×2 (also the Hindi ।), long words a little longer", () => {
    const base = rsvpWordMs("brain", 300);
    expect(base).toBe(200);
    expect(rsvpWordMs("brain,", 300)).toBe(300);
    expect(rsvpWordMs("brain.", 300)).toBe(400);
    expect(rsvpWordMs("दिमाग़।", 300)).toBe(400);
    expect(rsvpWordMs("comprehension", 300)).toBeGreaterThan(base);
  });
  it("the final WPM leaves out paused time", () => {
    const clock = new ActiveClock();
    clock.start(0);
    clock.pause(10_000);
    clock.resume(40_000); // 30 s paused
    expect(clock.elapsed(30_000 + 30_000)).toBe(30_000);
    clock.pause(60_000);
    expect(clock.paused).toBe(true);
    expect(clock.elapsed(99_000)).toBe(30_000);
    // 90 words in 30 s of reading = 180 WPM (not 90 words in 60 s).
    expect(wpmFrom(90, clock.elapsed(99_000))).toBe(180);
  });
  it("one font size for the whole passage, so every word fits the box", () => {
    const px = rsvpFontPx(["a", "comprehension", "understanding"], 320, "en");
    expect(px).toBeGreaterThanOrEqual(20);
    expect(px).toBeLessThanOrEqual(44);
    expect(rsvpFontPx(["a", "is"], 320, "en")).toBe(44);
    // Hindi words like "विद्यार्थी", "स्मृति", "प्रश्न" are centred whole and still fit.
    const hi = rsvpFontPx(["विद्यार्थी", "स्मृति", "प्रश्न"], 320, "hi");
    expect(hi).toBeGreaterThanOrEqual(20);
    expect(hi).toBeLessThanOrEqual(44);
  });
});
