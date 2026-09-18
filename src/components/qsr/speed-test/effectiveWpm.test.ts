import { describe, expect, it } from "vitest";
import { computeEffectiveWpm } from "./effectiveWpm";

describe("computeEffectiveWpm", () => {
  it("zeroes out and marks invalid when every answer is wrong (the reported bug)", () => {
    // Observed bug: 0/2 correct still showed 1103-1106 raw WPM.
    const result = computeEffectiveWpm(1105, 0, 2);
    expect(result.effectiveWpm).toBe(0);
    expect(result.isValid).toBe(false);
  });

  it("applies a sharp quadratic penalty below the 60% retention threshold", () => {
    // 1/2 correct = 50% accuracy, below threshold -> multiplier = 0.5^2 = 0.25.
    const result = computeEffectiveWpm(400, 1, 2);
    expect(result.accuracy).toBeCloseTo(0.5);
    expect(result.multiplier).toBeCloseTo(0.25);
    expect(result.effectiveWpm).toBe(100);
    expect(result.isValid).toBe(true);
  });

  it("applies only a mild, linear scale at or above the 60% threshold", () => {
    // 2/2 correct = 100% accuracy, at/above threshold -> multiplier = accuracy = 1.
    const result = computeEffectiveWpm(400, 2, 2);
    expect(result.multiplier).toBe(1);
    expect(result.effectiveWpm).toBe(400);
  });

  it("scales a partial-but-passing score proportionally (e.g. 4/5)", () => {
    const result = computeEffectiveWpm(500, 4, 5);
    expect(result.accuracy).toBeCloseTo(0.8);
    expect(result.multiplier).toBeCloseTo(0.8);
    expect(result.effectiveWpm).toBe(400);
  });

  it("never returns a negative or NaN result for degenerate input", () => {
    expect(computeEffectiveWpm(0, 0, 2)).toEqual({ accuracy: 0, multiplier: 0, effectiveWpm: 0, isValid: false });
    expect(computeEffectiveWpm(500, 0, 0)).toEqual({ accuracy: 0, multiplier: 0, effectiveWpm: 0, isValid: false });
  });
});
