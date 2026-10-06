"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "@/components/ui";
import { readUtmParams } from "@/lib/analytics/utm";
import { Countdown, SharpBrainPricingProvider } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import {
  finishReading,
  saveSpeedTestResult,
  startPracticeDemo,
  startReadingTest,
  submitPracticeAnswers,
  submitReadingAnswers,
  type ReadingTestResult,
  type SpeedTestOffer,
} from "../actions";
import { speedTestCopy, type SpeedTestCopy } from "../copy";
import { leadMagnetCopy, type LeadMagnetCopy } from "../leadMagnetCopy";
import { hasReachedEnd, SPEED_BAND_EDGES, type SpeedBand } from "../scoring";
import { drawShareCard, shareOrDownload } from "../shareCard";
import { trackSpeedTest } from "../tracking";

// Free Reading Speed Test — the lead magnet. Step 1 Read (self-paced,
// timed by the server), Step 2 Questions (one at a time, passage hidden,
// scored on the server), Step 3 the Reading Profile: Effective Reading
// Speed on a simple scale, a reading type with 3 tips, a share card, the
// optional 60-second Brain Boost (words shown one at a time ~20% above the
// measured speed — never called "your reading speed"), the WhatsApp
// capture, and only then a soft program section. An invalid result shows
// no price and no enrol button — only an explanation and a retry.

const PROGRAM_HREF = "/programs/sharp-brain";
const SEEN_KEY = "reading-speed-test-seen";

type Shown = { question: string; options: string[] };
type Boost = { pace: number; percent: number };
type Stage =
  | { name: "intro" }
  | { name: "reading"; token: string; title: string; text: string }
  | { name: "questions"; token: string; questions: Shown[] }
  | { name: "result"; result: ReadingTestResult; resultToken: string; boost: Boost | null }
  | { name: "boostIntro"; result: ReadingTestResult; resultToken: string; token: string; pace: number; words: string[]; questions: Shown[] }
  | { name: "boostRun"; result: ReadingTestResult; resultToken: string; token: string; pace: number; words: string[]; questions: Shown[] }
  | { name: "boostQuestions"; result: ReadingTestResult; resultToken: string; token: string; questions: Shown[] };

function readSeen(): string[] {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    const parsed: unknown = raw === null ? [] : JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string").slice(-20) : [];
  } catch {
    return [];
  }
}

function rememberSeen(id: string): void {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...readSeen().filter((x) => x !== id), id].slice(-20)));
  } catch {
    // Storage unavailable (private mode) — the server still avoids nothing worse than a repeat.
  }
}

/** The short link people share; keeps the visit attributable to the share. */
function shareUrl(): string {
  return `${window.location.origin}/test?utm_source=share&utm_medium=result_card`;
}

const primaryBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-7 py-4 text-[15px] font-semibold text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";
const secondaryBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-4 text-[15px] font-semibold text-ink transition-colors hover:bg-panel";

export default function ReadingSpeedTest(): React.JSX.Element {
  const { lang: siteLang } = useLanguage();
  const c = speedTestCopy[siteLang];
  const lm = leadMagnetCopy[siteLang];
  const [passageLang, setPassageLang] = useState<"en" | "hi">(siteLang);
  const [stage, setStage] = useState<Stage>({ name: "intro" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => setPassageLang(siteLang), [siteLang]);

  const go = useCallback((next: Stage) => {
    setStage(next);
    setError(null);
    topRef.current?.scrollIntoView({ block: "start" });
  }, []);

  async function start(): Promise<void> {
    setPending(true);
    const res = await startReadingTest({ lang: passageLang, exclude: readSeen() });
    setPending(false);
    if (!res.ok) return setError(res.error);
    rememberSeen(res.passage.id);
    trackSpeedTest({ name: "started", lang: passageLang });
    go({ name: "reading", token: res.token, title: res.passage.title, text: res.passage.text });
  }

  async function done(token: string): Promise<void> {
    setPending(true);
    const res = await finishReading({ token });
    setPending(false);
    if (!res.ok) return setError(res.error);
    go({ name: "questions", token: res.token, questions: res.questions });
  }

  async function submit(token: string, answers: number[]): Promise<void> {
    setPending(true);
    const res = await submitReadingAnswers({ token, answers });
    setPending(false);
    if (!res.ok) return setError(res.error);
    trackSpeedTest({ name: "completed", status: res.result.status, profile: res.result.profile, band: res.result.band });
    go({ name: "result", result: res.result, resultToken: res.resultToken, boost: null });
  }

  async function beginBoost(result: ReadingTestResult, resultToken: string): Promise<void> {
    setPending(true);
    const res = await startPracticeDemo({ resultToken });
    setPending(false);
    if (!res.ok) return setError(res.error);
    go({ name: "boostIntro", result, resultToken, token: res.token, pace: res.paceWpm, words: res.words, questions: res.questions });
  }

  async function submitBoost(result: ReadingTestResult, resultToken: string, token: string, answers: number[]): Promise<void> {
    setPending(true);
    const res = await submitPracticeAnswers({ token, answers });
    setPending(false);
    if (!res.ok) return setError(res.error);
    trackSpeedTest({ name: "boost_played", paceWpm: res.paceWpm });
    go({ name: "result", result, resultToken, boost: { pace: res.paceWpm, percent: res.comprehensionPercent } });
  }

  const step = stage.name === "intro" || stage.name === "reading" ? 1 : stage.name === "questions" ? 2 : 3;

  return (
    <section className="border-b border-line px-4 py-10 sm:px-8 sm:py-16" data-speed-test-stage={stage.name}>
      <div ref={topRef} className="mx-auto w-full max-w-2xl scroll-mt-24 rounded-sm border border-line-strong bg-panel2 p-5 sm:p-10">
        {!stage.name.startsWith("boost") && <Steps lm={lm} current={step} />}

        {stage.name === "intro" && (
          <>
            <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-[27px] italic leading-tight text-ink sm:text-[34px]">{lm.headline}</h1>
            <p className="mt-3 text-[15px] font-medium text-ink-dim">{lm.sub}</p>
            <div className="mt-6 rounded-sm border border-line-strong bg-panel p-4 sm:p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{lm.youGetTitle}</p>
              <ul className="mt-3 space-y-2">
                {lm.youGet.map((item) => (
                  <li key={item} className="flex gap-2 text-[14.5px] leading-snug text-ink">
                    <span aria-hidden="true" className="text-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{c.passageLanguage}</p>
            <div className="mt-3 grid grid-cols-2 gap-2" role="radiogroup" aria-label={c.passageLanguage}>
              {(["en", "hi"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={passageLang === option}
                  onClick={() => setPassageLang(option)}
                  className={`rounded-sm border px-4 py-3 text-[14px] transition-colors ${
                    passageLang === option ? "border-gold bg-gold-soft font-semibold text-ink" : "border-line-strong text-ink hover:border-gold/60"
                  }`}
                >
                  {option === "en" ? "English" : "हिंदी"}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => void start()} disabled={pending} className={`${primaryBtn} mt-7`}>
              {pending ? c.loading : c.start}
            </button>
          </>
        )}

        {stage.name === "reading" && (
          <ReadingStage key={stage.token} c={c} title={stage.title} text={stage.text} pending={pending} onDone={() => void done(stage.token)} />
        )}

        {stage.name === "questions" && (
          <OneByOneQuestions
            key={stage.token}
            lm={lm}
            title={c.questionsTitle}
            note={c.passageHidden}
            questions={stage.questions}
            submitLabel={pending ? c.loading : c.seeResult}
            pending={pending}
            onSubmit={(answers) => void submit(stage.token, answers)}
          />
        )}

        {stage.name === "result" &&
          (stage.result.status === "valid" ? (
            <ProfileStage
              c={c}
              lm={lm}
              result={stage.result}
              resultToken={stage.resultToken}
              boost={stage.boost}
              pending={pending}
              onBoost={() => void beginBoost(stage.result, stage.resultToken)}
              onRetry={() => go({ name: "intro" })}
            />
          ) : (
            <InvalidStage c={c} lm={lm} result={stage.result} onRetry={() => go({ name: "intro" })} />
          ))}

        {stage.name === "boostIntro" && (
          <div data-boost-intro>
            <Eyebrow color="text-teal">Brain Boost</Eyebrow>
            <p className="mt-4 text-[16px] leading-relaxed text-ink">{lm.boostIntro(stage.pace)}</p>
            <button type="button" onClick={() => go({ ...stage, name: "boostRun" })} className={`${primaryBtn} mt-7`}>
              {c.practiceBegin}
            </button>
          </div>
        )}

        {stage.name === "boostRun" && (
          <PracticeRun
            words={stage.words}
            pace={stage.pace}
            onFinish={() => go({ name: "boostQuestions", result: stage.result, resultToken: stage.resultToken, token: stage.token, questions: stage.questions })}
          />
        )}

        {stage.name === "boostQuestions" && (
          <OneByOneQuestions
            key={stage.token}
            lm={lm}
            title={c.practiceQuestionsTitle}
            note={null}
            questions={stage.questions}
            submitLabel={pending ? c.loading : c.seeResult}
            pending={pending}
            onSubmit={(answers) => void submitBoost(stage.result, stage.resultToken, stage.token, answers)}
          />
        )}

        {error !== null && (
          <p role="alert" className="mt-4 text-[14px] font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

function Steps({ lm, current }: { lm: LeadMagnetCopy; current: 1 | 2 | 3 }): React.JSX.Element {
  return (
    <div className="mb-6" aria-label={lm.stepOf(current)} data-steps={current}>
      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{lm.stepOf(current)}</p>
      <ol className="mt-2 grid grid-cols-3 gap-1.5">
        {lm.steps.map((label, i) => (
          <li key={label} className="min-w-0">
            <div className={`h-1 rounded-full ${i + 1 <= current ? "bg-gold" : "bg-line"}`} />
            <p className={`mt-1.5 truncate text-[12px] ${i + 1 === current ? "font-semibold text-ink" : "text-ink-faint"}`}>{label}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ReadingStage({
  c,
  title,
  text,
  pending,
  onDone,
}: {
  c: SpeedTestCopy;
  title: string;
  text: string;
  pending: boolean;
  onDone: () => void;
}): React.JSX.Element {
  const endRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    function check(): void {
      const marker = endRef.current;
      if (marker !== null && hasReachedEnd(marker.getBoundingClientRect().top, window.innerHeight)) setReachedEnd(true);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <>
      <p className="text-[13px] text-ink-faint">{c.readingHint}</p>
      <h2 className="mt-5 text-[21px] font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-5 text-[17px] leading-[1.8] text-ink" data-passage>
        {text.split(/\n\s*\n/).map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
      <div ref={endRef} data-passage-end aria-hidden="true" />
      <button type="button" onClick={onDone} disabled={!reachedEnd || pending} className={`${primaryBtn} mt-8`}>
        {pending ? c.loading : c.done}
      </button>
      {!reachedEnd && <p className="mt-2 text-center text-[12.5px] text-ink-faint">{c.scrollHint}</p>}
    </>
  );
}

/** One question at a time with "Question 2 of 5" and a progress bar. */
function OneByOneQuestions({
  lm,
  title,
  note,
  questions,
  submitLabel,
  pending,
  onSubmit,
}: {
  lm: LeadMagnetCopy;
  title: string;
  note: string | null;
  questions: Shown[];
  submitLabel: string;
  pending: boolean;
  onSubmit: (answers: number[]) => void;
}): React.JSX.Element {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [index, setIndex] = useState(0);
  const q = questions[index]!;
  const last = index === questions.length - 1;
  const answered = answers[index] !== null;

  return (
    <div data-question-index={index + 1}>
      <h2 className="text-[19px] font-bold text-ink">{title}</h2>
      {note !== null && <p className="mt-1 text-[13.5px] text-ink-dim">{note}</p>}
      <div className="mt-5 flex items-center justify-between text-[12.5px] text-ink-faint">
        <span>{lm.questionOf(index + 1, questions.length)}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-gold transition-[width] duration-300" style={{ width: `${Math.round(((index + (answered ? 1 : 0)) / questions.length) * 100)}%` }} />
      </div>
      <p className="mt-6 text-[16.5px] font-semibold leading-snug text-ink">{q.question}</p>
      <div className="mt-3 grid gap-2" role="radiogroup" aria-label={q.question}>
        {q.options.map((option, oi) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={answers[index] === oi}
            onClick={() => setAnswers((prev) => prev.map((a, i) => (i === index ? oi : a)))}
            className={`rounded-sm border px-4 py-3.5 text-left text-[15px] transition-colors ${
              answers[index] === oi ? "border-gold bg-gold-soft font-semibold text-ink" : "border-line-strong text-ink hover:border-gold/60"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-7 flex gap-3">
        {index > 0 && (
          <button type="button" onClick={() => setIndex(index - 1)} className="rounded-sm border border-line-strong px-5 py-4 text-[14px] font-semibold text-ink hover:bg-panel">
            {lm.back}
          </button>
        )}
        {last ? (
          <button
            type="button"
            disabled={!answers.every((a) => a !== null) || pending}
            onClick={() => onSubmit(answers.map((a) => a ?? -1))}
            className={primaryBtn}
          >
            {submitLabel}
          </button>
        ) : (
          <button type="button" disabled={!answered} onClick={() => setIndex(index + 1)} className={primaryBtn}>
            {lm.next}
          </button>
        )}
      </div>
    </div>
  );
}

const BANDS: SpeedBand[] = ["developing", "average", "strong", "advanced"];
const SCALE_MAX = 450;

function SpeedMeter({ lm, effectiveWpm, band }: { lm: LeadMagnetCopy; effectiveWpm: number; band: SpeedBand }): React.JSX.Element {
  const position = Math.min(100, Math.round((effectiveWpm / SCALE_MAX) * 100));
  const edges = [0, SPEED_BAND_EDGES.average, SPEED_BAND_EDGES.strong, SPEED_BAND_EDGES.advanced, SCALE_MAX];
  return (
    <div className="mt-5" data-speed-band={band}>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-line">
        {BANDS.map((b, i) => (
          <div
            key={b}
            className={`absolute top-0 h-full ${b === band ? "bg-gold" : i % 2 === 0 ? "bg-line-strong/60" : "bg-line-strong/30"}`}
            style={{ left: `${(edges[i]! / SCALE_MAX) * 100}%`, width: `${((edges[i + 1]! - edges[i]!) / SCALE_MAX) * 100}%` }}
          />
        ))}
      </div>
      <div className="relative h-0">
        <span className="absolute -top-[17px] h-4 w-1 -translate-x-1/2 rounded-full bg-ink" style={{ left: `${position}%` }} aria-hidden="true" />
      </div>
      <div className="mt-2 grid grid-cols-4 text-center text-[11.5px]">
        {BANDS.map((b) => (
          <span key={b} className={b === band ? "font-semibold text-ink" : "text-ink-faint"}>
            {lm.bands[b]}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">{lm.scaleNote}</p>
    </div>
  );
}

function ProfileStage({
  c,
  lm,
  result,
  resultToken,
  boost,
  pending,
  onBoost,
  onRetry,
}: {
  c: SpeedTestCopy;
  lm: LeadMagnetCopy;
  result: ReadingTestResult;
  resultToken: string;
  boost: Boost | null;
  pending: boolean;
  onBoost: () => void;
  onRetry: () => void;
}): React.JSX.Element {
  const [offer, setOffer] = useState<SpeedTestOffer | null>(null);
  const profile = result.profile === null ? null : lm.profiles[result.profile];

  return (
    <div data-result-status={result.status} data-profile={result.profile ?? ""}>
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold">{lm.profileEyebrow}</p>
      <p className="mt-3 text-[13px] text-ink-faint">{c.effectiveSpeed}</p>
      <p className="mt-1 text-[48px] font-extrabold leading-none text-ink sm:text-[60px]" data-effective-wpm>
        {result.effectiveWpm} <span className="text-[18px] font-semibold text-ink-dim">{c.wpm}</span>
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        <Stat label={c.readingSpeed} value={`${result.wpm} ${c.wpm}`} />
        <Stat label={c.comprehension} value={`${result.comprehensionPercent}%`} />
      </dl>
      {result.band !== null && <SpeedMeter lm={lm} effectiveWpm={result.effectiveWpm} band={result.band} />}

      {profile !== null && (
        <div className="mt-7 rounded-sm border border-gold/50 bg-gold-soft p-5" data-profile-card>
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{lm.yourType}</p>
          <h2 className="mt-1 text-[22px] font-bold text-ink">{profile.name}</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink">{profile.summary[0]}</p>
          <p className="mt-1 text-[14.5px] leading-relaxed text-ink-dim">{profile.summary[1]}</p>
          <p className="mt-4 text-[13.5px] font-semibold text-ink">{lm.tipsTitle}</p>
          <ol className="mt-2 space-y-2">
            {profile.tips.map((tip, i) => (
              <li key={tip} className="flex gap-2.5 text-[14.5px] leading-snug text-ink">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-[#1B1508]">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Curiosity before any price: the Brain Boost, or what it showed. */}
      {boost === null ? (
        <button
          type="button"
          onClick={onBoost}
          disabled={pending}
          className="mt-7 w-full rounded-sm border-2 border-teal bg-panel px-5 py-4 text-left transition-colors hover:bg-teal/5 disabled:opacity-60"
          data-boost-cta
        >
          <span className="block text-[16px] font-bold leading-snug text-ink">{lm.boostCta}</span>
          <span className="mt-1 block text-[14px] font-semibold text-teal">{pending ? c.loading : lm.boostCtaSub}</span>
        </button>
      ) : (
        <div className="mt-7 rounded-sm border-2 border-teal bg-panel p-5" data-boost-result>
          <Eyebrow color="text-teal">Brain Boost</Eyebrow>
          <p className="mt-2 text-[18px] font-bold leading-snug text-ink">{lm.boostResult(boost.pace, boost.percent)}</p>
          <p className="mt-1 text-[14.5px] text-ink-dim">{lm.boostResultSub}</p>
        </div>
      )}

      <LeadCapture lm={lm} c={c} result={result} resultToken={resultToken} onOffer={setOffer} />

      <ShareCard lm={lm} c={c} result={result} />

      <ProgramSection lm={lm} offer={offer} />

      <button type="button" onClick={onRetry} className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:text-teal-light">
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {c.retry}
      </button>
    </div>
  );
}

function InvalidStage({ c, lm, result, onRetry }: { c: SpeedTestCopy; lm: LeadMagnetCopy; result: ReadingTestResult; onRetry: () => void }): React.JSX.Element {
  return (
    <div data-result-status={result.status}>
      <h2 className="text-[22px] font-bold text-ink">{lm.invalidTitle}</h2>
      <p className="mt-3 text-[16.5px] leading-relaxed text-ink">
        {result.status === "too_fast" ? c.tooFast : c.lowComprehension(result.comprehensionPercent)}
      </p>
      <button type="button" onClick={onRetry} className={`${primaryBtn} mt-7`}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> {c.retry}
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-sm border border-line-strong bg-panel px-4 py-3">
      <dt className="text-[12px] text-ink-faint">{label}</dt>
      <dd className="mt-1 text-[20px] font-bold text-ink">{value}</dd>
    </div>
  );
}

function LeadCapture({
  lm,
  c,
  result,
  resultToken,
  onOffer,
}: {
  lm: LeadMagnetCopy;
  c: SpeedTestCopy;
  result: ReadingTestResult;
  resultToken: string;
  onOffer: (offer: SpeedTestOffer) => void;
}): React.JSX.Element {
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(): Promise<void> {
    setState("saving");
    setError(null);
    const simulateNow = new URLSearchParams(window.location.search).get("now") ?? undefined;
    const res = await saveSpeedTestResult({ resultToken, phone, firstName, simulateNow, utm: readUtmParams() });
    if (res.ok) {
      trackSpeedTest({ name: "whatsapp_submitted", status: result.status, profile: result.profile });
      if (res.offer !== null) onOffer(res.offer);
      return setState("saved");
    }
    setState("idle");
    setError(res.error);
  }

  return (
    <div className="mt-8 rounded-sm border border-line-strong bg-panel p-5 sm:p-6" data-lead-capture>
      <h3 className="text-[18px] font-bold leading-snug text-ink">{lm.leadTitle}</h3>
      {state === "saved" ? (
        <p className="mt-3 text-[15px] font-medium text-teal" data-lead-saved>
          {lm.leadSaved}
        </p>
      ) : (
        <form
          className="mt-3"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <p className="text-[13.5px] text-ink-dim">{lm.leadSub}</p>
          <label htmlFor="speed-test-phone" className="sr-only">
            {c.phonePlaceholder}
          </label>
          <input
            id="speed-test-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={c.phonePlaceholder}
            className="mt-3 w-full rounded-sm border border-line-strong bg-panel2 px-4 py-3.5 text-[16px] text-ink"
          />
          <label htmlFor="speed-test-name" className="sr-only">
            {c.nameLabel}
          </label>
          <input
            id="speed-test-name"
            type="text"
            autoComplete="given-name"
            maxLength={60}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder={c.nameLabel}
            className="mt-2 w-full rounded-sm border border-line-strong bg-panel2 px-4 py-3.5 text-[16px] text-ink"
          />
          <button type="submit" disabled={phone.trim() === "" || state === "saving"} className={`${primaryBtn} mt-3`}>
            {state === "saving" ? c.loading : lm.leadSubmit}
          </button>
          <p className="mt-2 text-[12px] leading-relaxed text-ink-faint">{c.phoneNote}</p>
          {error !== null && (
            <p role="alert" className="mt-1 text-[13px] text-red-700">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

function ShareCard({ lm, c, result }: { lm: LeadMagnetCopy; c: SpeedTestCopy; result: ReadingTestResult }): React.JSX.Element {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const profileName = result.profile === null ? "" : lm.profiles[result.profile].name;

  async function shareImage(): Promise<void> {
    setBusy(true);
    try {
      const blob = await drawShareCard({
        heading: name.trim() === "" ? lm.profileEyebrow : lm.shareCardName(name.trim()),
        line: lm.shareCardLine(result.effectiveWpm),
        ask: lm.shareCardAsk,
        effectiveWpm: result.effectiveWpm,
        wpmLabel: `${c.effectiveSpeed} · ${c.wpm}`,
        comprehension: `${c.comprehension} ${result.comprehensionPercent}%`,
        profileName,
        url: shareUrl().replace(/^https?:\/\//, "").replace(/\?.*$/, ""),
      });
      const how = await shareOrDownload(blob, lm.shareText(result.effectiveWpm, shareUrl()));
      trackSpeedTest({ name: "shared", method: how === "shared" ? "image" : "link" });
    } catch {
      // Share sheet dismissed or unavailable — nothing to do.
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 border-t border-line-strong pt-6" data-share>
      <p className="text-[15px] font-bold text-ink">{lm.shareTitle}</p>
      <label htmlFor="share-name" className="sr-only">
        {lm.shareNamePlaceholder}
      </label>
      <input
        id="share-name"
        type="text"
        maxLength={30}
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={lm.shareNamePlaceholder}
        className="mt-3 w-full rounded-sm border border-line-strong bg-panel px-4 py-3 text-[15px] text-ink"
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => void shareImage()} disabled={busy} className={secondaryBtn}>
          <Share2 className="h-4 w-4" aria-hidden="true" /> {lm.shareImage}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(lm.shareText(result.effectiveWpm, shareUrl()))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSpeedTest({ name: "shared", method: "whatsapp" })}
          className={secondaryBtn}
        >
          {lm.shareWhatsapp}
        </a>
      </div>
    </div>
  );
}

/** The program comes last and soft: no price-first "Enrol now". */
function ProgramSection({ lm, offer }: { lm: LeadMagnetCopy; offer: SpeedTestOffer | null }): React.JSX.Element {
  return (
    <div className="mt-8 border-t border-line-strong pt-6" data-program-section>
      <h3 className="text-[17px] font-bold text-ink">{lm.programTitle}</h3>
      <ul className="mt-3 space-y-1.5">
        {lm.programLines.map((line) => (
          <li key={line} className="flex gap-2 text-[14.5px] leading-snug text-ink-dim">
            <span aria-hidden="true" className="text-gold">•</span>
            {line}
          </li>
        ))}
      </ul>
      {offer !== null && (
        <SharpBrainPricingProvider initial={offer.pricing} offerId={offer.id}>
          <p className="mt-4 text-[14px] font-semibold text-ink" data-test-offer>
            {lm.offerSaved} <Countdown endsAtMs={offer.expiresAtMs} className="font-bold text-ink" />
          </p>
        </SharpBrainPricingProvider>
      )}
      <div className={`mt-4 grid gap-2 ${offer !== null ? "sm:grid-cols-2" : ""}`}>
        <a href={PROGRAM_HREF} className={secondaryBtn}>
          {lm.seeProgram}
        </a>
        {offer !== null && (
          <a href={`/programs/sharp-brain/offer/${offer.id}`} onClick={() => trackSpeedTest({ name: "offer_used" })} className={primaryBtn}>
            {lm.useOffer}
          </a>
        )}
      </div>
    </div>
  );
}

function PracticeRun({ words, pace, onFinish }: { words: string[]; pace: number; onFinish: () => void }): React.JSX.Element {
  const [index, setIndex] = useState(0);
  // Kept in a ref so a parent re-render (a new onFinish function) never
  // restarts the word timer.
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (index >= words.length) {
      onFinishRef.current();
      return undefined;
    }
    const timer = window.setTimeout(() => setIndex((i) => i + 1), 60_000 / pace);
    return () => window.clearTimeout(timer);
  }, [index, words.length, pace]);

  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center" data-practice-run>
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">Brain Boost · {pace} WPM</p>
      <p className="mt-6 text-center text-[34px] font-semibold text-ink sm:text-[42px]" aria-live="off">
        {words[Math.min(index, words.length - 1)]}
      </p>
      <div className="mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line">
        <div className="h-full bg-gold" style={{ width: `${Math.round((index / words.length) * 100)}%` }} />
      </div>
    </div>
  );
}

