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
import { CHECK_WORDS, STORY_WORDS } from "./words";

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
    check.lang !== sharp.lang
  )
    throw new InvalidRunError("unknown passage");
  const checkIds = CHECK_WORDS[run.wordSet].targets.map((w) => w.id);
  const storyIds = STORY_WORDS[run.wordSet].targets.map((w) => w.id);
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
