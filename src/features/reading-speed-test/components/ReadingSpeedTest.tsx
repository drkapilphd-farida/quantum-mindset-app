"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "@/components/ui";
import GuaranteeBadge from "@/components/sharp-brain/GuaranteeBadge";
import { waLink } from "@/config/site.config";
import { trackLead } from "@/lib/analytics/conversions";
import { inr } from "@/features/sharp-brain-enrol/copy";
import {
  BatchCheckout,
  Countdown,
  SharpBrainPricingProvider,
  useEnrolLabel,
  useNextBatch,
} from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
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
import { hasReachedEnd } from "../scoring";

// Free Reading Speed Test. Step 1 is the only "your reading speed" result:
// self-paced reading timed by the server, 5 detail questions with the
// passage hidden, scored on the server. Step 2 (optional, only after a
// valid Step 1) is the app-practice demo: words shown one at a time at a
// pace set by the server from the Step 1 result — never called "your
// reading speed".

const ENROL_HREF = "/programs/sharp-brain#enrol";
const SEEN_KEY = "reading-speed-test-seen";

type Shown = { question: string; options: string[] };
type Stage =
  | { name: "intro" }
  | { name: "reading"; token: string; title: string; text: string }
  | { name: "questions"; token: string; questions: Shown[] }
  | { name: "result"; result: ReadingTestResult; resultToken: string }
  | { name: "practiceIntro"; result: ReadingTestResult; token: string; pace: number; words: string[]; questions: Shown[] }
  | { name: "practiceRun"; result: ReadingTestResult; token: string; pace: number; words: string[]; questions: Shown[] }
  | { name: "practiceQuestions"; result: ReadingTestResult; token: string; questions: Shown[] }
  | { name: "practiceResult"; result: ReadingTestResult; pace: number; percent: number };

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

const primaryBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-7 py-4 text-[15px] font-semibold text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";
const secondaryBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-4 text-[15px] font-semibold text-ink transition-colors hover:bg-panel";

export default function ReadingSpeedTest(): React.JSX.Element {
  const { lang: siteLang } = useLanguage();
  const c = speedTestCopy[siteLang];
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
    trackLead("Free Reading Speed Test", "free_test_started");
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
    trackLead("Free Reading Speed Test", "free_test_completed");
    go({ name: "result", result: res.result, resultToken: res.resultToken });
  }

  async function beginPractice(result: ReadingTestResult, resultToken: string): Promise<void> {
    setPending(true);
    const res = await startPracticeDemo({ resultToken });
    setPending(false);
    if (!res.ok) return setError(res.error);
    go({ name: "practiceIntro", result, token: res.token, pace: res.paceWpm, words: res.words, questions: res.questions });
  }

  async function submitPractice(result: ReadingTestResult, token: string, answers: number[]): Promise<void> {
    setPending(true);
    const res = await submitPracticeAnswers({ token, answers });
    setPending(false);
    if (!res.ok) return setError(res.error);
    go({ name: "practiceResult", result, pace: res.paceWpm, percent: res.comprehensionPercent });
  }

  return (
    <section className="border-b border-line px-4 py-12 sm:px-8 sm:py-20" data-speed-test-stage={stage.name}>
      <div ref={topRef} className="mx-auto w-full max-w-2xl scroll-mt-24 rounded-sm border border-line-strong bg-panel2 p-5 sm:p-10">
        {stage.name === "intro" && (
          <>
            <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-display text-[28px] italic leading-tight text-ink sm:text-[34px]">{c.title}</h1>
            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-dim">{c.intro}</p>
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
          <QuestionsStage
            key={stage.token}
            title={c.questionsTitle}
            note={c.passageHidden}
            questions={stage.questions}
            submitLabel={pending ? c.loading : c.seeResult}
            pending={pending}
            onSubmit={(answers) => void submit(stage.token, answers)}
          />
        )}

        {stage.name === "result" && (
          <ResultStage
            c={c}
            result={stage.result}
            resultToken={stage.resultToken}
            pending={pending}
            onRetry={() => go({ name: "intro" })}
            onPractice={() => void beginPractice(stage.result, stage.resultToken)}
          />
        )}

        {stage.name === "practiceIntro" && (
          <>
            <Eyebrow color="text-teal">Sharp Brain</Eyebrow>
            <p className="mt-4 text-[16px] leading-relaxed text-ink">{c.practiceIntro(stage.pace)}</p>
            <button type="button" onClick={() => go({ ...stage, name: "practiceRun" })} className={`${primaryBtn} mt-7`}>
              {c.practiceBegin}
            </button>
          </>
        )}

        {stage.name === "practiceRun" && (
          <PracticeRun
            words={stage.words}
            pace={stage.pace}
            onFinish={() => go({ name: "practiceQuestions", result: stage.result, token: stage.token, questions: stage.questions })}
          />
        )}

        {stage.name === "practiceQuestions" && (
          <QuestionsStage
            key={stage.token}
            title={c.practiceQuestionsTitle}
            note={null}
            questions={stage.questions}
            submitLabel={pending ? c.loading : c.seeResult}
            pending={pending}
            onSubmit={(answers) => void submitPractice(stage.result, stage.token, answers)}
          />
        )}

        {stage.name === "practiceResult" && (
          <>
            <Eyebrow color="text-teal">Sharp Brain</Eyebrow>
            <p className="mt-4 text-[17px] leading-relaxed text-ink" data-practice-result>
              {c.practiceResult(stage.pace, stage.percent)}
            </p>
            <NextStep c={c} effectiveWpm={stage.result.effectiveWpm} />
            <button type="button" onClick={() => go({ name: "intro" })} className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:text-teal-light">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {c.retry}
            </button>
          </>
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
      <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{c.readingHint}</p>
      <h2 className="mt-4 text-[20px] font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-[16.5px] leading-[1.75] text-ink" data-passage>
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

function QuestionsStage({
  title,
  note,
  questions,
  submitLabel,
  pending,
  onSubmit,
}: {
  title: string;
  note: string | null;
  questions: Shown[];
  submitLabel: string;
  pending: boolean;
  onSubmit: (answers: number[]) => void;
}): React.JSX.Element {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const complete = answers.every((a) => a !== null);

  return (
    <>
      <h2 className="text-[20px] font-bold text-ink">{title}</h2>
      {note !== null && <p className="mt-1 text-[13.5px] text-ink-dim">{note}</p>}
      <ol className="mt-6 space-y-6">
        {questions.map((q, qi) => (
          <li key={q.question}>
            <p className="text-[15.5px] font-semibold text-ink">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-2 grid gap-2" role="radiogroup" aria-label={q.question}>
              {q.options.map((option, oi) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={answers[qi] === oi}
                  onClick={() => setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))}
                  className={`rounded-sm border px-4 py-3 text-left text-[14.5px] transition-colors ${
                    answers[qi] === oi ? "border-gold bg-gold-soft font-semibold text-ink" : "border-line-strong text-ink hover:border-gold/60"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        disabled={!complete || pending}
        onClick={() => onSubmit(answers.map((a) => a ?? -1))}
        className={`${primaryBtn} mt-8`}
      >
        {submitLabel}
      </button>
    </>
  );
}

function ResultStage({
  c,
  result,
  resultToken,
  pending,
  onRetry,
  onPractice,
}: {
  c: SpeedTestCopy;
  result: ReadingTestResult;
  resultToken: string;
  pending: boolean;
  onRetry: () => void;
  onPractice: () => void;
}): React.JSX.Element {
  const valid = result.status === "valid";
  // Set once a WhatsApp number is saved after a valid test (₹1,000 off, 48 h).
  const [offer, setOffer] = useState<SpeedTestOffer | null>(null);

  return (
    <div data-result-status={result.status}>
      {valid && (
        <>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold">{c.effectiveSpeed}</p>
          <p className="mt-2 text-[44px] font-extrabold leading-none text-ink sm:text-[56px]">
            {result.effectiveWpm} <span className="text-[18px] font-semibold text-ink-dim">{c.wpm}</span>
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <Stat label={c.readingSpeed} value={`${result.wpm} ${c.wpm}`} />
            <Stat label={c.comprehension} value={`${result.comprehensionPercent}%`} />
          </dl>
          <p className="mt-5 text-[14px] leading-relaxed text-ink-dim">{c.validNote}</p>
          <button type="button" onClick={onPractice} disabled={pending} className={`${secondaryBtn} mt-6`}>
            {pending ? c.loading : c.practiceCta}
          </button>
        </>
      )}

      {result.status === "too_fast" && <p className="text-[17px] leading-relaxed text-ink">{c.tooFast}</p>}
      {result.status === "low_comprehension" && (
        <p className="text-[17px] leading-relaxed text-ink">{c.lowComprehension(result.comprehensionPercent)}</p>
      )}

      {!valid && (
        <button type="button" onClick={onRetry} className={`${primaryBtn} mt-6`}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> {c.retry}
        </button>
      )}

      {offer !== null ? (
        <TestOffer c={c} offer={offer} effectiveWpm={valid ? result.effectiveWpm : null} />
      ) : (
        <NextStep c={c} effectiveWpm={valid ? result.effectiveWpm : null} />
      )}
      {result.status !== "too_fast" && <SaveResult c={c} resultToken={resultToken} offerEligible={valid} onOffer={setOffer} />}
      {valid && (
        <button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:text-teal-light">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {c.retry}
        </button>
      )}
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

function NextStep({ c, effectiveWpm }: { c: SpeedTestCopy; effectiveWpm: number | null }): React.JSX.Element {
  const enrol = useEnrolLabel();
  return (
    <div className="mt-8 border-t border-line-strong pt-6">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">{c.nextStep}</p>
      <a href={ENROL_HREF} className={primaryBtn}>
        {enrol}
      </a>
      <a href={waLink(c.whatsappMessage(effectiveWpm))} target="_blank" rel="noopener noreferrer" className={`${secondaryBtn} mt-3`}>
        {c.whatsapp}
      </a>
      <GuaranteeBadge className="mt-4" />
    </div>
  );
}

// The Reading Speed Test offer: ₹1,000 off for 48 hours, tied to the
// WhatsApp number. The countdown and prices come from the server; the
// WhatsApp message carries the offer page link so the team can resend it.
function TestOffer({ c, offer, effectiveWpm }: { c: SpeedTestCopy; offer: SpeedTestOffer; effectiveWpm: number | null }): React.JSX.Element {
  const offerUrl = `${window.location.origin}/programs/sharp-brain/offer/${offer.id}`;
  return (
    <div className="mt-8 rounded-sm border border-gold bg-gold-soft p-5 sm:p-6" data-test-offer>
      <SharpBrainPricingProvider initial={offer.pricing} offerId={offer.id}>
        <TestOfferHeadline c={c} expiresAtMs={offer.expiresAtMs} />
        <div className="mt-5">
          <BatchCheckout location="speed_test_offer" />
        </div>
      </SharpBrainPricingProvider>
      <a href={waLink(c.offerWhatsappMessage(effectiveWpm, offerUrl))} target="_blank" rel="noopener noreferrer" className={`${secondaryBtn} mt-4 bg-void`}>
        {c.offerWhatsapp}
      </a>
      <a href="/programs/sharp-brain" className="mt-3 inline-block text-[13px] font-semibold text-ink-dim hover:text-ink">
        {c.seeProgram}
      </a>
      <GuaranteeBadge className="mt-4" />
    </div>
  );
}

function TestOfferHeadline({ c, expiresAtMs }: { c: SpeedTestCopy; expiresAtMs: number }): React.JSX.Element {
  const next = useNextBatch();
  return (
    <>
      <p className="text-[18px] font-bold leading-snug text-ink">{c.offerUnlocked(inr(next?.amountInr ?? 8999), inr(next?.regularInr ?? 9999))}</p>
      <p className="mt-1 text-[14px] text-ink-dim">
        {c.offerValid} <Countdown endsAtMs={expiresAtMs} className="font-semibold text-ink" />
      </p>
    </>
  );
}

function SaveResult({
  c,
  resultToken,
  offerEligible,
  onOffer,
}: {
  c: SpeedTestCopy;
  resultToken: string;
  offerEligible: boolean;
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
    const res = await saveSpeedTestResult({ resultToken, phone, firstName, simulateNow });
    if (res.ok) {
      if (res.offer !== null) onOffer(res.offer);
      return setState("saved");
    }
    setState("idle");
    setError(res.error);
  }

  if (state === "saved") return <p className="mt-6 text-[14px] font-medium text-teal">{c.phoneSaved}</p>;

  return (
    <form
      className="mt-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <p className="text-[13.5px] font-semibold text-ink">{offerEligible ? c.phoneLabelOffer : c.phoneLabel}</p>
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
        className="mt-2 w-full rounded-sm border border-line-strong bg-panel px-4 py-3 text-[15px] text-ink"
      />
      <label htmlFor="speed-test-phone" className="sr-only">
        {c.phonePlaceholder}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="speed-test-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder={c.phonePlaceholder}
          className="min-w-0 flex-1 rounded-sm border border-line-strong bg-panel px-4 py-3 text-[15px] text-ink"
        />
        <button type="submit" disabled={phone.trim() === "" || state === "saving"} className="rounded-sm border border-line-strong px-5 py-3 text-[14px] font-semibold text-ink hover:bg-panel disabled:opacity-50">
          {state === "saving" ? c.loading : c.phoneSubmit}
        </button>
      </div>
      <p className="mt-1.5 text-[12px] text-ink-faint">
        {c.phoneNote}
        {offerEligible && ` ${c.offerLinked}`}
      </p>
      {error !== null && <p role="alert" className="mt-1 text-[13px] text-red-700">{error}</p>}
    </form>
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
    <div className="flex min-h-[220px] flex-col items-center justify-center" data-practice-run>
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">{pace} WPM</p>
      <p className="mt-6 text-center text-[34px] font-semibold text-ink sm:text-[42px]" aria-live="off">
        {words[Math.min(index, words.length - 1)]}
      </p>
      <div className="mt-8 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line">
        <div className="h-full bg-gold" style={{ width: `${Math.round((index / words.length) * 100)}%` }} />
      </div>
    </div>
  );
}
