// Which word sets and passages a session gets (founder, 14 Nov 2026). Pure:
// the server action gathers the person's history (same device, phone or
// email, plus the browser's own memory) and this picks.
//
// - Random among the sets this person has used the FEWEST times, so no set
//   repeats until all are used; then the cycle starts again.
// - The +30-day retake (and any "exclude" list) never gets the same sets.
// - Duo Mode: the child never gets the parent's sets (and reads the student passages).
// - A passage and its translation count as the same passage (bu-parent-en-check-2
//   = bu-parent-hi-check-2), so switching language never repeats a text.
import { passagesFor, type BuRole } from "./passages";
import {
  CHECK_SET_IDS,
  STORY_SET_IDS,
  type CheckSetId,
  type StorySetId,
} from "./words";

export type SessionSets = {
  checkSet: CheckSetId;
  storySet: StorySetId;
  checkPassageId: string;
  sharpPassageId: string;
};

/** Everything a person has been given before (repeats allowed: they count). */
export type SetHistory = {
  check: readonly string[];
  story: readonly string[];
  passages: readonly string[];
};

export const EMPTY_HISTORY: SetHistory = { check: [], story: [], passages: [] };

/** The same text in either language. */
export const passageKey = (id: string): string => id.replace(/-(en|hi)-/, "-");

/** Random among the least-used options, never one in `exclude` (unless nothing else is left). */
export function pickLeastUsed<T extends string>(
  all: readonly T[],
  used: readonly string[],
  exclude: readonly string[] = [],
  rng: () => number = Math.random,
  key: (v: string) => string = (v) => v,
): T {
  const ex = new Set(exclude.map(key));
  const open = all.filter((v) => !ex.has(key(v)));
  const pool = open.length > 0 ? open : [...all];
  const count = (v: string): number =>
    used.reduce((n, u) => n + (key(u) === key(v) ? 1 : 0), 0);
  const least = Math.min(...pool.map(count));
  const best = pool.filter((v) => count(v) === least);
  return best[Math.floor(rng() * best.length)] ?? pool[0]!;
}

export function mergeHistory(...hs: readonly SetHistory[]): SetHistory {
  return {
    check: hs.flatMap((h) => h.check),
    story: hs.flatMap((h) => h.story),
    passages: hs.flatMap((h) => h.passages),
  };
}

export function historyOf(sets: readonly SessionSets[]): SetHistory {
  return {
    check: sets.map((s) => s.checkSet),
    story: sets.map((s) => s.storySet),
    passages: sets.flatMap((s) => [s.checkPassageId, s.sharpPassageId]),
  };
}

/** The sets for one session: one player, or parent + child in Duo Mode. */
export function chooseSessionSets(input: {
  role: BuRole;
  lang: "en" | "hi";
  duo: boolean;
  history: SetHistory;
  /** Sets that must not come again now (the retake's last session). */
  exclude?: SetHistory;
  rng?: () => number;
}): SessionSets[] {
  const rng = input.rng ?? Math.random;
  const ex = input.exclude ?? EMPTY_HISTORY;
  const players: BuRole[] = input.duo ? ["parent", "student"] : [input.role];
  const out: SessionSets[] = [];
  for (const role of players) {
    const taken = historyOf(out); // the parent's sets, for the child
    const ids = (kind: "check" | "sharp"): string[] =>
      passagesFor(role, input.lang, kind).map((x) => x.id);
    out.push({
      checkSet: pickLeastUsed(
        CHECK_SET_IDS,
        input.history.check,
        [...ex.check, ...taken.check],
        rng,
      ),
      storySet: pickLeastUsed(
        STORY_SET_IDS,
        input.history.story,
        [...ex.story, ...taken.story],
        rng,
      ),
      checkPassageId: pickLeastUsed(
        ids("check"),
        input.history.passages,
        ex.passages,
        rng,
        passageKey,
      ),
      sharpPassageId: pickLeastUsed(
        ids("sharp"),
        input.history.passages,
        ex.passages,
        rng,
        passageKey,
      ),
    });
  }
  return out;
}

/** Sets saved with a lead (details.sets), read back safely. */
export function setsFromDetails(details: unknown): SessionSets[] {
  if (typeof details !== "object" || details === null) return [];
  const raw = (details as { sets?: unknown }).sets;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (s): s is SessionSets =>
      typeof s === "object" &&
      s !== null &&
      (CHECK_SET_IDS as readonly string[]).includes(
        (s as SessionSets).checkSet,
      ) &&
      (STORY_SET_IDS as readonly string[]).includes(
        (s as SessionSets).storySet,
      ) &&
      typeof (s as SessionSets).checkPassageId === "string" &&
      typeof (s as SessionSets).sharpPassageId === "string",
  );
}
