"use client";

import { useEffect } from "react";
import { Confetti } from "@/components/play/Confetti";
import { playSfx } from "../sound";

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
export function Progress({
  step,
  label,
  labels,
}: {
  step: 0 | 1 | 2 | 3;
  label: string;
  labels: readonly [string, string, string, string];
}): React.JSX.Element {
  return (
    <div data-bu-progress={step}>
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
        {labels.map((l, i) => (
          <div key={l}>
            <div
              className={`h-2.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-primary" : "bg-muted"}`}
            />
            <p
              className={`mt-1 truncate text-[11px] ${i === step ? "font-bold text-foreground" : "text-muted-foreground"}`}
            >
              {l}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The big before → after card at the end of each unlock (real numbers only). */
export function RevealCard({
  colour,
  line,
  sub,
  good,
  muted,
}: {
  colour: string;
  line: string;
  sub: string;
  good: boolean;
  muted: boolean;
}): React.JSX.Element {
  useEffect(() => {
    if (good) playSfx("win", muted);
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
