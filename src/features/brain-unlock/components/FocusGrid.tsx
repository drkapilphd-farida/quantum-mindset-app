"use client";

import { useRef, useState } from "react";
import { GRID_SIZE, type FocusRun } from "../scoring";
import { playSfx } from "../sound";

/**
 * Tap 1–16 in order. The clock starts on the first tap of the grid's
 * appearance (the moment it is shown) and stops on 16. Wrong taps are counted
 * and nudge the tile; nothing else happens (no lives, no penalty screen).
 */
export function FocusGrid({
  grid,
  nextLabel,
  muted,
  onDone,
}: {
  grid: readonly number[];
  nextLabel: (n: number) => string;
  muted: boolean;
  onDone: (run: FocusRun) => void;
}): React.JSX.Element {
  const [next, setNext] = useState(1);
  const [errors, setErrors] = useState(0);
  const [nudge, setNudge] = useState<number | null>(null);
  const started = useRef<number>(performance.now());
  const finished = useRef(false);

  const tap = (n: number): void => {
    if (finished.current) return;
    if (n === next) {
      playSfx("tap", muted);
      if (n === GRID_SIZE) {
        finished.current = true;
        onDone({ ms: Math.round(performance.now() - started.current), errors });
      }
      setNext(n + 1);
    } else if (n > next) {
      setErrors((e) => e + 1);
      setNudge(n);
      window.setTimeout(() => setNudge(null), 240);
    }
  };

  return (
    <div className="flex flex-col gap-3" data-bu-grid data-next={next}>
      <p
        className="text-center text-base font-bold text-muted-foreground tabular-nums"
        aria-live="polite"
      >
        {next <= GRID_SIZE ? nextLabel(next) : "✓"}
      </p>
      <div className="mx-auto grid w-full max-w-sm grid-cols-4 gap-2">
        {grid.map((n) => {
          const done = n < next;
          return (
            <button
              key={n}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                tap(n);
              }}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && tap(n)}
              disabled={done}
              aria-label={String(n)}
              className={`flex aspect-square items-center justify-center rounded-2xl border-2 font-heading text-[1.6rem] tabular-nums select-none ${done ? "border-transparent bg-primary/15 text-primary/50" : "border-border bg-card text-foreground active:scale-95"} ${nudge === n ? "bu-nudge border-[color:var(--play-warn)]" : ""}`}
              style={{ touchAction: "manipulation" }}
              data-bu-cell={n}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
