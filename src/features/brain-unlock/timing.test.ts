import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { buCopy } from "../brain-unlock/copy";
import {
  cheerCount,
  FOCUS_EXERCISE_MS,
  PHASE_SECONDS,
  progressFraction,
  secondsLeft,
} from "./timing";

// Founder (15 Nov 2026): shorter steps; the promise is "5 minutes".
describe("Brain Unlock timing", () => {
  it("the focus exercise is 20 seconds (was 30)", () => {
    expect(FOCUS_EXERCISE_MS).toBe(20_000);
  });

  it("the time-left estimate adds up to about 5 minutes for one player, twice that for Duo", () => {
    const total = PHASE_SECONDS.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(270);
    expect(total).toBeLessThanOrEqual(330);
    expect(secondsLeft(0, 0, 1)).toBe(total);
    expect(secondsLeft(0, 0, 2)).toBe(total * 2);
    // Duo, Memory, child's turn: the child's Memory + both players' Focus.
    expect(secondsLeft(2, 1, 2)).toBe(PHASE_SECONDS[2] + PHASE_SECONDS[3] * 2);
    expect(secondsLeft(3, 0, 1)).toBe(PHASE_SECONDS[3]);
  });

  it("the bar only moves forward", () => {
    const steps = [0, 1, 2, 3].map((p) => progressFraction(p, 0, 1));
    expect(steps[0]).toBe(0);
    for (let i = 1; i < steps.length; i++) expect(steps[i]!).toBeGreaterThan(steps[i - 1]!);
    expect(steps[3]!).toBeLessThan(1);
  });

  it("time-left lines read naturally in both languages", () => {
    expect(buCopy.en.progress.timeLeft(secondsLeft(0, 0, 1))).toBe("About 5 minutes left");
    expect(buCopy.hi.progress.timeLeft(secondsLeft(0, 0, 1))).toBe("लगभग 5 मिनट बाकी");
    expect(buCopy.en.progress.timeLeft(120)).toBe("About 2 minutes left");
    expect(buCopy.en.progress.timeLeft(60)).toBe("About 1 minute left");
    expect(buCopy.en.progress.timeLeft(30)).toBe("Almost done!");
    expect(buCopy.hi.progress.timeLeft(120)).toBe("लगभग 2 मिनट बाकी");
  });

  it("cheers between unlocks: 1 of 3 before Memory, 2 of 3 before Focus", () => {
    expect([0, 1, 2, 3].map(cheerCount)).toEqual([null, null, 1, 2]);
    expect(buCopy.en.progress.cheer(2)).toBe("2 of 3 done! 🔥");
    expect(buCopy.hi.progress.cheer(2)).toBe("3 में से 2 पूरे! 🔥");
  });

  it("the memory story no longer plays the replay line (no waiting at the end)", () => {
    const src = fs.readFileSync("src/features/brain-unlock/components/UnlockMemory.tsx", "utf8");
    expect(src).not.toContain('"memory-replay"');
  });

  it("the memory audio (teach + story lines + short pauses) is under 60 seconds for every story", async () => {
    const { STORY_SET_IDS, storyLineId } = await import("./words");
    for (const lang of ["en", "hi"]) {
      const m = JSON.parse(fs.readFileSync(`public/audio/brain-unlock/${lang}/manifest.json`, "utf8")) as {
        lines: Record<string, { durationMs: number }>;
      };
      const sec = (id: string): number => (m.lines[id]?.durationMs ?? Number.NaN) / 1000;
      for (const set of STORY_SET_IDS) {
        const total = sec("memory-teach") + [1, 2, 3, 4, 5].reduce((a, n) => a + sec(storyLineId(set, n)) + 0.25, 0);
        expect(total, `${lang} ${set}`).toBeLessThan(60);
      }
    }
  });
});

describe("the promise is “5 minutes” everywhere (founder, 15 Nov 2026)", () => {
  it("no Brain Unlock text, message, email, voice line or SEO says 4 minutes", () => {
    const files = [
      "src/features/brain-unlock/copy.ts",
      "src/features/brain-unlock/messages.ts",
      "src/features/brain-unlock/script/en.json",
      "src/features/brain-unlock/script/hi.json",
      "public/audio/brain-unlock/en/manifest.json",
      "public/audio/brain-unlock/hi/manifest.json",
      "src/lib/email/sendBrainUnlockEmails.ts",
      "src/app/reading-memory-test/page.tsx",
    ];
    for (const f of files) {
      const text = fs.readFileSync(f, "utf8").replace(/"heard": "[^"]*"/g, "");
      expect(text, f).not.toMatch(/\b4[ -]?min|four min|चार मिनट|4 मिनट/i);
    }
    expect(buCopy.en.promise.title).toContain("5 minutes");
    expect(buCopy.hi.promise.title).toContain("5 मिनट");
  });
});
