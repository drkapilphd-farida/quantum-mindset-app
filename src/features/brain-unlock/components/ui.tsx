"use client";

import { useEffect, useState } from "react";
import { Confetti } from "@/components/play/Confetti";
import { playSfx } from "../sound";
import { useNarration } from "./useNarration";

// Shared Brain Unlock pieces in the play design (Sunny Playground by day,
// Night Sky in dark mode). Big tap targets (≥ 48 px), mobile first.

export const primaryBtn =
  "btn-finish inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-lg font-bold disabled:opacity-50";
export const secondaryBtn =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-5 text-base font-semibold text-foreground disabled:opacity-50";
export const chipBtn = (on: boolean): string =>
  `min-h-12 rounded-2xl border-2 px-3 py-2 text-base font-semibold transition-colors ${on ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-foreground"}`;

export const SKILL = {
  speed: "#c2410c",
  memory: "#6d28d9",
  focus: "#4338ca",
  check: "#0f766e",
} as const;

/** "Brain Check" → "Superpower 1 of 3" … with four segments. */
/**
 * The top bar during the challenge (founder, 15 Nov 2026): which step, an
 * honest "About 2 minutes left" estimate with a time bar, and a cheer between
 * unlocks ("2 of 3 done! 🔥").
 */
export function Progress({
  step,
  label,
  labels,
  timeLeft,
  fraction,
  cheer,
}: {
  step: 0 | 1 | 2 | 3;
  label: string;
  labels: readonly [string, string, string, string];
  timeLeft: string;
  fraction: number;
  cheer: string | null;
}): React.JSX.Element {
  const pct = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  return (
    <div className="flex flex-col gap-2" data-bu-progress={step}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-bold text-muted-foreground">{label}</p>
        <p
          className="shrink-0 text-sm font-bold text-foreground tabular-nums"
          data-bu-time-left
        >
          ⏱ {timeLeft}
        </p>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={timeLeft}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb] transition-[width] duration-700"
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {labels.map((l, i) => (
          <p
            key={l}
            className={`truncate text-[11px] ${i === step ? "font-bold text-foreground" : i < step ? "text-primary" : "text-muted-foreground"}`}
          >
            {i < step ? "✓ " : ""}
            {l}
          </p>
        ))}
      </div>
      {cheer !== null && <Cheer key={cheer} text={cheer} />}
    </div>
  );
}

/** "2 of 3 done! 🔥" — pops in at the start of the next unlock, gone after 4 s. */
function Cheer({ text }: { text: string }): React.JSX.Element | null {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(false), 4000);
    return () => window.clearTimeout(t);
  }, []);
  if (!on) return null;
  return (
    <p
      className="bu-pop w-fit self-center rounded-full bg-[var(--play-good-bg)] px-4 py-1.5 font-heading text-lg text-[var(--play-good)]"
      role="status"
      data-bu-cheer
    >
      {text}
    </p>
  );
}

/** The big before → after card at the end of each unlock (real numbers only). */
export function RevealCard({
  colour,
  line,
  sub,
  good,
  muted,
  lang,
}: {
  colour: string;
  line: string;
  sub: string;
  good: boolean;
  muted: boolean;
  lang: "en" | "hi";
}): React.JSX.Element {
  const voice = useNarration(lang, muted);
  useEffect(() => {
    if (good) playSfx("win", muted);
    // Dr. Kapil says the honest line: "You just saw it yourself" / the kind line.
    voice.cue(good ? "reveal-up" : "reveal-kind", good ? 900 : 300);
    // play once, on show
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="relative">
      {good && <Confetti />}
      <div
        className="bu-pop rounded-3xl p-6 text-center text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${colour}, #2563eb)` }}
        data-bu-reveal={good ? "good" : "kind"}
      >
        <p className="font-heading text-[1.65rem] leading-snug tabular-nums">
          {line}
        </p>
        <p className="mt-2 text-base opacity-95">{sub}</p>
      </div>
    </div>
  );
}

export function Caption({
  text,
}: {
  text: string | null;
}): React.JSX.Element | null {
  if (text === null) return null;
  return (
    <p
      className="rounded-2xl bg-muted/70 px-4 py-3 text-center text-lg font-semibold text-foreground"
      aria-live="polite"
      data-bu-caption
    >
      {text.replace(/\s*\.\.\.\s*/g, " ")}
    </p>
  );
}

export function SoundToggle({
  muted,
  onToggle,
  on,
  off,
}: {
  muted: boolean;
  onToggle: () => void;
  on: string;
  off: string;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={!muted}
      aria-label={muted ? off : on}
      className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border-2 border-border bg-card px-3 text-sm whitespace-nowrap font-semibold text-foreground"
      data-bu-sound={muted ? "off" : "on"}
    >
      <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
      <span className="sr-only sm:not-sr-only">{muted ? off : on}</span>
    </button>
  );
}
