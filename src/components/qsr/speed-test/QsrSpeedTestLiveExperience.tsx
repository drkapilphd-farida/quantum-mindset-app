"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, RotateCcw } from "lucide-react";
import { Eyebrow } from "../../ui";
import { computeLiveWpm, formatElapsedTime } from "@/features/quantum-speed-reading/readingSessionEngine";
import { LIVE_DEMO_PASSAGE } from "./liveDemoPassage";

// Live/Instructor Mode™ (see the "Speed Test — Live Class + Public
// Standalone Ready" task) — a separate, simpler flow from
// QsrSpeedTestExperience.tsx (the RSVP-demo marketing funnel that
// homepage/QSR CTAs already link to and keep using unchanged). Reached
// only via /programs/quantum-speed-reading/speed-test?mode=live — the
// default public URL's behavior is untouched. Built for one specific
// job: a screen-recordable, no-login, run-it-twice speed test with a
// fixed passage so the same ~285-word text and 5 questions come up
// every time, not a random pick.
//
// One passage, no persona picker, no RSVP "trained pace" preview
// section — intro → reading (with a large visible timer) → 5-question
// quiz → results (WPM + score together on one screen). "Run It Again"
// remembers the just-finished run so a second pass (e.g. after a
// teaching exercise) shows both results side by side without a reload,
// login, or losing the first score — sessionStorage is a safety net
// only (survives an accidental tab refresh mid-class); the comparison
// itself lives in plain component state.

const SESSION_STORAGE_KEY = "qsr-speed-test-live-previous-run";

type Stage = "intro" | "reading" | "quiz" | "results";

type RunResult = {
  wpm: number;
  score: number;
};

function loadPreviousRun(): RunResult | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "wpm" in parsed &&
      "score" in parsed &&
      typeof (parsed as RunResult).wpm === "number" &&
      typeof (parsed as RunResult).score === "number"
    ) {
      return parsed as RunResult;
    }
    return null;
  } catch {
    return null;
  }
}

function savePreviousRun(run: RunResult): void {
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(run));
  } catch {
    // Private-browsing/storage-disabled — the in-memory comparison this
    // session still works fine, it just won't survive a page refresh.
  }
}

const wordCount = LIVE_DEMO_PASSAGE.text.trim().split(/\s+/).filter(Boolean).length;

export default function QsrSpeedTestLiveExperience(): React.JSX.Element {
  const [stage, setStage] = useState<Stage>("intro");
  const [previousRun, setPreviousRun] = useState<RunResult | null>(null);
  const [runNumber, setRunNumber] = useState(1);

  // Client-only restore — same hydration-safety reasoning
  // QsrSpeedTestExperience.tsx documents for its own client-only passage
  // pick: reading sessionStorage during the initial render would give
  // the server and client different output.
  useEffect(() => {
    const restored = loadPreviousRun();
    if (restored !== null) {
      setPreviousRun(restored);
      setRunNumber(2);
    }
  }, []);

  const startRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [wpm, setWpm] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | null>>(
    () => new Array(LIVE_DEMO_PASSAGE.questions.length).fill(null) as Array<number | null>,
  );

  // Live-updating timer — ticks every 100ms while on the reading stage,
  // large/high-contrast render below. This is the actual clock WPM is
  // computed from (performance.now() deltas), not a separate display
  // that could drift from the real measurement.
  useEffect(() => {
    if (stage !== "reading") return undefined;
    startRef.current = performance.now();
    setElapsedMs(0);
    const interval = setInterval(() => {
      const startedAt = startRef.current;
      if (startedAt !== null) setElapsedMs(performance.now() - startedAt);
    }, 100);
    return () => clearInterval(interval);
  }, [stage]);

  function startTest(): void {
    setAnswers(new Array(LIVE_DEMO_PASSAGE.questions.length).fill(null) as Array<number | null>);
    setWpm(null);
    setStage("reading");
  }

  function finishReading(): void {
    const startedAt = startRef.current;
    if (startedAt === null) return;
    const finalElapsed = performance.now() - startedAt;
    setWpm(computeLiveWpm(wordCount, finalElapsed));
    setStage("quiz");
  }

  const allAnswered = answers.every((answer) => answer !== null);
  const score = answers.filter((answer, index) => answer === LIVE_DEMO_PASSAGE.questions[index]?.correctIndex).length;

  function submitQuiz(): void {
    if (wpm !== null) savePreviousRun({ wpm, score });
    setStage("results");
  }

  function runAgain(): void {
    if (wpm !== null) {
      setPreviousRun({ wpm, score });
      setRunNumber((n) => n + 1);
    }
    setStage("intro");
  }

  return (
    <section className="border-b border-line px-6 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-2xl rounded-sm border border-line-strong bg-panel2 p-8 sm:p-10">
        {stage === "intro" && (
          <>
            <Eyebrow color="text-gold">Live Mode · Run {runNumber}</Eyebrow>
            <h1 className="mt-4 font-display text-[28px] italic leading-tight text-ink sm:text-[34px]">
              Reading Speed Test
            </h1>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-dim">
              Read the passage at your normal pace, then answer 5 questions about what you just read. Your WPM and
              retention score will show together at the end.
            </p>
            {previousRun !== null && (
              <div className="mt-5 rounded-sm border border-teal/40 bg-teal-soft/40 px-4 py-3 text-[13.5px] text-ink">
                Previous run: <strong>{previousRun.wpm} WPM</strong>, <strong>{previousRun.score}/5</strong> correct.
                This run will show side by side with it.
              </div>
            )}
            <button
              type="button"
              onClick={startTest}
              className="mt-7 inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              <Play className="h-4 w-4" aria-hidden="true" /> Start the Test
            </button>
          </>
        )}

        {stage === "reading" && (
          <>
            <p className="text-center text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
              Read at your normal pace
            </p>
            {/* Large, high-contrast, centered — sized to stay clearly
                readable on a screen-share recording at normal zoom
                (~80px on mobile up to ~120px on desktop), tabular-nums
                so the digits don't jitter in width as they tick. */}
            <div className="mt-3 flex items-center justify-center rounded-sm bg-[#1B1508] py-8">
              <span className="font-display text-[72px] font-bold tabular-nums leading-none text-[#F5F0E6] sm:text-[104px]">
                {formatElapsedTime(elapsedMs)}
              </span>
            </div>
            <div className="mt-6 rounded-sm border border-line-strong bg-panel px-6 py-5 text-[17px] leading-relaxed text-ink">
              {LIVE_DEMO_PASSAGE.text.split("\n\n").map((paragraph) => (
                <p key={paragraph} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            <button
              type="button"
              onClick={finishReading}
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              I&rsquo;ve Finished Reading <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}

        {stage === "quiz" && (
          <>
            <h1 className="text-[21px] font-bold text-ink">Quick Check</h1>
            <p className="mt-2 text-[14px] text-ink-dim">5 questions on what you just read.</p>
            <div className="mt-5 space-y-6">
              {LIVE_DEMO_PASSAGE.questions.map((question, questionIndex) => (
                <div key={question.question}>
                  <div className="mb-2.5 text-[14.5px] font-semibold text-ink">
                    {questionIndex + 1}. {question.question}
                  </div>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => {
                            const next = [...prev];
                            next[questionIndex] = optionIndex;
                            return next;
                          })
                        }
                        className={`block w-full rounded-sm border px-4 py-2.5 text-left text-[13.5px] transition-colors ${
                          answers[questionIndex] === optionIndex
                            ? "border-gold bg-gold-soft font-semibold text-ink"
                            : "border-line-strong text-ink hover:border-gold/60"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={submitQuiz}
              className="mt-7 inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44] disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-ink-faint disabled:hover:translate-y-0"
            >
              See My Results <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        )}

        {stage === "results" && (
          <>
            <Eyebrow color="text-gold">Run {runNumber} Results</Eyebrow>
            <h1 className="mt-4 font-display text-[26px] italic text-ink sm:text-[30px]">
              WPM and retention, together
            </h1>

            {/* Both numbers large, bold, and on this one screen at once —
                the whole point being a single screenshot/frame captures
                both for a before/after comparison later. */}
            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-sm border border-gold/40 bg-gold-soft/40 px-5 py-6 text-center">
                <div className="font-display text-[56px] font-bold leading-none text-ink sm:text-[68px]">{wpm}</div>
                <p className="mt-2.5 text-[12.5px] font-semibold uppercase tracking-[0.05em] text-ink-faint">WPM</p>
              </div>
              <div className="rounded-sm border border-teal/40 bg-teal-soft/40 px-5 py-6 text-center">
                <div className="font-display text-[56px] font-bold leading-none text-ink sm:text-[68px]">
                  {score}/{LIVE_DEMO_PASSAGE.questions.length}
                </div>
                <p className="mt-2.5 text-[12.5px] font-semibold uppercase tracking-[0.05em] text-ink-faint">
                  Correct
                </p>
              </div>
            </div>

            {previousRun !== null && (
              <div className="mt-6 rounded-sm border border-line-strong bg-panel px-5 py-4">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                  Previous Run, For Comparison
                </p>
                <div className="flex items-center gap-6 text-[15px] font-semibold text-ink">
                  <span>{previousRun.wpm} WPM</span>
                  <span>{previousRun.score}/5 correct</span>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line-strong pt-6">
              <button
                type="button"
                onClick={runAgain}
                className="inline-flex items-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Run It Again
              </button>
              <Link
                href="/programs/quantum-speed-reading/speed-test"
                className="text-[13px] font-semibold text-teal transition-colors hover:text-teal-light"
              >
                Exit Live Mode
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
