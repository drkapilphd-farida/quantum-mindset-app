// Server only: imports the answer key (./passages). Turns a raw run into the
// real numbers — the same pure scoring the browser used for its reveal cards.
import { countCorrect, countWords, passageById } from "./passages";
import {
  buildReport,
  scoreInOrder,
  scorePicked,
  wpmFrom,
  type PlayerReport,
} from "./scoring";
import type { BuScoring } from "./settings";
import type { RawRun } from "./types";
import { CHECK_POOL, CHECK_SETS, STORY_POOL, STORY_SETS } from "./words";

export type EvaluatedRun = PlayerReport & {
  who: RawRun["who"];
  role: RawRun["role"];
};

export class InvalidRunError extends Error {}

export function evaluateRun(run: RawRun, scoring: BuScoring): EvaluatedRun {
  const check = passageById(run.checkPassageId);
  const sharp = passageById(run.sharpPassageId);
  if (
    check === null ||
    sharp === null ||
    check.kind !== "check" ||
    sharp.kind !== "sharp" ||
    check.lang !== sharp.lang ||
    check.role !== run.role ||
    sharp.role !== run.role
  )
    throw new InvalidRunError("unknown passage");
  const checkIds = CHECK_SETS[run.checkSet].map((w) => w.id);
  const storyIds = STORY_SETS[run.storySet].map((w) => w.id);
  // Only words from this set's pick screen (its 5 + the pool) are accepted.
  const checkOk = new Set([...checkIds, ...CHECK_POOL.map((w) => w.id)]);
  const storyOk = new Set([...storyIds, ...STORY_POOL.map((w) => w.id)]);
  if (
    !run.memoryPicked.every((id) => checkOk.has(id)) ||
    ![...run.storyForward, ...run.storyBackward].every((id) => storyOk.has(id))
  )
    throw new InvalidRunError("unknown word");
  const report = buildReport(
    {
      speedBefore: {
        wpm: wpmFrom(countWords(check.text), run.checkMs),
        correct: countCorrect(check, run.checkAnswers),
        total: check.questions.length,
      },
      speedAfter: {
        wpm: wpmFrom(countWords(sharp.text), run.sharpMs),
        correct: countCorrect(sharp, run.sharpAnswers),
        total: sharp.questions.length,
      },
      memoryBefore: scorePicked(run.memoryPicked, checkIds),
      memoryForward: scoreInOrder(run.storyForward, storyIds),
      memoryBackward: scoreInOrder(run.storyBackward, storyIds, true),
      focusBefore: run.focusBefore,
      focusAfter: run.focusAfter,
    },
    scoring,
  );
  return { ...report, who: run.who, role: run.role };
}
