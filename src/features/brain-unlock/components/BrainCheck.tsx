"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { BuCopy } from "../copy";
import type { PublicPassage } from "../passages";
import { MEMORY_TOTAL, shuffledGrid, type FocusRun } from "../scoring";
import { CHECK_WORDS, type BuWord, type WordSet } from "../words";
import { FocusGrid } from "./FocusGrid";
import { Questions } from "./Questions";
import { primaryBtn, SKILL } from "./ui";

// Step 2: the ≈60-second baseline. Read a short passage (timed in the
// browser, Done when finished) + 1 question; 5 words for 2 s each, then pick
// them from 10; a 4×4 grid, 1–16. No score is shown (keeps the curiosity).

export type CheckResult = {
  checkMs: number;
  checkAnswers: number[];
  memoryPicked: string[];
  focusBefore: FocusRun;
  gridBefore: number[];
};

const WORD_MS = 2000;

function shuffle<T>(xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function BrainCheck({
  c,
  lang,
  passage,
  wordSet,
  muted,
  onDone,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  passage: PublicPassage;
  wordSet: WordSet;
  muted: boolean;
  onDone: (r: CheckResult) => void;
}): React.JSX.Element {
  type Phase =
    | "intro"
    | "read"
    | "question"
    | "memIntro"
    | "memShow"
    | "memPick"
    | "focusIntro"
    | "focus";
  const [phase, setPhase] = useState<Phase>("intro");
  const result = useRef<Partial<CheckResult>>({});
  const readStart = useRef(0);
  const grid = useMemo(() => shuffledGrid(), []);
  const words = CHECK_WORDS[wordSet];
  const pickList = useMemo(
    () => shuffle([...words.targets, ...words.others]),
    [words],
  );

  return (
    <section className="flex flex-col gap-5" data-bu-check={phase}>
      {phase === "intro" && (
        <div className="play-card flex flex-col gap-4 p-6 text-center">
          <span
            className="mx-auto flex size-14 items-center justify-center rounded-2xl text-3xl text-white"
            style={{ background: SKILL.check }}
            aria-hidden="true"
          >
            🧪
          </span>
          <p className="text-lg font-semibold text-foreground">
            {c.check.intro}
          </p>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => setPhase("read")}
            data-bu-go
          >
            {c.check.startReading}
          </button>
        </div>
      )}

      {phase === "read" && (
        <ReadOnce
          c={c}
          text={passage.text}
          onStart={() => (readStart.current = performance.now())}
          onDone={() => {
            result.current.checkMs = Math.round(
              performance.now() - readStart.current,
            );
            setPhase("question");
          }}
        />
      )}

      {phase === "question" && (
        <Questions
          questions={passage.questions}
          intro={c.check.oneQuestion}
          counter={c.speed.q}
          nextLabel={c.speed.next}
          finalLabel={c.speed.next}
          onSubmit={(answers) => {
            result.current.checkAnswers = answers;
            setPhase("memIntro");
          }}
        />
      )}

      {phase === "memIntro" && (
        <div className="play-card flex flex-col gap-4 p-6 text-center">
          <h2 className="text-2xl text-foreground">{c.check.memoryTitle}</h2>
          <p className="text-base text-muted-foreground">
            {c.check.memoryHint}
          </p>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => setPhase("memShow")}
            data-bu-go
          >
            {c.check.show}
          </button>
        </div>
      )}

      {phase === "memShow" && (
        <ShowWords
          words={words.targets}
          lang={lang}
          onEnd={() => setPhase("memPick")}
        />
      )}

      {phase === "memPick" && (
        <PickWords
          c={c}
          list={pickList}
          lang={lang}
          onCheck={(picked) => {
            result.current.memoryPicked = picked;
            setPhase("focusIntro");
          }}
        />
      )}

      {phase === "focusIntro" && (
        <div className="play-card flex flex-col gap-4 p-6 text-center">
          <h2 className="text-2xl text-foreground">{c.check.focusTitle}</h2>
          <p className="text-base text-muted-foreground">{c.check.focusHint}</p>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => setPhase("focus")}
            data-bu-go
          >
            {c.check.go}
          </button>
        </div>
      )}

      {phase === "focus" && (
        <FocusGrid
          grid={grid}
          nextLabel={c.check.next}
          muted={muted}
          onDone={(run) => {
            const r = result.current;
            onDone({
              checkMs: r.checkMs ?? 0,
              checkAnswers: r.checkAnswers ?? [],
              memoryPicked: r.memoryPicked ?? [],
              focusBefore: run,
              gridBefore: grid,
            });
          }}
        />
      )}
    </section>
  );
}

/** The passage on paper; the clock runs from when it appears until Done. */
export function ReadOnce({
  c,
  text,
  onStart,
  onDone,
}: {
  c: BuCopy;
  text: string;
  onStart: () => void;
  onDone: () => void;
}): React.JSX.Element {
  useEffect(() => {
    onStart();
    // start once, when the passage is first shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col gap-4" data-bu-read>
      <div>
        <h2 className="text-2xl text-foreground">{c.check.speedTitle}</h2>
        <p className="text-base text-muted-foreground">{c.check.speedHint}</p>
      </div>
      <article
        className="play-paper rounded-2xl border border-border px-5 py-6 text-[1.125rem] leading-[1.8] shadow-sm"
        data-bu-passage
      >
        {text}
      </article>
      <button
        type="button"
        className={primaryBtn}
        onClick={onDone}
        data-bu-done
      >
        {c.check.done}
      </button>
    </div>
  );
}

function ShowWords({
  words,
  lang,
  onEnd,
}: {
  words: readonly BuWord[];
  lang: "en" | "hi";
  onEnd: () => void;
}): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  useEffect(() => {
    if (index >= words.length) {
      onEndRef.current();
      return undefined;
    }
    const t = window.setTimeout(() => setIndex((i) => i + 1), WORD_MS);
    return () => window.clearTimeout(t);
  }, [index, words.length]);
  const word = words[Math.min(index, words.length - 1)]!;
  return (
    <div className="flex flex-col items-center gap-5" data-bu-showing={index}>
      <div className="flex gap-2" aria-hidden="true">
        {words.map((w, i) => (
          <span
            key={w.id}
            className={`h-2.5 w-8 rounded-full ${i <= index ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>
      <div
        key={word.id}
        className="bu-pop play-card flex min-h-48 w-full items-center justify-center p-6"
      >
        <p className="font-heading text-[2.6rem] text-foreground">
          {word[lang]}
        </p>
      </div>
    </div>
  );
}

function PickWords({
  c,
  list,
  lang,
  onCheck,
}: {
  c: BuCopy;
  list: readonly BuWord[];
  lang: "en" | "hi";
  onCheck: (picked: string[]) => void;
}): React.JSX.Element {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (id: string): void =>
    setPicked((cur) =>
      cur.includes(id)
        ? cur.filter((x) => x !== id)
        : cur.length >= MEMORY_TOTAL
          ? cur
          : [...cur, id],
    );
  return (
    <div className="flex flex-col gap-4" data-bu-pick>
      <div className="flex items-end justify-between gap-2">
        <h2 className="text-xl text-foreground">{c.check.pickTitle}</h2>
        <span className="shrink-0 text-sm font-bold text-muted-foreground tabular-nums">
          {c.check.picked(picked.length)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {list.map((w) => {
          const on = picked.includes(w.id);
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(w.id)}
              className={`relative min-h-14 rounded-2xl border-2 px-3 text-lg font-semibold ${on ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-foreground"}`}
              data-bu-word={w.id}
            >
              {on && (
                <Check
                  className="absolute top-1.5 right-1.5 size-4 text-primary"
                  aria-hidden="true"
                />
              )}
              {w[lang]}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className={primaryBtn}
        disabled={picked.length === 0}
        onClick={() => onCheck(picked)}
        data-bu-check-words
      >
        {c.speed.next}
      </button>
    </div>
  );
}
