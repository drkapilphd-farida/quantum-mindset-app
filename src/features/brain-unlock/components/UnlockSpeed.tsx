"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gradeReading, type SpeedGrade } from "../actions";
import type { BuCopy } from "../copy";
import type { PublicPassage } from "../passages";
import { pacerStartWpm, speedOutcome, wpmFrom } from "../scoring";
import { Questions } from "./Questions";
import { useNarration } from "./useNarration";
import { Caption, primaryBtn, RevealCard, secondaryBtn, SKILL } from "./ui";

// Unlock 1: teach (voice + text) → Sharp Reading Mode on a NEW passage with a
// moving highlight, starting at 1.6 × the reader's own baseline (200–450 WPM),
// Slower / Faster any time → 2 required questions → the real result. The
// "after" speed counts only with at least 1 of 2 right (scoring.ts).

export type SpeedResult = {
  sharpMs: number;
  sharpAnswers: number[];
  grade: SpeedGrade;
};

const CHUNK = 3;
const STEP = 30;
const MIN = 150;
const MAX = 600;

export function UnlockSpeed({
  c,
  lang,
  muted,
  baselineWpm,
  checkPassageId,
  checkAnswers,
  passage,
  continueLabel,
  onDone,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  muted: boolean;
  baselineWpm: number;
  checkPassageId: string;
  checkAnswers: number[];
  passage: PublicPassage;
  continueLabel: string;
  onDone: (r: SpeedResult, line: { text: string; good: boolean }) => void;
}): React.JSX.Element {
  const [phase, setPhase] = useState<
    "teach" | "ready" | "run" | "questions" | "reveal"
  >("teach");
  const [wpm, setWpm] = useState(() => pacerStartWpm(baselineWpm));
  const [at, setAt] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{
    result: SpeedResult;
    line: string;
    sub: string;
    good: boolean;
  } | null>(null);
  const startWpm = useMemo(() => pacerStartWpm(baselineWpm), [baselineWpm]);
  const words = useMemo(() => passage.text.split(/\s+/u), [passage.text]);
  const runStart = useRef(0);
  const runMs = useRef(0);
  const wpmRef = useRef(wpm);
  wpmRef.current = wpm;
  const voice = useNarration(lang, muted);

  useEffect(() => {
    if (phase !== "teach") return;
    void voice
      .play([{ id: "speed-teach", text: c.speed.teach }])
      .then(() => setPhase((p) => (p === "teach" ? "ready" : p)));
    // play once on entering the teach step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // The pacer clock: one chunk of 3 words at the current speed.
  useEffect(() => {
    if (phase !== "run") return undefined;
    if (at >= words.length) {
      runMs.current = Math.round(performance.now() - runStart.current);
      setPhase("questions");
      return undefined;
    }
    const t = window.setTimeout(
      () => setAt((i) => i + CHUNK),
      (CHUNK * 60_000) / wpmRef.current,
    );
    return () => window.clearTimeout(t);
  }, [phase, at, words.length]);

  async function submit(answers: number[]): Promise<void> {
    setPending(true);
    setError(null);
    const res = await gradeReading({
      checkPassageId,
      checkAnswers,
      sharpPassageId: passage.id,
      sharpAnswers: answers,
    });
    setPending(false);
    if (!res.ok) return setError(res.error);
    const afterWpm = wpmFrom(passage.wordCount, runMs.current);
    const before = {
      wpm: baselineWpm,
      correct: res.grade.checkCorrect,
      total: res.grade.checkTotal,
    };
    const after = {
      wpm: afterWpm,
      correct: res.grade.sharpCorrect,
      total: res.grade.sharpTotal,
    };
    const o = speedOutcome(before, after);
    const line =
      o === "improved"
        ? c.speed.improved(baselineWpm, afterWpm)
        : o === "same_or_lower"
          ? c.speed.flat(baselineWpm, afterWpm)
          : c.speed.notCounted(afterWpm, baselineWpm);
    setOutcome({
      result: {
        sharpMs: runMs.current,
        sharpAnswers: answers,
        grade: res.grade,
      },
      line,
      sub: o === "improved" ? c.sawIt : c.kind,
      good: o === "improved",
    });
    setPhase("reveal");
  }

  return (
    <section className="flex flex-col gap-5" data-bu-speed={phase}>
      <h2 className="text-2xl text-foreground">{c.speed.title}</h2>

      {(phase === "teach" || phase === "ready") && (
        <>
          <div className="play-card flex flex-col items-center gap-3 p-5 text-center">
            <span className="text-5xl" aria-hidden="true">
              👀💡
            </span>
            <Caption text={voice.caption ?? c.speed.teach} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-base font-bold text-foreground">
              {c.speed.modeTitle}
            </p>
            <p className="text-base text-muted-foreground">
              {c.speed.modeHint(startWpm)}
            </p>
          </div>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => {
              voice.stop();
              setAt(0);
              runStart.current = performance.now();
              setPhase("run");
            }}
            data-bu-go
          >
            {c.speed.start}
          </button>
        </>
      )}

      {phase === "run" && (
        <>
          <article
            className="play-paper rounded-2xl border border-border px-5 py-6 text-[1.125rem] leading-[1.9] shadow-sm"
            data-bu-pacer
            aria-live="off"
          >
            {words.map((w, i) => {
              const lit = i >= at && i < at + CHUNK;
              return (
                <span
                  key={i}
                  className={`rounded px-0.5 transition-colors duration-150 ${lit ? "bg-[#fde68a] text-[#1b1b2f]" : i < at ? "text-[#1b1b2f]/45" : ""}`}
                >
                  {w}{" "}
                </span>
              );
            })}
          </article>
          <div className="grid grid-cols-3 items-center gap-2">
            <button
              type="button"
              className={`${secondaryBtn} px-2 text-sm whitespace-nowrap`}
              onClick={() => setWpm((v) => Math.max(MIN, v - STEP))}
              data-bu-slower
            >
              {c.speed.slower}
            </button>
            <p
              className="text-center font-heading text-xl text-foreground tabular-nums"
              style={{ color: SKILL.speed }}
            >
              {wpm} WPM
            </p>
            <button
              type="button"
              className={`${secondaryBtn} px-2 text-sm whitespace-nowrap`}
              onClick={() => setWpm((v) => Math.min(MAX, v + STEP))}
              data-bu-faster
            >
              {c.speed.faster}
            </button>
          </div>
        </>
      )}

      {phase === "questions" && (
        <Questions
          questions={passage.questions}
          intro={c.speed.questions}
          counter={c.speed.q}
          nextLabel={c.speed.next}
          finalLabel={c.speed.reveal}
          pending={pending}
          onSubmit={(a) => void submit(a)}
        />
      )}
      {error !== null && (
        <p
          role="alert"
          className="rounded-xl px-4 py-3 text-base text-foreground"
          style={{ background: "var(--play-warn-bg)" }}
        >
          {error}
        </p>
      )}

      {phase === "reveal" && outcome !== null && (
        <>
          <RevealCard
            colour={SKILL.speed}
            line={outcome.line}
            sub={outcome.sub}
            good={outcome.good}
            muted={muted}
            lang={lang}
          />
          <button
            type="button"
            className={primaryBtn}
            onClick={() =>
              onDone(outcome.result, { text: outcome.line, good: outcome.good })
            }
            data-bu-continue
          >
            {continueLabel}
          </button>
        </>
      )}
    </section>
  );
}
