"use client";

import { useMemo, useState } from "react";
import type { BuCopy } from "../copy";
import { MEMORY_TOTAL, scoreInOrder } from "../scoring";
import {
  pickOthers,
  STORY_LINES,
  STORY_POOL,
  STORY_SETS,
  storyLineId,
  type BuWord,
  type StorySetId,
} from "../words";
import { useNarration } from "./useNarration";
import {
  Caption,
  primaryBtn,
  RevealCard,
  secondaryBtn,
  SKILL,
  useScrollTop,
} from "./ui";

// Unlock 2: "Earlier you remembered X of 5" → the linking/story method with 5
// NEW words (voice + one big picture per step) → recall in order → bonus: say
// them backwards → the real before → after. Founder (15 Nov 2026): under a
// minute of audio, short pauses, no replay line or wait at the end, and
// "I've got it → Recall" as soon as the story has played once.

export type MemoryResult = { storyForward: string[]; storyBackward: string[] };

function shuffle<T>(xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function UnlockMemory({
  c,
  lang,
  muted,
  before,
  storySet,
  continueLabel,
  onDone,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  muted: boolean;
  before: number;
  storySet: StorySetId;
  continueLabel: string;
  onDone: (r: MemoryResult) => void;
}): React.JSX.Element {
  const [phase, setPhase] = useState<
    "recap" | "story" | "told" | "forward" | "backward" | "reveal"
  >("recap");
  const [shown, setShown] = useState(0);
  const [forward, setForward] = useState<string[]>([]);
  const [backward, setBackward] = useState<string[]>([]);
  const voice = useNarration(lang, muted);
  useScrollTop(phase === "told" ? "story" : phase);
  const targets = STORY_SETS[storySet];
  // The 5 story words + 5 others drawn at random from the pool.
  const chips = useMemo(
    () => shuffle([...targets, ...pickOthers(STORY_POOL, 5)]),
    [targets],
  );
  const ids = targets.map((t) => t.id);
  const fwd = scoreInOrder(forward, ids);
  const back = scoreInOrder(backward, ids, true);

  async function playStory(withTeach: boolean): Promise<void> {
    setPhase("story");
    setShown(0);
    const storyLines = STORY_LINES[storySet][lang].map((text, i) => ({
      id: storyLineId(storySet, i + 1),
      text,
    }));
    // The teach line once (the first time); "Hear it again" plays the story only.
    const lines = withTeach
      ? [{ id: "memory-teach", text: c.memory.teach }, ...storyLines]
      : storyLines;
    const offset = withTeach ? 0 : 1;
    // A short pause after each story step, so each picture can form.
    await voice.play(
      lines,
      (i) => setShown(Math.min(Math.max(i + offset, 0), MEMORY_TOTAL)),
      250,
    );
    setShown(MEMORY_TOTAL);
    setPhase("told");
  }

  const good = fwd > before;
  return (
    <section
      className="flex flex-col gap-5"
      data-bu-memory={phase}
      data-bu-story-set={storySet}
    >
      <h2 className="text-2xl text-foreground">{c.memory.title}</h2>

      {phase === "recap" && (
        <div className="play-card flex flex-col gap-4 p-6 text-center">
          <p className="font-heading text-2xl text-foreground">
            {c.v2.memoryRecap(before)}
          </p>
          <p className="text-base text-muted-foreground">{c.memory.teach}</p>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => void playStory(true)}
            data-bu-go
          >
            {c.memory.play}
          </button>
        </div>
      )}

      {(phase === "story" || phase === "told") && (
        <>
          {/* The current step's picture, big, with its line under it. */}
          {phase === "story" && shown > 0 && (
            <div
              key={shown}
              className="bu-pop play-card flex min-h-32 items-center justify-center text-[4.5rem]"
              aria-hidden="true"
              data-bu-story-step={shown}
            >
              {targets[shown - 1]?.emoji}
            </div>
          )}
          <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
            {targets.map((t, i) => (
              <div
                key={t.id}
                className={`play-card flex aspect-square items-center justify-center text-[2rem] transition-all duration-500 ${i < shown ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
              >
                {t.emoji}
              </div>
            ))}
          </div>
          <Caption text={voice.caption} />
          {phase === "told" && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className={primaryBtn}
                onClick={() => setPhase("forward")}
                data-bu-go
              >
                {c.memory.replay}
              </button>
              <button
                type="button"
                className={secondaryBtn}
                onClick={() => void playStory(false)}
                data-bu-story-again
              >
                {c.memory.again}
              </button>
            </div>
          )}
        </>
      )}

      {phase === "forward" && (
        <OrderPicker
          c={c}
          lang={lang}
          title={c.memory.recallTitle}
          hint={c.memory.recallHint}
          chips={chips}
          value={forward}
          onChange={setForward}
          onCheck={() => setPhase("backward")}
        />
      )}
      {phase === "backward" && (
        <OrderPicker
          c={c}
          lang={lang}
          title={c.memory.backTitle}
          hint={c.memory.backHint}
          chips={chips}
          value={backward}
          onChange={setBackward}
          onCheck={() => setPhase("reveal")}
          onSkip={() => {
            setBackward([]);
            setPhase("reveal");
          }}
          skipLabel={c.v2.skipBack}
        />
      )}

      {phase === "reveal" && (
        <>
          <RevealCard
            colour={SKILL.memory}
            line={
              good
                ? c.memory.improved(before, fwd, back === MEMORY_TOTAL)
                : c.memory.flat(before, fwd)
            }
            sub={good ? c.sawIt : c.kind}
            good={good}
            muted={muted}
            lang={lang}
          />
          <button
            type="button"
            className={primaryBtn}
            onClick={() =>
              onDone({ storyForward: forward, storyBackward: backward })
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

function OrderPicker({
  c,
  lang,
  title,
  hint,
  chips,
  value,
  onChange,
  onCheck,
  onSkip,
  skipLabel,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  title: string;
  hint: string;
  chips: readonly BuWord[];
  value: string[];
  onChange: (v: string[]) => void;
  onCheck: () => void;
  /** Bonus rounds only (v2: the backwards round can be skipped). */
  onSkip?: () => void;
  skipLabel?: string;
}): React.JSX.Element {
  const byId = new Map(chips.map((w) => [w.id, w]));
  return (
    <div className="flex flex-col gap-4" data-bu-order>
      <div>
        <h3 className="text-xl text-foreground">{title}</h3>
        <p className="text-base text-muted-foreground">{hint}</p>
      </div>
      <ol className="grid grid-cols-5 gap-1.5" aria-label={title}>
        {Array.from({ length: MEMORY_TOTAL }, (_, i) => {
          const w = value[i] === undefined ? undefined : byId.get(value[i]!);
          return (
            <li
              key={i}
              className={`flex min-h-14 flex-col items-center justify-center rounded-xl border-2 px-1 text-center text-sm font-bold break-words ${w ? "border-primary bg-primary/10 text-foreground" : "border-dashed border-border text-muted-foreground"}`}
            >
              <span className="text-[11px] opacity-70">{i + 1}</span>
              {w?.[lang] ?? ""}
            </li>
          );
        })}
      </ol>
      <div className="grid grid-cols-2 gap-2">
        {chips.map((w) => {
          const used = value.includes(w.id);
          return (
            <button
              key={w.id}
              type="button"
              disabled={used || value.length >= MEMORY_TOTAL}
              onClick={() => onChange([...value, w.id])}
              className={`min-h-14 rounded-2xl border-2 px-3 text-lg font-semibold ${used ? "border-transparent bg-muted text-muted-foreground" : "border-border bg-card text-foreground"}`}
              data-bu-chip={w.id}
            >
              {w[lang]}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-2">
        <button
          type="button"
          className={secondaryBtn}
          disabled={value.length === 0}
          onClick={() => onChange(value.slice(0, -1))}
          data-bu-undo
        >
          {c.memory.undo}
        </button>
        <button
          type="button"
          className={primaryBtn}
          disabled={value.length < MEMORY_TOTAL}
          onClick={onCheck}
          data-bu-check-order
        >
          {c.memory.check}
        </button>
      </div>
      {onSkip !== undefined && (
        <button
          type="button"
          className="min-h-11 text-base font-semibold text-muted-foreground underline underline-offset-4"
          onClick={onSkip}
          data-bu-skip
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}
