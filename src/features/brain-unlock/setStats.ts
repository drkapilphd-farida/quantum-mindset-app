// Average score per word set and passage (/admin/brain-unlock-funnel), so a
// set that is harder than the others stands out. Pure — tested.
import { setsFromDetails } from "./sets";

type RunNumbers = {
  speedBefore?: { wpm?: number; correct?: number; total?: number };
  speedAfter?: { wpm?: number; correct?: number; total?: number };
  speedCounted?: boolean;
  memoryBefore?: number;
  memoryForward?: number;
};

export type SetStatRow = {
  id: string;
  n: number;
  /** The main number for this kind (memory /5, or % correct for passages). */
  avg: number;
  /** Extra: average WPM for passages, null for word sets. */
  wpm: number | null;
  /** At least 5 people and 15% or more below the overall average. */
  harder: boolean;
};

export type SetStats = {
  check: SetStatRow[];
  story: SetStatRow[];
  checkPassage: SetStatRow[];
  sharpPassage: SetStatRow[];
};

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

function rowsOf(
  samples: Map<string, { main: number[]; wpm: number[] }>,
  withWpm: boolean,
): SetStatRow[] {
  const all = [...samples.values()].flatMap((x) => x.main);
  const overall =
    all.length === 0 ? 0 : all.reduce((a, b) => a + b, 0) / all.length;
  const avg = (xs: number[]): number =>
    xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
  return [...samples.entries()]
    .map(([id, x]) => {
      const a = avg(x.main);
      return {
        id,
        n: x.main.length,
        avg: Math.round(a * 10) / 10,
        wpm: withWpm && x.wpm.length > 0 ? Math.round(avg(x.wpm)) : null,
        harder: x.main.length >= 5 && overall > 0 && a <= overall * 0.85,
      };
    })
    .sort((p, q) => p.id.localeCompare(q.id));
}

/** From saved leads' details (sets + runs, in the same order). */
export function buildSetStats(details: readonly unknown[]): SetStats {
  const make = (): Map<string, { main: number[]; wpm: number[] }> => new Map();
  const check = make();
  const story = make();
  const checkPassage = make();
  const sharpPassage = make();
  const add = (
    m: Map<string, { main: number[]; wpm: number[] }>,
    id: string,
    main: number | null,
    wpm: number | null = null,
  ): void => {
    if (main === null) return;
    const x = m.get(id) ?? { main: [], wpm: [] };
    x.main.push(main);
    if (wpm !== null) x.wpm.push(wpm);
    m.set(id, x);
  };
  const pct = (c: unknown, t: unknown): number | null => {
    const cc = num(c);
    const tt = num(t);
    return cc === null || tt === null || tt <= 0 ? null : (cc / tt) * 100;
  };
  for (const d of details) {
    const sets = setsFromDetails(d);
    const runs =
      typeof d === "object" &&
      d !== null &&
      Array.isArray((d as { runs?: unknown }).runs)
        ? (d as { runs: RunNumbers[] }).runs
        : [];
    sets.forEach((s, i) => {
      const r = runs[i];
      if (r === undefined) return;
      add(check, s.checkSet, num(r.memoryBefore));
      add(story, s.storySet, num(r.memoryForward));
      add(
        checkPassage,
        s.checkPassageId,
        pct(r.speedBefore?.correct, r.speedBefore?.total),
        num(r.speedBefore?.wpm),
      );
      add(
        sharpPassage,
        s.sharpPassageId,
        pct(r.speedAfter?.correct, r.speedAfter?.total),
        num(r.speedAfter?.wpm),
      );
    });
  }
  return {
    check: rowsOf(check, false),
    story: rowsOf(story, false),
    checkPassage: rowsOf(checkPassage, true),
    sharpPassage: rowsOf(sharpPassage, true),
  };
}
