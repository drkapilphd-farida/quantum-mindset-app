import { describe, expect, it } from "vitest";
import { BU_PASSAGES, countCorrect, toPublic } from "./passages";
import {
  brainType,
  buildReport,
  focusSeconds,
  MAX_SAME_POSITIONS,
  pacerStartWpm,
  samePositions,
  scoreBand,
  scoreInOrder,
  scorePicked,
  shuffledGrid,
  speedAfterWpm,
  speedCounted,
  speedOutcome,
  teamScore,
  unlockScore,
  wpmFrom,
  type PlayerResults,
} from "./scoring";
import { DEFAULT_SETTINGS, resolveSettings } from "./settings";

const S = DEFAULT_SETTINGS.scoring;
const base: PlayerResults = {
  speedBefore: { wpm: 160, correct: 1, total: 1 },
  speedAfter: { wpm: 290, correct: 2, total: 2 },
  memoryBefore: 2,
  memoryForward: 5,
  memoryBackward: 5,
  focusBefore: { ms: 18_000, errors: 0 },
  focusAfter: { ms: 11_000, errors: 0 },
};

describe("speed", () => {
  it("WPM from words and time", () => {
    expect(wpmFrom(60, 22_500)).toBe(160);
    expect(wpmFrom(120, 0)).toBe(1500); // capped, never Infinity
  });
  it("the pacer starts at 1.6 × baseline, between 200 and 450", () => {
    expect(pacerStartWpm(160)).toBe(260);
    expect(pacerStartWpm(80)).toBe(200);
    expect(pacerStartWpm(400)).toBe(450);
  });
  it("the pacer speed counts only with at least 50 % of the questions right", () => {
    expect(speedCounted({ wpm: 290, correct: 1, total: 2 })).toBe(true);
    expect(speedCounted({ wpm: 290, correct: 0, total: 2 })).toBe(false);
    expect(
      speedAfterWpm(base.speedBefore, { wpm: 290, correct: 0, total: 2 }),
    ).toBe(160);
    expect(
      speedOutcome(base.speedBefore, { wpm: 290, correct: 0, total: 2 }),
    ).toBe("not_counted");
  });
  it('a slower "after" is reported honestly, not hidden', () => {
    expect(
      speedOutcome(
        { wpm: 320, correct: 1, total: 1 },
        { wpm: 260, correct: 2, total: 2 },
      ),
    ).toBe("same_or_lower");
    expect(
      speedAfterWpm(
        { wpm: 320, correct: 1, total: 1 },
        { wpm: 260, correct: 2, total: 2 },
      ),
    ).toBe(260);
  });
});

describe("memory", () => {
  it("Brain Check: picked words in any order; extra picks of the same word never count twice", () => {
    expect(
      scorePicked(
        ["helmet", "brick", "samosa"],
        ["helmet", "bangle", "samosa", "blanket", "scooter"],
      ),
    ).toBe(2);
    expect(scorePicked(["helmet", "helmet"], ["helmet"])).toBe(1);
  });
  it("story: right place forward, and backwards for the bonus", () => {
    const t = ["gorilla", "suitcase", "curd", "drone", "tiffin"];
    expect(scoreInOrder(t, t)).toBe(5);
    expect(
      scoreInOrder(["gorilla", "curd", "suitcase", "drone", "tiffin"], t),
    ).toBe(3);
    expect(scoreInOrder([...t].reverse(), t, true)).toBe(5);
    expect(scoreInOrder(t, t, true)).toBe(1); // only the middle word
  });
});

describe("focus grid", () => {
  it("seconds with one decimal", () =>
    expect(focusSeconds({ ms: 11_240, errors: 0 })).toBe(11.2));
  it('every grid holds 1–16 once; the "after" grid is a clearly different layout', () => {
    for (let i = 0; i < 200; i++) {
      const before = shuffledGrid();
      const after = shuffledGrid(Math.random, before);
      expect([...after].sort((a, b) => a - b)).toEqual(
        Array.from({ length: 16 }, (_, k) => k + 1),
      );
      expect(samePositions(before, after)).toBeLessThanOrEqual(
        MAX_SAME_POSITIONS,
      );
    }
  });
});

describe("Brain Unlock Score", () => {
  it('uses the "after" results and the configured bands', () => {
    // 290 WPM → 25; 5 forward × 5 + backwards 8 = 33; 11 s → 30
    expect(unlockScore(base, S)).toEqual({
      speed: 25,
      memory: 33,
      focus: 30,
      total: 88,
    });
    expect(scoreBand(88, S).en).toBe("Brilliant");
    expect(scoreBand(40, S).en).toBe("Ready to grow");
  });
  it("an uncounted pacer run scores the reader’s own baseline speed", () => {
    expect(
      unlockScore(
        { ...base, speedAfter: { wpm: 450, correct: 0, total: 2 } },
        S,
      ).speed,
    ).toBe(14); // 160 WPM
  });
  it("wrong taps add penalty seconds; very slow grids get the floor", () => {
    expect(
      unlockScore({ ...base, focusAfter: { ms: 13_500, errors: 1 } }, S).focus,
    ).toBe(25); // 14.5 s
    expect(
      unlockScore({ ...base, focusAfter: { ms: 90_000, errors: 0 } }, S).focus,
    ).toBe(S.focusFloor);
  });
  it("bands from admin settings are used", () => {
    const custom = {
      ...S,
      speedBands: [
        { minWpm: 0, points: 0 },
        { minWpm: 100, points: 40 },
      ],
    };
    expect(unlockScore(base, custom).speed).toBe(40);
  });
  it("Duo Mode Team Score is the average", () => {
    expect(
      teamScore(
        { speed: 0, memory: 0, focus: 0, total: 80 },
        { speed: 0, memory: 0, focus: 0, total: 61 },
      ),
    ).toBe(71);
  });
});

describe("Brain Type", () => {
  const type = (r: PlayerResults): string => brainType(r, unlockScore(r, S), S);
  it("biggest jump in speed → Hidden Sprinter", () => {
    expect(
      type({
        ...base,
        memoryBefore: 4,
        memoryForward: 5,
        speedAfter: { wpm: 400, correct: 1, total: 2 },
      }),
    ).toBe("sprinter");
  });
  it("biggest jump in memory → Memory Magician", () =>
    expect(
      type({
        ...base,
        memoryBefore: 0,
        speedAfter: { wpm: 200, correct: 1, total: 2 },
      }),
    ).toBe("magician"));
  it("biggest jump in focus → Laser Mind", () => {
    expect(
      type({
        ...base,
        memoryBefore: 5,
        speedAfter: { wpm: 170, correct: 1, total: 2 },
        focusBefore: { ms: 30_000, errors: 2 },
        focusAfter: { ms: 12_000, errors: 0 },
      }),
    ).toBe("laser");
  });
  it("real gains but a scattered grid → Distracted Genius", () =>
    expect(type({ ...base, focusAfter: { ms: 20_000, errors: 4 } })).toBe(
      "genius",
    ));
  it("all reading questions right with a small speed jump → Deep Diver", () => {
    expect(
      type({
        ...base,
        memoryBefore: 5,
        speedAfter: { wpm: 180, correct: 2, total: 2 },
        focusAfter: { ms: 18_000, errors: 0 },
      }),
    ).toBe("diver");
  });
  it("no jump anywhere → strongest area", () => {
    const flat: PlayerResults = {
      ...base,
      speedBefore: { wpm: 200, correct: 0, total: 1 },
      speedAfter: { wpm: 190, correct: 1, total: 2 },
      memoryBefore: 5,
      memoryForward: 5,
      memoryBackward: 5,
      focusBefore: { ms: 10_000, errors: 0 },
      focusAfter: { ms: 12_000, errors: 0 },
    };
    expect(["magician", "laser", "diver"]).toContain(type(flat));
  });
  it("the report carries the counted speed and the type", () => {
    const r = buildReport(base, S);
    expect(r.speedCounted).toBe(true);
    expect(r.speedAfterWpm).toBe(290);
    expect(r.brainType).toBeDefined();
  });
});

describe("passages", () => {
  it("every role × language has a ~60-word check (1 question) and a different ~120-word sharp passage (2 questions)", () => {
    for (const role of ["parent", "student", "professional"] as const)
      for (const lang of ["en", "hi"] as const) {
        const check = BU_PASSAGES.find(
          (p) => p.role === role && p.lang === lang && p.kind === "check",
        )!;
        const sharp = BU_PASSAGES.find(
          (p) => p.role === role && p.lang === lang && p.kind === "sharp",
        )!;
        expect(check.questions).toHaveLength(1);
        expect(sharp.questions).toHaveLength(2);
        expect(toPublic(check).wordCount).toBeGreaterThanOrEqual(50);
        expect(toPublic(check).wordCount).toBeLessThanOrEqual(80);
        expect(toPublic(sharp).wordCount).toBeGreaterThanOrEqual(105);
        expect(toPublic(sharp).wordCount).toBeLessThanOrEqual(160);
        expect(sharp.text).not.toBe(check.text);
        expect(sharp.text.slice(0, 40)).not.toBe(check.text.slice(0, 40));
      }
  });
  it("the browser copy has no answer key", () => {
    for (const p of BU_PASSAGES)
      expect(JSON.stringify(toPublic(p))).not.toContain("correctIndex");
  });
  it("answers are checked on the server key", () => {
    const p = BU_PASSAGES.find((x) => x.kind === "sharp")!;
    expect(
      countCorrect(
        p,
        p.questions.map((q) => q.correctIndex),
      ),
    ).toBe(2);
    expect(countCorrect(p, [-1, -1])).toBe(0);
  });
});

describe("settings", () => {
  it("missing or broken saved settings fall back to the defaults", () => {
    expect(resolveSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(resolveSettings({ introVideoId: "not a valid id!" })).toEqual(
      DEFAULT_SETTINGS,
    );
  });
  it("saved fields override the defaults; the rest stay", () => {
    const s = resolveSettings({
      introVideoId: "abcdefghijk",
      nextBatch: { date: "2026-12-01", seatsLeft: 12 },
    });
    expect(s.introVideoId).toBe("abcdefghijk");
    expect(s.nextBatch).toEqual({ date: "2026-12-01", seatsLeft: 12 });
    expect(s.scoring).toEqual(DEFAULT_SETTINGS.scoring);
  });
});

describe("language from the ad campaign", () => {
  it("_en → English, _hi → Hindi, otherwise none", async () => {
    const { langFromCampaign } = await import("./types");
    expect(langFromCampaign("sb_free_test_en")).toBe("en");
    expect(langFromCampaign("sb_free_test_hi")).toBe("hi");
    expect(langFromCampaign("SB_HI_parents")).toBe("hi");
    expect(langFromCampaign("ship_it")).toBeNull();
    expect(langFromCampaign(undefined)).toBeNull();
  });
});
