"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LanguageOverride } from "@/context/LanguageContext";
import { PlayScope } from "@/components/PlayScope";
import { captureUtmParams } from "@/lib/analytics/utm";
import { SharpBrainPricingProvider } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import type { PricingSnapshot } from "@/features/sharp-brain-enrol/server";
import { buCopy } from "../copy";
import type { BuRole, PublicPassage } from "../passages";
import {
  buildReport,
  scoreInOrder,
  scorePicked,
  wpmFrom,
  type PlayerReport,
} from "../scoring";
import type { BuSettings } from "../settings";
import { loadMuted, saveMuted } from "../sound";
import { trackBu, type TrackContext } from "../tracking";
import Image from "next/image";
import { type RawRun, type RunSetup } from "../types";
import { CHECK_SETS, STORY_SETS } from "../words";
import { chooseBrainUnlockSets } from "../actions";
import { addSeen, deviceId, loadSeen } from "../deviceMemory";
import { chooseSessionSets, type SessionSets } from "../sets";
import { BrainCheck, type CheckResult } from "./BrainCheck";
import { OfferBlock } from "./OfferBlock";
import { ResultV2 } from "./Report";
import { UnlockFocus } from "./UnlockFocus";
import { UnlockMemory } from "./UnlockMemory";
import { UnlockSpeed } from "./UnlockSpeed";
import { primaryBtn, SoundToggle, Steps } from "./ui";
import { VoiceCue, VoiceOverrides } from "./useNarration";

// Brain Test v2 (founder, 25 Nov 2026): one welcome screen → for each
// superpower its own Before → technique → After (speed, memory, focus) → a
// plain result with ONE WhatsApp button. No menu, footer, plans, sharing or
// Duo Mode on this page: the next step (and the price) happens on WhatsApp.

/** Every passage a session may get (no answer keys), per role and language. */
export type BuContent = Record<
  BuRole,
  Record<"en" | "hi", { check: PublicPassage[]; sharp: PublicPassage[] }>
>;

type Stage = "welcome" | "play" | "report";
type RunParts = {
  check?: CheckResult;
  sharpMs?: number;
  sharpAnswers?: number[];
  checkCorrect?: number;
  checkTotal?: number;
  sharpCorrect?: number;
  sharpTotal?: number;
  storyForward?: string[];
  storyBackward?: string[];
  focusAfter?: RawRun["focusAfter"];
};
// 0 speed before · 1 speed unlock · 2 memory before · 3 memory unlock ·
// 4 focus before · 5 focus unlock
const PHASES = 6;

export default function BrainUnlock({
  content,
  settings,
  pricing,
  initialLang,
  initialView,
  initialPlan,
  retakeOf,
  initialRole,
}: {
  content: BuContent;
  settings: BuSettings;
  pricing: PricingSnapshot;
  initialLang: "en" | "hi";
  initialView: "flow" | "offer";
  initialPlan: "self" | "live" | null;
  /** The earlier lead this +30-day retake comes from (WhatsApp link), or null. */
  retakeOf: string | null;
  /** Passages for this visitor (?role= from the WhatsApp link); student by default. */
  initialRole: BuRole;
}): React.JSX.Element {
  const [lang, setLang] = useState<"en" | "hi">(initialLang);
  const c = buCopy[lang];
  const [muted, setMuted] = useState(false);
  const [view, setView] = useState(initialView);
  const [stage, setStage] = useState<Stage>("welcome");
  const role: BuRole = initialRole;
  const duo = false;
  const [phase, setPhase] = useState(0);
  const [player, setPlayer] = useState(0);
  const [parts, setParts] = useState<RunParts[]>([{}, {}]);
  const [sessionSets, setSessionSets] = useState<SessionSets[] | null>(null);
  const [starting, setStarting] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const track: TrackContext = { role, lang, duo };
  useEffect(() => {
    captureUtmParams();
    setMuted(loadMuted());
    trackBu(
      "landing",
      { role: null, lang: initialLang, duo: false },
      { view: initialView },
    );
    // once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each new screen starts at the top (no site header on this page), not on first load.
  const screenKey = `${view}-${stage}-${phase}`;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = top.current;
    if (el !== null)
      window.scrollTo({
        top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 16),
      });
  }, [screenKey]);

  // This session's word sets and passages (chosen when Start is pressed).
  const setups: RunSetup[] = useMemo(() => {
    const sets =
      sessionSets ??
      chooseSessionSets({
        role: role ?? "student",
        lang,
        duo,
        history: { check: [], story: [], passages: [] },
        rng: () => 0,
      });
    return sets.map((x, i) => ({
      who: duo ? (i === 0 ? "parent" : "child") : "me",
      role: duo ? (i === 0 ? "parent" : "student") : (role ?? "student"),
      ...x,
    }));
  }, [sessionSets, duo, role, lang]);
  const passageFor = (
    s: RunSetup,
  ): { check: PublicPassage; sharp: PublicPassage } => {
    const pool = content[s.role][lang];
    return {
      check:
        pool.check.find((x) => x.id === s.checkPassageId) ?? pool.check[0]!,
      sharp:
        pool.sharp.find((x) => x.id === s.sharpPassageId) ?? pool.sharp[0]!,
    };
  };
  const setup = setups[Math.min(player, setups.length - 1)]!;
  const passages = passageFor(setup);
  const part = parts[player]!;

  const runFor = (i: number, ps: RunParts[]): RawRun => {
    const s = setups[i]!;
    const pp = ps[i]!;
    const pass = passageFor(s);
    return {
      who: s.who,
      role: s.role,
      checkSet: s.checkSet,
      storySet: s.storySet,
      checkPassageId: pass.check.id,
      checkMs: pp.check?.checkMs ?? 0,
      checkAnswers: pp.check?.checkAnswers ?? [],
      sharpPassageId: pass.sharp.id,
      sharpMs: pp.sharpMs ?? 0,
      sharpAnswers: pp.sharpAnswers ?? [],
      memoryPicked: pp.check?.memoryPicked ?? [],
      storyForward: pp.storyForward ?? [],
      storyBackward: pp.storyBackward ?? [],
      focusBefore: pp.check?.focusBefore ?? { ms: 0, errors: 0 },
      focusAfter: pp.focusAfter ?? { ms: 0, errors: 0 },
    };
  };

  const reportFor = (i: number, ps: RunParts[]): PlayerReport => {
    const s = setups[i]!;
    const pp = ps[i]!;
    const pass = passageFor(s);
    const run = runFor(i, ps);
    return buildReport(
      {
        speedBefore: {
          wpm: wpmFrom(pass.check.wordCount, run.checkMs),
          correct: pp.checkCorrect ?? 0,
          total: pp.checkTotal ?? 1,
        },
        speedAfter: {
          wpm: wpmFrom(pass.sharp.wordCount, run.sharpMs),
          correct: pp.sharpCorrect ?? 0,
          total: pp.sharpTotal ?? 2,
        },
        memoryBefore: scorePickedFor(run),
        memoryForward: scoreForward(run),
        memoryBackward: scoreBackward(run),
        focusBefore: run.focusBefore,
        focusAfter: run.focusAfter,
      },
      settings.scoring,
    );
  };

  /** The visitor finished the current phase: the next one, or the report. */
  function advance(next: RunParts[]): void {
    const done = phase;
    const r = reportFor(0, next);
    if (done === 0) trackBu("check_done", track, { part: "speed" });
    if (done === 2) trackBu("check_done", track, { part: "memory" });
    if (done === 4) trackBu("check_done", track, { part: "focus" });
    if (done === 1)
      trackBu("unlock_speed_done", track, {
        before: r.speedBefore.wpm,
        after: r.speedAfter.wpm,
        counted: r.speedCounted,
      });
    if (done === 3)
      trackBu("unlock_memory_done", track, {
        before: r.memoryBefore,
        after: r.memoryForward,
        backward: r.memoryBackward,
      });
    if (done === 5)
      trackBu("unlock_focus_done", track, {
        before: r.focusBefore.ms,
        after: r.focusAfter.ms,
      });
    if (done === PHASES - 1) {
      setStage("report");
      trackBu("report_view", track, {
        score: r.score.total,
        type: r.brainType,
      });
      return;
    }
    setPhase(done + 1);
  }

  const finishPart = (p: RunParts): void => {
    const next = parts.map((x, k) => (k === player ? { ...x, ...p } : x));
    setParts(next);
    advance(next);
  };
  /** A "before" step: merge its part of the check result. */
  const finishCheck = (piece: Partial<CheckResult>): void => {
    const prev = part.check ?? {
      checkMs: 0,
      checkAnswers: [],
      memoryPicked: [],
      focusBefore: { ms: 0, errors: 0 },
      gridBefore: [],
    };
    finishPart({ check: { ...prev, ...piece } });
  };

  /** Start: this person's sets (server: device/phone/email history; else this browser's memory). */
  async function start(): Promise<void> {
    setStarting(true);
    const seen = loadSeen();
    let sets: SessionSets[] | null = null;
    try {
      const res = await chooseBrainUnlockSets({
        deviceId: deviceId(),
        retakeOf,
        seen,
        role,
        lang,
        duo,
      });
      if (res.ok) sets = res.sets;
    } catch {
      sets = null;
    }
    sets ??= chooseSessionSets({ role, lang, duo, history: seen });
    addSeen(sets);
    setSessionSets(sets);
    trackBu(
      "started",
      track,
      { sets: sets.map((x) => `${x.checkSet}.${x.storySet}`).join("+"), v: 2 },
    );
    setParts([{}, {}]);
    setPhase(0);
    setPlayer(0);
    setStarting(false);
    setStage("play");
  }

  const continueLabel = phase === PHASES - 1 ? c.seeReport : c.nextSuperpower;
  const step = Math.min(2, Math.floor(phase / 2)) as 0 | 1 | 2;
  const baselineWpm =
    part.check === undefined
      ? 0
      : wpmFrom(passages.check.wordCount, part.check.checkMs);

  return (
    <LanguageOverride lang={lang}>
      <VoiceOverrides.Provider value={settings.voiceLines[lang]}>
        <div className="dark">
          <PlayScope className="bt2 min-h-dvh bg-background px-4 pt-4 pb-10 text-foreground">
            <div
              ref={top}
              className="mx-auto flex w-full max-w-md flex-col gap-5"
              data-bu-stage={view === "offer" ? "offer" : stage}
              data-bu-lang={lang}
              data-bu-v="2"
              data-bu-sets={
                sessionSets
                  ?.map((x) => `${x.checkSet}.${x.storySet}`)
                  .join("+") ?? ""
              }
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold tracking-wide text-primary">
                  🧠 Sharp Brain™
                </p>
                <div className="flex items-center gap-2">
                  {(stage === "welcome" || view === "offer") && (
                    <div
                      className="flex rounded-full border-2 border-border p-0.5"
                      role="radiogroup"
                      aria-label={c.langLabel}
                    >
                      {(["en", "hi"] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          role="radio"
                          aria-checked={lang === l}
                          onClick={() => setLang(l)}
                          className={`min-h-10 rounded-full px-4 text-base font-bold ${lang === l ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                          data-bu-lang-toggle={l}
                        >
                          {l === "en" ? "English" : "हिंदी"}
                        </button>
                      ))}
                    </div>
                  )}
                  <SoundToggle
                    muted={muted}
                    on={c.sound.on}
                    off={c.sound.off}
                    onToggle={() => {
                      saveMuted(!muted);
                      setMuted(!muted);
                    }}
                  />
                </div>
              </div>

              {view === "offer" && (
                <SharpBrainPricingProvider initial={pricing}>
                  <button
                    type="button"
                    className={primaryBtn}
                    onClick={() => setView("flow")}
                    data-bu-retake
                  >
                    🧠 {c.offer.retake} →
                  </button>
                  <OfferBlock
                    c={c}
                    lang={lang}
                    settings={settings}
                    facts={null}
                    track={track}
                    initialPlan={initialPlan}
                  />
                </SharpBrainPricingProvider>
              )}

              {view === "flow" && stage === "welcome" && (
                <section
                  className="flex flex-col items-center gap-5 pt-4 text-center"
                  data-bu-welcome
                >
                  <VoiceCue id="hook" lang={lang} muted={muted} delayMs={600} />
                  <Image
                    src="/images/bt2-dr-kapil.jpg"
                    alt="Dr. Kapil Dev Sharma"
                    width={112}
                    height={112}
                    priority
                    className="size-28 rounded-full border-4 border-primary object-cover"
                  />
                  <h1 className="text-[1.9rem] leading-tight text-foreground">
                    {c.v2.welcomeTitle}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {c.v2.welcomeSub}
                  </p>
                  <p className="text-sm text-muted-foreground">{c.v2.trust}</p>
                  <button
                    type="button"
                    className={primaryBtn}
                    disabled={starting}
                    onClick={() => void start()}
                    data-bu-start
                  >
                    {c.v2.start} →
                  </button>
                  <p className="text-base font-semibold text-foreground">
                    {c.v2.soundTip}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {c.promise.noSignup}
                  </p>
                </section>
              )}

              {view === "flow" && stage === "play" && (
                <>
                  <Steps current={step} labels={c.v2.steps} />
                  <div key={phase}>
                    {phase === 0 && (
                      <BrainCheck
                        c={c}
                        lang={lang}
                        part="speed"
                        passage={passages.check}
                        checkSet={setup.checkSet}
                        muted={muted}
                        onDone={finishCheck}
                      />
                    )}
                    {phase === 1 && part.check !== undefined && (
                      <UnlockSpeed
                        c={c}
                        lang={lang}
                        muted={muted}
                        baselineWpm={baselineWpm}
                        checkPassageId={passages.check.id}
                        checkAnswers={part.check.checkAnswers}
                        passage={passages.sharp}
                        continueLabel={continueLabel}
                        onDone={(r) =>
                          finishPart({
                            sharpMs: r.sharpMs,
                            sharpAnswers: r.sharpAnswers,
                            checkCorrect: r.grade.checkCorrect,
                            checkTotal: r.grade.checkTotal,
                            sharpCorrect: r.grade.sharpCorrect,
                            sharpTotal: r.grade.sharpTotal,
                          })
                        }
                      />
                    )}
                    {phase === 2 && (
                      <BrainCheck
                        c={c}
                        lang={lang}
                        part="memory"
                        passage={passages.check}
                        checkSet={setup.checkSet}
                        muted={muted}
                        onDone={finishCheck}
                      />
                    )}
                    {phase === 3 && part.check !== undefined && (
                      <UnlockMemory
                        c={c}
                        lang={lang}
                        muted={muted}
                        before={scorePickedFor(runFor(player, parts))}
                        storySet={setup.storySet}
                        continueLabel={continueLabel}
                        onDone={(r) => finishPart(r)}
                      />
                    )}
                    {phase === 4 && (
                      <BrainCheck
                        c={c}
                        lang={lang}
                        part="focus"
                        passage={passages.check}
                        checkSet={setup.checkSet}
                        muted={muted}
                        onDone={finishCheck}
                      />
                    )}
                    {phase === 5 && part.check !== undefined && (
                      <UnlockFocus
                        c={c}
                        lang={lang}
                        muted={muted}
                        before={part.check.focusBefore}
                        gridBefore={part.check.gridBefore}
                        continueLabel={continueLabel}
                        onDone={(r) => finishPart(r)}
                      />
                    )}
                  </div>
                </>
              )}

              {view === "flow" && stage === "report" && (
                <>
                  <VoiceCue
                    id="report-ready"
                    lang={lang}
                    muted={muted}
                    delayMs={1200}
                  />
                  <ResultV2
                    c={c}
                    lang={lang}
                    role={role}
                    report={reportFor(0, parts)}
                    run={runFor(0, parts)}
                    settings={settings}
                    track={track}
                  />
                </>
              )}
            </div>
          </PlayScope>
        </div>
      </VoiceOverrides.Provider>
    </LanguageOverride>
  );
}

function scorePickedFor(run: RawRun): number {
  return scorePicked(
    run.memoryPicked,
    CHECK_SETS[run.checkSet].map((w) => w.id),
  );
}
function scoreForward(run: RawRun): number {
  return scoreInOrder(
    run.storyForward,
    STORY_SETS[run.storySet].map((w) => w.id),
  );
}
function scoreBackward(run: RawRun): number {
  return scoreInOrder(
    run.storyBackward,
    STORY_SETS[run.storySet].map((w) => w.id),
    true,
  );
}
