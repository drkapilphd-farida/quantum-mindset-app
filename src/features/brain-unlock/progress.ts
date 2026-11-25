import { focusSeconds, type PlayerReport } from "./scoring";

// Brain Test v2 → WhatsApp (founder, 25 Nov 2026): the result goes to WhatsApp
// by itself, whether the person finished the test or stopped half-way. These
// are the numbers that may be sent after `phasesDone` steps — a skill's "after"
// only once its technique step is done. Pure — tested.

/** 0 speed before · 1 speed after · 2 memory before · 3 memory after · 4 focus before · 5 focus after */
export const TOTAL_PHASES = 6;

export type SkillFacts = {
  before: number;
  after?: number;
  /** Speed only: the new speed counts (enough answers right). */
  counted?: boolean;
  /** Memory only: words recalled backwards. */
  backward?: number;
};
export type ProgressFacts = {
  speed?: SkillFacts;
  memory?: SkillFacts;
  focus?: SkillFacts;
};

export function progressFacts(r: PlayerReport, phasesDone: number): ProgressFacts {
  const f: ProgressFacts = {};
  if (phasesDone >= 1)
    f.speed = {
      before: r.speedBefore.wpm,
      ...(phasesDone >= 2
        ? { after: r.speedAfterWpm, counted: r.speedCounted }
        : {}),
    };
  if (phasesDone >= 3)
    f.memory = {
      before: r.memoryBefore,
      ...(phasesDone >= 4
        ? { after: r.memoryForward, backward: r.memoryBackward }
        : {}),
    };
  if (phasesDone >= 5)
    f.focus = {
      before: focusSeconds(r.focusBefore),
      ...(phasesDone >= 6 ? { after: focusSeconds(r.focusAfter) } : {}),
    };
  return f;
}

/** The test link token the WhatsApp bot adds (?c=…): 12 letters/digits. */
export const BT_TOKEN_RE = /^[a-z2-9]{12}$/;

export function readBtToken(search: string): string | null {
  const t = new URLSearchParams(search).get("c");
  return t !== null && BT_TOKEN_RE.test(t) ? t : null;
}
