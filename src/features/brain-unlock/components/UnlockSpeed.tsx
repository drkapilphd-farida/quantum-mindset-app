"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gradeReading, type SpeedGrade } from "../actions";
import type { BuCopy } from "../copy";
import type { PublicPassage } from "../passages";
import {
  ActiveClock,
  showsFocusLetter,
  rsvpFontPx,
  rsvpStartWpm,
  rsvpWordMs,
  rsvpWords,
  splitAtFocus,
  stepWpm,
} from "../rsvp";
import { speedOutcome, wpmFrom } from "../scoring";
import { Questions } from "./Questions";
import { useNarration } from "./useNarration";
import { Caption, primaryBtn, RevealCard, secondaryBtn, SKILL } from "./ui";

// Unlock 1 (founder, 14 Nov 2026): teach (voice + text) → "Your normal speed
// → Now" → 3-2-1 → RSVP Word Flash on a NEW passage, one word at a time in a
// fixed box (English: a red focus letter at a fixed spot; Hindi: the word
// centred, no colouring), tap to pause, − / + 25 WPM → 2 required questions →
// the real result. The "after" speed counts only with at least 1 of 2 right,
// and comes from the real reading time with paused time left out.

export type SpeedResult = {
  sharpMs: number;
  sharpAnswers: number[];
  grade: SpeedGrade;
};

const RED = "#dc2626";

function FlashWord({
  word,
  fontPx,
  lang,
}: {
  word: string;
  fontPx: number;
  lang: "en" | "hi";
}): React.JSX.Element {
  const marker = (
    <span
      className="mx-auto block h-3 w-0.5 rounded bg-foreground/50"
      aria-hidden="true"
    />
  );
  if (!showsFocusLetter(lang))
    // Hindi: the whole word, normal colour, centred on the marker spot.
    return (
      <div className="flex flex-col items-center gap-2" data-bu-flash={word}>
        {marker}
        <p
          className="font-heading leading-none whitespace-nowrap text-foreground"
          style={{ fontSize: fontPx }}
        >
          {word}
        </p>
        {marker}
      </div>
    );
  const { before, focus, after } = splitAtFocus(word);
  return (
    <div className="flex w-full flex-col gap-2" data-bu-flash={word}>
      {marker}
      {/* Equal side columns keep the red letter exactly under the markers. */}
      <p
        className="grid grid-cols-[1fr_auto_1fr] font-heading leading-none whitespace-nowrap text-foreground"
        style={{ fontSize: fontPx }}
      >
        <span className="text-right">{before}</span>
        <span style={{ color: RED }} data-bu-focus-letter>
          {focus}
        </span>
        <span className="text-left">{after}</span>
      </p>
      {marker}
    </div>
  );
}

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
    "teach" | "ready" | "countdown" | "run" | "questions" | "reveal"
  >("teach");
  const startWpm = useMemo(() => rsvpStartWpm(baselineWpm), [baselineWpm]);
  const [wpm, setWpm] = useState(startWpm);
  const [at, setAt] = useState(0);
  const [count, setCount] = useState(3);
  const [paused, setPaused] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boxPx, setBoxPx] = useState(320);
  const [outcome, setOutcome] = useState<{
    result: SpeedResult;
    line: string;
    sub: string;
    good: boolean;
  } | null>(null);
  const words = useMemo(() => rsvpWords(passage.text), [passage.text]);
  const fontPx = useMemo(
    () => rsvpFontPx(words, boxPx, lang),
    [words, boxPx, lang],
  );
  const clock = useRef(new ActiveClock());
  const runMs = useRef(0);
  const box = useRef<HTMLButtonElement>(null);
  const voice = useNarration(lang, muted);

  useEffect(() => {
    if (phase !== "teach") return;
    void voice
      .play([{ id: "speed-teach", text: c.speed.teach }])
      .then(() => setPhase((p) => (p === "teach" ? "ready" : p)));
    // play once on entering the teach step
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // The box width decides the font size (every word of the passage fits).
  useEffect(() => {
    if (phase !== "countdown" && phase !== "run") return undefined;
    const el = box.current;
    if (el === null) return undefined;
    const measure = (): void => setBoxPx(el.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [phase]);

  // 3-2-1, then the clock starts with the first word.
  useEffect(() => {
    if (phase !== "countdown") return undefined;
    if (count === 0) {
      clock.current.start(performance.now());
      setAt(0);
      setPhase("run");
      return undefined;
    }
    const t = window.setTimeout(() => setCount((n) => n - 1), 800);
    return () => window.clearTimeout(t);
  }, [phase, count]);

  // One word at a time, at the current speed, with the natural rhythm.
  useEffect(() => {
    if (phase !== "run" || paused) return undefined;
    if (at >= words.length) {
      runMs.current = Math.round(clock.current.elapsed(performance.now()));
      setPhase("questions");
      return undefined;
    }
    const t = window.setTimeout(
      () => setAt((i) => i + 1),
      rsvpWordMs(words[at]!, wpm),
    );
    return () => window.clearTimeout(t);
  }, [phase, at, paused, wpm, words]);

  const togglePause = (): void => {
    const now = performance.now();
    if (paused) clock.current.resume(now);
    else clock.current.pause(now);
    setPaused(!paused);
  };

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
    <section
      className="flex flex-col gap-5"
      data-bu-speed={phase}
      data-bu-passage={passage.id}
    >
      <h2 className="text-2xl text-foreground">{c.speed.title}</h2>

      {(phase === "teach" || phase === "ready") && (
        <>
          <div className="play-card flex flex-col items-center gap-3 p-5 text-center">
            <span className="text-5xl" aria-hidden="true">
              👀⚡
            </span>
            <Caption text={voice.caption ?? c.speed.teach} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-base font-bold text-foreground">
              {c.speed.modeTitle}
            </p>
            <p
              className="font-heading text-xl text-foreground tabular-nums"
              data-bu-start-wpm={startWpm}
            >
              {c.speed.modeHint(baselineWpm, startWpm)}
            </p>
          </div>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => {
              voice.stop();
              setCount(3);
              setPhase("countdown");
            }}
            data-bu-go
          >
            {c.speed.start}
          </button>
        </>
      )}

      {(phase === "countdown" || phase === "run") && (
        <>
          <button
            ref={box}
            type="button"
            onClick={phase === "run" ? togglePause : undefined}
            className="play-paper relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-border px-2 shadow-sm"
            aria-label={paused ? c.speed.paused : c.speed.tapHint}
            data-bu-rsvp={paused ? "paused" : phase}
            data-bu-at={at}
          >
            {phase === "countdown" ? (
              <span
                className="font-heading text-6xl text-foreground"
                data-bu-countdown={count}
              >
                {count === 0 ? "" : count}
              </span>
            ) : paused ? (
              <span className="text-lg font-semibold text-muted-foreground">
                ⏸ {c.speed.paused}
              </span>
            ) : (
              <FlashWord
                word={words[Math.min(at, words.length - 1)]!}
                fontPx={fontPx}
                lang={lang}
              />
            )}
          </button>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full transition-[width] duration-200"
              style={{
                width: `${Math.round((Math.min(at, words.length) / words.length) * 100)}%`,
                background: SKILL.speed,
              }}
            />
          </div>
          <div className="grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-2">
            <button
              type="button"
              className={`${secondaryBtn} px-0 text-2xl`}
              onClick={() => setWpm((v) => stepWpm(v, -1))}
              aria-label={c.speed.slower}
              data-bu-slower
            >
              −
            </button>
            <p
              className="text-center font-heading text-xl tabular-nums"
              style={{ color: SKILL.speed }}
              data-bu-wpm={wpm}
            >
              {wpm} WPM
            </p>
            <button
              type="button"
              className={`${secondaryBtn} px-0 text-2xl`}
              onClick={() => setWpm((v) => stepWpm(v, 1))}
              aria-label={c.speed.faster}
              data-bu-faster
            >
              +
            </button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {c.speed.tapHint}
          </p>
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
