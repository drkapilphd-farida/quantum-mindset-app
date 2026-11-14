"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LanguageOverride } from "@/context/LanguageContext";
import { PlayScope } from "@/components/PlayScope";
import { PageVideo } from "@/components/video/PageVideo";
import { captureUtmParams } from "@/lib/analytics/utm";
import { SharpBrainPricingProvider } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import type { PricingSnapshot } from "@/features/sharp-brain-enrol/server";
import { buCopy } from "../copy";
import { factsFrom, type ReportFacts } from "../messages";
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
import {
  CLASS_BANDS,
  ROLES,
  type ClassBand,
  type RawRun,
  type RunSetup,
} from "../types";
import { CHECK_WORDS, STORY_WORDS } from "../words";
import { BrainCheck, type CheckResult } from "./BrainCheck";
import { OfferBlock } from "./OfferBlock";
import { Report } from "./Report";
import { UnlockFocus } from "./UnlockFocus";
import { UnlockMemory } from "./UnlockMemory";
import { UnlockSpeed } from "./UnlockSpeed";
import { chipBtn, primaryBtn, Progress, secondaryBtn, SoundToggle } from "./ui";
import { VoiceCue, VoiceOverrides } from "./useNarration";

// Brain Unlock (founder spec, 13 Nov 2026): hook → Brain Check → 3 unlocks,
// each with its own real Before → After → the report → the offer, all on one
// page. Duo Mode: parent and child take turns on one phone at every step
// (the child gets different words and the student passages).

export type BuContent = Record<
  BuRole,
  Record<"en" | "hi", { check: PublicPassage; sharp: PublicPassage }>
>;

type Stage = "role" | "pain" | "promise" | "play" | "report";
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
const PHASES = 4; // 0 = Brain Check, 1 = speed, 2 = memory, 3 = focus

function usePrefersDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const on = (e: MediaQueryListEvent): void => setDark(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return dark;
}

export default function BrainUnlock({
  content,
  settings,
  pricing,
  initialLang,
  initialView,
  initialPlan,
}: {
  content: BuContent;
  settings: BuSettings;
  pricing: PricingSnapshot;
  initialLang: "en" | "hi";
  initialView: "flow" | "offer";
  initialPlan: "self" | "live" | null;
}): React.JSX.Element {
  const [lang, setLang] = useState<"en" | "hi">(initialLang);
  const c = buCopy[lang];
  const dark = usePrefersDark();
  const [muted, setMuted] = useState(false);
  const [view, setView] = useState(initialView);
  const [stage, setStage] = useState<Stage>("role");
  const [role, setRole] = useState<BuRole | null>(null);
  const [classBand, setClassBand] = useState<ClassBand | null>(null);
  const [duo, setDuo] = useState(false);
  const [phase, setPhase] = useState(0);
  const [player, setPlayer] = useState(0);
  const [handoff, setHandoff] = useState<"toChild" | "toParent" | null>(null);
  const [checkDone, setCheckDone] = useState(false);
  const [parts, setParts] = useState<RunParts[]>([{}, {}]);
  const [facts, setFacts] = useState<ReportFacts | null>(null);
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

  // Each new screen starts at its top (below the sticky header), not on first load.
  const screenKey = `${view}-${stage}-${phase}-${player}-${handoff ?? ""}-${checkDone}`;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = top.current;
    if (el !== null)
      window.scrollTo({
        top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 72),
      });
  }, [screenKey]);

  const setups: RunSetup[] = useMemo(
    () =>
      duo
        ? [
            { who: "parent", role: "parent", wordSet: "A" },
            { who: "child", role: "student", wordSet: "B" },
          ]
        : [{ who: "me", role: role ?? "student", wordSet: "A" }],
    [duo, role],
  );
  const setup = setups[player]!;
  const passages = content[setup.role][lang];
  const part = parts[player]!;

  const runFor = (i: number, ps: RunParts[]): RawRun => {
    const s = setups[i]!;
    const pp = ps[i]!;
    const pass = content[s.role][lang];
    return {
      who: s.who,
      role: s.role,
      wordSet: s.wordSet,
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
    const pass = content[s.role][lang];
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

  /** A player finished the current phase: next player (with a handoff), or the next phase. */
  function advance(next: RunParts[]): void {
    if (player < setups.length - 1) {
      setPlayer(player + 1);
      setHandoff("toChild");
      return;
    }
    const done = phase;
    const before = reportFor(0, next);
    if (done === 0) trackBu("check_done", track);
    if (done === 1)
      trackBu("unlock_speed_done", track, {
        before: before.speedBefore.wpm,
        after: before.speedAfter.wpm,
        counted: before.speedCounted,
      });
    if (done === 2)
      trackBu("unlock_memory_done", track, {
        before: before.memoryBefore,
        after: before.memoryForward,
        backward: before.memoryBackward,
      });
    if (done === 3)
      trackBu("unlock_focus_done", track, {
        before: before.focusBefore.ms,
        after: before.focusAfter.ms,
      });
    if (done === PHASES - 1) {
      setStage("report");
      trackBu("report_view", track, {
        score: before.score.total,
        type: before.brainType,
      });
      return;
    }
    setPlayer(0);
    setPhase(done + 1);
    if (duo) setHandoff("toParent");
    if (done === 0) setCheckDone(true);
  }

  const finishPart = (p: RunParts): void => {
    const next = parts.map((x, k) => (k === player ? { ...x, ...p } : x));
    setParts(next);
    advance(next);
  };

  const continueLabel =
    phase === PHASES - 1 && player === setups.length - 1
      ? c.seeReport
      : player < setups.length - 1
        ? c.speed.next
        : c.nextSuperpower;
  const showLangToggle = view === "offer" || stage === "role";

  return (
    <LanguageOverride lang={lang}>
      <VoiceOverrides.Provider value={settings.voiceLines[lang]}>
        <div className={dark ? "dark" : ""}>
          <PlayScope className="min-h-[80vh] bg-background px-4 py-6 text-foreground">
            <div
              ref={top}
              className="mx-auto flex w-full max-w-xl flex-col gap-5"
              data-bu-stage={view === "offer" ? "offer" : stage}
              data-bu-lang={lang}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold tracking-wider text-primary uppercase">
                  🧠 {c.pageName}
                </p>
                <div className="flex items-center gap-2">
                  {showLangToggle && (
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
                          className={`min-h-9 rounded-full px-3 text-sm font-bold ${lang === l ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                          data-bu-lang-toggle={l}
                        >
                          {l === "en" ? "EN" : "हिंदी"}
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

              {view === "flow" && stage === "role" && (
                <section className="flex flex-col gap-5" data-bu-hook>
                  <h1 className="text-[2rem] leading-tight text-foreground">
                    {c.hook.title}
                  </h1>
                  <p className="text-base text-muted-foreground">
                    {c.hook.sub}
                  </p>
                  <div
                    className="flex flex-col gap-3"
                    role="radiogroup"
                    aria-label={c.hook.title}
                  >
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        role="radio"
                        aria-checked={role === r}
                        onClick={() => {
                          setRole(r);
                          if (r === "professional") {
                            setClassBand(null);
                            trackBu("role_picked", { ...track, role: r });
                            setStage("pain");
                          }
                        }}
                        className={`min-h-16 rounded-2xl border-2 px-5 text-left text-xl font-bold ${role === r ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card text-foreground"}`}
                        data-bu-role={r}
                      >
                        {c.hook.roles[r]}
                      </button>
                    ))}
                  </div>
                  {(role === "parent" || role === "student") && (
                    <div
                      className="play-card flex flex-col gap-3 p-4"
                      data-bu-class
                    >
                      <p className="text-base font-bold text-foreground">
                        {c.hook.classQ}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({c.hook.optional})
                        </span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {CLASS_BANDS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            aria-pressed={classBand === b}
                            onClick={() =>
                              setClassBand(classBand === b ? null : b)
                            }
                            className={chipBtn(classBand === b)}
                            data-bu-class-chip={b}
                          >
                            {c.hook.classes[b]}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={primaryBtn}
                        onClick={() => {
                          trackBu(
                            "role_picked",
                            track,
                            classBand === null ? {} : { class: classBand },
                          );
                          setStage("pain");
                        }}
                        data-bu-role-next
                      >
                        {c.hook.next}
                      </button>
                    </div>
                  )}
                </section>
              )}

              {view === "flow" && stage === "pain" && role !== null && (
                <section
                  className="flex flex-col gap-6 py-6 text-center"
                  data-bu-pain
                >
                  <p className="font-heading text-[1.9rem] leading-snug text-foreground">
                    {c.pain[role]}
                  </p>
                  <button
                    type="button"
                    className={primaryBtn}
                    onClick={() => setStage("promise")}
                    data-bu-yes
                  >
                    {c.yes}
                  </button>
                </section>
              )}

              {view === "flow" && stage === "promise" && role !== null && (
                <section className="flex flex-col gap-5" data-bu-promise>
                  <VoiceCue id="hook" lang={lang} muted={muted} />
                  <h1 className="text-[1.9rem] leading-snug text-foreground">
                    {c.promise.title}
                  </h1>
                  <ul className="flex flex-wrap gap-2" data-bu-trust>
                    {c.promise.trust.map((t, i) => (
                      <li
                        key={t}
                        className="rounded-full px-3 py-1 text-sm font-bold text-white"
                        style={{
                          background: ["#4338ca", "#0f766e", "#c2410c"][i % 3],
                        }}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  {settings.introVideoId !== "" && (
                    <PageVideo
                      video={{
                        id: settings.introVideoId,
                        name: "Brain Unlock intro",
                        thumb: null,
                        caption: {
                          en: "Dr. Kapil on Brain Unlock",
                          hi: "Brain Unlock पर Dr. Kapil",
                        },
                      }}
                      lang={lang}
                      tone="light"
                      className="mx-auto w-48"
                    />
                  )}
                  {role === "parent" && (
                    <div
                      className="play-card flex flex-col gap-3 p-4"
                      data-bu-duo
                    >
                      <p className="text-base font-bold text-foreground">
                        {c.promise.duoQ}
                      </p>
                      <button
                        type="button"
                        aria-pressed={duo}
                        onClick={() => setDuo(true)}
                        className={chipBtn(duo)}
                        data-bu-duo-choice="duo"
                      >
                        {c.promise.duo}
                      </button>
                      <button
                        type="button"
                        aria-pressed={!duo}
                        onClick={() => setDuo(false)}
                        className={chipBtn(!duo)}
                        data-bu-duo-choice="solo"
                      >
                        {c.promise.solo}
                      </button>
                      {duo && (
                        <p className="text-sm text-muted-foreground">
                          {c.promise.duoSub}
                        </p>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className={primaryBtn}
                    onClick={() => {
                      if (role === "parent")
                        trackBu("duo_chosen", { ...track, duo }, { duo });
                      trackBu("started", { ...track, duo });
                      setParts([{}, {}]);
                      setPhase(0);
                      setPlayer(0);
                      setCheckDone(false);
                      setHandoff(null);
                      setStage("play");
                    }}
                    data-bu-start
                  >
                    {c.promise.start}
                  </button>
                  <p className="text-center text-sm text-muted-foreground">
                    {c.promise.noSignup}
                  </p>
                </section>
              )}

              {view === "flow" && stage === "play" && (
                <>
                  <Progress
                    step={phase as 0 | 1 | 2 | 3}
                    label={
                      phase === 0
                        ? c.progress.check
                        : c.progress.superpower(phase)
                    }
                    labels={c.progress.labels}
                  />
                  {duo && handoff === null && (
                    <p className="text-sm font-bold text-primary">
                      {player === 0
                        ? c.handoff.parentName
                        : c.handoff.childName}
                    </p>
                  )}

                  {handoff !== null ? (
                    <section
                      className="play-card flex flex-col items-center gap-5 p-8 text-center"
                      data-bu-handoff={handoff}
                    >
                      {checkDone && phase === 1 && player === 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="font-heading text-2xl text-foreground">
                            {c.check.complete}
                          </p>
                          <p className="text-base text-muted-foreground">
                            {c.check.completeSub}
                          </p>
                        </div>
                      )}
                      <p className="font-heading text-[1.6rem] leading-snug text-foreground">
                        {handoff === "toChild"
                          ? c.handoff.toChild
                          : c.handoff.toParent}
                      </p>
                      <button
                        type="button"
                        className={primaryBtn}
                        onClick={() => (setHandoff(null), setCheckDone(false))}
                        data-bu-handoff-ready
                      >
                        {c.handoff.ready}
                      </button>
                    </section>
                  ) : checkDone && !duo ? (
                    <section
                      className="play-card flex flex-col items-center gap-4 p-8 text-center"
                      data-bu-check-complete
                    >
                      <p className="font-heading text-[1.8rem] text-foreground">
                        {c.check.complete}
                      </p>
                      <p className="text-lg text-muted-foreground">
                        {c.check.completeSub}
                      </p>
                      <button
                        type="button"
                        className={primaryBtn}
                        onClick={() => setCheckDone(false)}
                        data-bu-unlock-now
                      >
                        {c.check.unlockNow}
                      </button>
                    </section>
                  ) : (
                    <div key={`${phase}-${player}`}>
                      {phase === 0 && (
                        <BrainCheck
                          c={c}
                          lang={lang}
                          passage={passages.check}
                          wordSet={setup.wordSet}
                          muted={muted}
                          onDone={(check) => finishPart({ check })}
                        />
                      )}
                      {phase === 1 && part.check !== undefined && (
                        <UnlockSpeed
                          c={c}
                          lang={lang}
                          muted={muted}
                          baselineWpm={wpmFrom(
                            passages.check.wordCount,
                            part.check.checkMs,
                          )}
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
                      {phase === 2 && part.check !== undefined && (
                        <UnlockMemory
                          c={c}
                          lang={lang}
                          muted={muted}
                          before={scorePickedFor(runFor(player, parts))}
                          wordSet={setup.wordSet}
                          continueLabel={continueLabel}
                          onDone={(r) => finishPart(r)}
                        />
                      )}
                      {phase === 3 && part.check !== undefined && (
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
                  )}
                </>
              )}

              {view === "flow" && stage === "report" && role !== null && (
                <SharpBrainPricingProvider initial={pricing}>
                  <VoiceCue
                    id="report-ready"
                    lang={lang}
                    muted={muted}
                    delayMs={1200}
                  />
                  <Report
                    c={c}
                    lang={lang}
                    role={role}
                    classBand={classBand}
                    childClassBand={duo ? classBand : null}
                    duo={duo}
                    reports={setups.map((_, i) => reportFor(i, parts))}
                    runs={setups.map((_, i) => runFor(i, parts))}
                    settings={settings}
                    track={track}
                    onSaved={setFacts}
                  />
                  <OfferBlock
                    c={c}
                    lang={lang}
                    settings={settings}
                    facts={facts ?? factsPreview(reportFor(0, parts))}
                    track={track}
                    initialPlan={null}
                  />
                </SharpBrainPricingProvider>
              )}

              {view === "flow" &&
                stage !== "role" &&
                stage !== "report" &&
                stage !== "play" && (
                  <button
                    type="button"
                    className={secondaryBtn}
                    onClick={() =>
                      setStage(stage === "promise" ? "pain" : "role")
                    }
                  >
                    ←
                  </button>
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
    CHECK_WORDS[run.wordSet].targets.map((w) => w.id),
  );
}
function scoreForward(run: RawRun): number {
  return scoreInOrder(
    run.storyForward,
    STORY_WORDS[run.wordSet].targets.map((w) => w.id),
  );
}
function scoreBackward(run: RawRun): number {
  return scoreInOrder(
    run.storyBackward,
    STORY_WORDS[run.wordSet].targets.map((w) => w.id),
    true,
  );
}
function factsPreview(r: PlayerReport): ReportFacts {
  return factsFrom("", r);
}
