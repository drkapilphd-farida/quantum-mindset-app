"use client";

import { useEffect, useMemo, useState } from "react";
import type { BuCopy } from "../copy";
import { focusSeconds, shuffledGrid, type FocusRun } from "../scoring";
import { voiceText } from "../voiceLines";
import { FocusGrid } from "./FocusGrid";
import { useNarration } from "./useNarration";
import { Caption, primaryBtn, RevealCard, SKILL } from "./ui";

// Unlock 3: a 30-second guided focus exercise — gaze softly at a glowing dot
// that grows on the in-breath (4 s) and shrinks on the out-breath (6 s), three
// rounds — then a NEW reshuffled 4×4 grid and the real before → after time.

export type FocusResult = { focusAfter: FocusRun };

const IN_MS = 4000;
const OUT_MS = 6000;
const ROUNDS = 3;

export function UnlockFocus({
  c,
  lang,
  muted,
  before,
  gridBefore,
  continueLabel,
  onDone,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  muted: boolean;
  before: FocusRun;
  gridBefore: readonly number[];
  continueLabel: string;
  onDone: (r: FocusResult) => void;
}): React.JSX.Element {
  const [phase, setPhase] = useState<"intro" | "breathe" | "grid" | "reveal">(
    "intro",
  );
  const [breath, setBreath] = useState<"in" | "out" | "rest">("rest");
  const [after, setAfter] = useState<FocusRun | null>(null);
  const grid = useMemo(
    () => shuffledGrid(Math.random, gridBefore),
    [gridBefore],
  );
  const voice = useNarration(lang, muted);

  useEffect(() => {
    if (phase !== "breathe") return undefined;
    let cancelled = false;
    const sleep = (ms: number): Promise<void> =>
      new Promise((r) => window.setTimeout(r, ms));
    void (async () => {
      await voice.play([
        { id: "focus-intro", text: voiceText(lang, "focus-intro") },
      ]);
      for (let r = 0; r < ROUNDS && !cancelled; r++) {
        setBreath("in");
        void voice.play([{ id: "focus-in", text: c.focus.breatheIn }]);
        await sleep(IN_MS);
        if (cancelled) return;
        setBreath("out");
        void voice.play([{ id: "focus-out", text: c.focus.breatheOut }]);
        await sleep(OUT_MS);
      }
      if (cancelled) return;
      setBreath("rest");
      await voice.play([
        { id: "focus-done", text: voiceText(lang, "focus-done") },
      ]);
      if (!cancelled) setPhase("grid");
    })();
    return () => {
      cancelled = true;
      voice.stop();
    };
    // run once per breathe phase
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const b = focusSeconds(before);
  const a = after === null ? 0 : focusSeconds(after);
  // Judged on the same numbers the card shows (seconds, one decimal).
  const good = after !== null && a < b;

  return (
    <section className="flex flex-col gap-5" data-bu-focus={phase}>
      <h2 className="text-2xl text-foreground">{c.focus.title}</h2>

      {phase === "intro" && (
        <div className="play-card flex flex-col gap-4 p-6 text-center">
          <p className="text-lg text-foreground">{c.focus.teach}</p>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => setPhase("breathe")}
            data-bu-go
          >
            {c.check.go}
          </button>
        </div>
      )}

      {phase === "breathe" && (
        <div
          className="flex flex-col items-center gap-6 py-4"
          data-bu-breath={breath}
        >
          <div className="flex size-56 items-center justify-center rounded-full bg-[#1e1b4b]">
            <div
              className="bu-dot rounded-full bg-[#fde68a]"
              style={{
                width: 56,
                height: 56,
                transform: breath === "in" ? "scale(2.2)" : "scale(1)",
                transitionDuration:
                  breath === "in" ? `${IN_MS}ms` : `${OUT_MS}ms`,
                boxShadow:
                  breath === "in"
                    ? "0 0 60px 20px rgba(253,230,138,0.55)"
                    : "0 0 24px 6px rgba(253,230,138,0.35)",
              }}
              aria-hidden="true"
            />
          </div>
          <p
            className="font-heading text-2xl text-foreground"
            aria-live="polite"
          >
            {breath === "in"
              ? c.focus.breatheIn
              : breath === "out"
                ? c.focus.breatheOut
                : ""}
          </p>
          {breath === "rest" && <Caption text={voice.caption} />}
        </div>
      )}

      {phase === "grid" && (
        <>
          <p className="text-lg font-bold text-foreground">
            {c.focus.gridTitle}
          </p>
          <FocusGrid
            grid={grid}
            nextLabel={c.check.next}
            muted={muted}
            onDone={(run) => {
              setAfter(run);
              setPhase("reveal");
            }}
          />
        </>
      )}

      {phase === "reveal" && after !== null && (
        <>
          <RevealCard
            colour={SKILL.focus}
            line={good ? c.focus.improved(b, a) : c.focus.flat(b, a)}
            sub={good ? c.sawIt : c.kind}
            good={good}
            muted={muted}
            lang={lang}
          />
          <button
            type="button"
            className={primaryBtn}
            onClick={() => onDone({ focusAfter: after })}
            data-bu-continue
          >
            {continueLabel}
          </button>
        </>
      )}
    </section>
  );
}
