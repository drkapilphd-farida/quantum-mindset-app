import { describe, expect, it } from "vitest";
import {
  chooseSessionSets,
  EMPTY_HISTORY,
  historyOf,
  mergeHistory,
  passageKey,
  pickLeastUsed,
  setsFromDetails,
  type SessionSets,
} from "./sets";
import { CHECK_SET_IDS, STORY_SET_IDS } from "./words";

// A seeded random, so the tests are repeatable.
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

describe("choosing a session's sets", () => {
  it("one person never gets a set twice until all 6 are used, then the cycle starts again", () => {
    const rng = seeded(7);
    let history = EMPTY_HISTORY;
    const checks: string[] = [];
    const stories: string[] = [];
    for (let i = 0; i < 12; i++) {
      const [s] = chooseSessionSets({
        role: "student",
        lang: "en",
        duo: false,
        history,
        rng,
      });
      checks.push(s!.checkSet);
      stories.push(s!.storySet);
      history = mergeHistory(history, historyOf([s!]));
    }
    expect(new Set(checks.slice(0, 6)).size).toBe(6);
    expect(new Set(checks.slice(6)).size).toBe(6);
    expect(new Set(stories.slice(0, 6)).size).toBe(6);
    expect(new Set(stories.slice(6)).size).toBe(6);
  });
  it("passages: 3 per role, no repeat until all are used — the same text in the other language counts as used", () => {
    const rng = seeded(3);
    let history = EMPTY_HISTORY;
    const got: string[] = [];
    for (const lang of ["en", "hi", "en"] as const) {
      const [s] = chooseSessionSets({
        role: "parent",
        lang,
        duo: false,
        history,
        rng,
      });
      got.push(passageKey(s!.sharpPassageId));
      history = mergeHistory(history, historyOf([s!]));
    }
    expect(new Set(got).size).toBe(3);
  });
  it("the +30-day retake never repeats the last session's sets, even when all were used", () => {
    const all: SessionSets[] = CHECK_SET_IDS.map((c, i) => ({
      checkSet: c,
      storySet: STORY_SET_IDS[i]!,
      checkPassageId: "bu-student-en-check-1",
      sharpPassageId: "bu-student-en-sharp-1",
    }));
    const last = all[2]!;
    for (let seed = 1; seed < 30; seed++) {
      const [s] = chooseSessionSets({
        role: "student",
        lang: "en",
        duo: false,
        history: historyOf(all),
        exclude: historyOf([last]),
        rng: seeded(seed),
      });
      expect(s!.checkSet).not.toBe(last.checkSet);
      expect(s!.storySet).not.toBe(last.storySet);
      expect(passageKey(s!.sharpPassageId)).not.toBe(
        passageKey(last.sharpPassageId),
      );
    }
  });
  it("Duo: the child gets different word sets and the student passages", () => {
    for (let seed = 1; seed < 30; seed++) {
      const [parent, child] = chooseSessionSets({
        role: "parent",
        lang: "hi",
        duo: true,
        history: EMPTY_HISTORY,
        rng: seeded(seed),
      });
      expect(child!.checkSet).not.toBe(parent!.checkSet);
      expect(child!.storySet).not.toBe(parent!.storySet);
      expect(parent!.checkPassageId).toMatch(/^bu-parent-hi-check-/);
      expect(child!.sharpPassageId).toMatch(/^bu-student-hi-sharp-/);
    }
  });
  it("least-used wins; an excluded set is skipped unless nothing else is left", () => {
    expect(pickLeastUsed(["a", "b", "c"], ["a", "a", "b"], [], () => 0)).toBe(
      "c",
    );
    expect(pickLeastUsed(["a", "b"], [], ["a"], () => 0)).toBe("b");
    expect(pickLeastUsed(["a"], [], ["a"], () => 0)).toBe("a");
  });
  it("reads saved sets back safely (bad data is ignored)", () => {
    const good = {
      checkSet: "c3",
      storySet: "s5",
      checkPassageId: "x",
      sharpPassageId: "y",
    };
    expect(setsFromDetails({ sets: [good, { checkSet: "zz" }] })).toEqual([
      good,
    ]);
    expect(setsFromDetails(null)).toEqual([]);
  });
});
