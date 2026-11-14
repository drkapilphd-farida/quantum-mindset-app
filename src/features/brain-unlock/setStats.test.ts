import { describe, expect, it } from "vitest";
import { buildSetStats } from "./setStats";

const lead = (
  checkSet: string,
  storySet: string,
  before: number,
  forward: number,
  correct = 2,
): Record<string, unknown> => ({
  sets: [
    {
      checkSet,
      storySet,
      checkPassageId: "bu-parent-en-check-1",
      sharpPassageId: "bu-parent-en-sharp-2",
    },
  ],
  runs: [
    {
      memoryBefore: before,
      memoryForward: forward,
      speedBefore: { wpm: 160, correct: 1, total: 1 },
      speedAfter: { wpm: 240, correct, total: 2 },
    },
  ],
});

describe("average score per set (admin)", () => {
  it("averages each set and passage", () => {
    const s = buildSetStats([
      lead("c1", "s2", 2, 5),
      lead("c1", "s2", 4, 3, 1),
      lead("c3", "s4", 3, 4),
    ]);
    expect(s.check.find((r) => r.id === "c1")).toMatchObject({ n: 2, avg: 3 });
    expect(s.story.find((r) => r.id === "s2")).toMatchObject({ n: 2, avg: 4 });
    expect(s.sharpPassage[0]).toMatchObject({
      id: "bu-parent-en-sharp-2",
      n: 3,
      wpm: 240,
    });
    expect(Math.round(s.sharpPassage[0]!.avg)).toBe(83);
  });
  it("marks a set that is clearly harder (5+ people, 15% below the overall average)", () => {
    const rows = [
      ...Array.from({ length: 5 }, () => lead("c2", "s1", 1, 4)),
      ...Array.from({ length: 5 }, () => lead("c5", "s3", 4, 4)),
    ];
    const s = buildSetStats(rows);
    expect(s.check.find((r) => r.id === "c2")!.harder).toBe(true);
    expect(s.check.find((r) => r.id === "c5")!.harder).toBe(false);
  });
  it("ignores leads without sets", () => {
    expect(buildSetStats([{}, null, { runs: [] }]).check).toEqual([]);
  });
});
