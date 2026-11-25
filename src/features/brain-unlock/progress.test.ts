import { describe, expect, it } from "vitest";
import { progressFacts, readBtToken } from "./progress";
import { cardRows } from "./progressCard";
import type { PlayerReport } from "./scoring";

const report = {
  speedBefore: { wpm: 180, correct: 2, total: 2 },
  speedAfterWpm: 250,
  speedCounted: true,
  memoryBefore: 2,
  memoryForward: 5,
  memoryBackward: 5,
  focusBefore: { ms: 30_000, errors: 0 },
  focusAfter: { ms: 21_000, errors: 0 },
} as unknown as PlayerReport;

describe("progressFacts", () => {
  it("only the speed 'before' after step 1", () => {
    expect(progressFacts(report, 1)).toEqual({ speed: { before: 180 } });
  });
  it("speed before → after, memory before, after step 3", () => {
    expect(progressFacts(report, 3)).toEqual({
      speed: { before: 180, after: 250, counted: true },
      memory: { before: 2 },
    });
  });
  it("everything when finished", () => {
    const f = progressFacts(report, 6);
    expect(f.memory).toEqual({ before: 2, after: 5, backward: 5 });
    expect(f.focus?.after).toBeLessThan(f.focus?.before ?? 0);
  });
});

describe("readBtToken", () => {
  it("reads a valid bot token", () => {
    expect(readBtToken("?utm_source=meta&c=ab2cd3ef4gh5")).toBe("ab2cd3ef4gh5");
  });
  it("ignores missing or odd tokens", () => {
    expect(readBtToken("?c=short")).toBeNull();
    expect(readBtToken("?c=AB2CD3EF4GH5")).toBeNull();
    expect(readBtToken("")).toBeNull();
  });
});

describe("cardRows", () => {
  it("half-way: done rows with numbers, the rest marked as left", () => {
    const rows = cardRows(progressFacts(report, 3), "hi");
    expect(rows[0]?.badge).toBe("+39%");
    expect(rows[1]?.main).toBe("2/5 → ?");
    expect(rows[2]?.pending).toBe(true);
  });
  it("finished: memory and focus gains", () => {
    const rows = cardRows(progressFacts(report, 6), "en");
    expect(rows[1]?.badge).toBe("+3");
    expect(rows[2]?.badge).toBe("9s faster");
  });
  it("speed that did not count shows no gain", () => {
    const rows = cardRows({ speed: { before: 180, after: 400, counted: false } }, "en");
    expect(rows[0]?.good).toBe(false);
    expect(rows[0]?.main).toBe("180 words/min");
  });
});
