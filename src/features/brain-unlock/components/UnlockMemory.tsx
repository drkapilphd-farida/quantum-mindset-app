"use client";

import { useMemo, useState } from "react";
import type { BuCopy } from "../copy";
import { MEMORY_TOTAL, scoreInOrder } from "../scoring";
import { STORY_LINES, STORY_WORDS, type BuWord, type WordSet } from "../words";
import { useNarration } from "./useNarration";
import { Caption, primaryBtn, RevealCard, secondaryBtn, SKILL } from "./ui";

// Unlock 2: "Earlier you remembered X of 5" → the linking/story method with 5
// NEW words (voice + one picture per step) → recall in order → bonus: say
// them backwards → the real before → after.

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
  wordSet,
  continueLabel,
  onDone,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  muted: boolean;
  before: number;
  wordSet: WordSet;
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
  const targets = STORY_WORDS[wordSet].targets;
  const chips = useMemo(
    () => shuffle([...targets, ...STORY_WORDS[wordSet].others]),
    [targets, wordSet],
  );
  const ids = targets.map((t) => t.id);
  const fwd = scoreInOrder(forward, ids);
  const back = scoreInOrder(backward, ids, true);

  async function playStory(): Promise<void> {
    setPhase("story");
    setShown(0);
    const lines = [
      { id: "memory-teach", text: c.memory.teach },
      ...STORY_LINES[wordSet][lang].map((text, i) => ({
        id: `story${wordSet}-${i + 1}`,
        text,
      })),
      {
        id: "memory-replay",
        text:
          lang === "hi"
            ? "अब पूरी कहानी एक बार फिर मन में देखिए।"
            : "Now see the whole story once more in your mind.",
      },
    ];
    // A short calm pause after each story step, so each picture can form.
    await voice.play(
      lines,
      (i) => setShown(Math.min(Math.max(i, 0), MEMORY_TOTAL)),
      500,
    );
    setShown(MEMORY_TOTAL);
    setPhase("told");
  }

  const good = fwd > before;
  return (
    <section className="flex flex-col gap-5" data-bu-memory={phase}>
      <h2 className="text-2xl text-foreground">{c.memory.title}</h2>

      {phase === "recap" && (
        <div className="play-card flex flex-col gap-4 p-6 text-center">
          <p className="font-heading text-2xl text-foreground">
            {c.memory.recap(before)}
          </p>
          <p className="text-base text-muted-foreground">{c.memory.teach}</p>
          <button
            type="button"
            className={primaryBtn}
            onClick={() => void playStory()}
            data-bu-go
          >
            {c.memory.play}
          </button>
        </div>
      )}

      {(phase === "story" || phase === "told") && (
        <>
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
            <button
              type="button"
              className={primaryBtn}
              onClick={() => setPhase("forward")}
              data-bu-go
            >
              {c.memory.replay}
            </button>
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
}: {
  c: BuCopy;
  lang: "en" | "hi";
  title: string;
  hint: string;
  chips: readonly BuWord[];
  value: string[];
  onChange: (v: string[]) => void;
  onCheck: () => void;
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
    </div>
  );
}
