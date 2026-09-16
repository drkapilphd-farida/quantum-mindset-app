"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

type BandKey = "low" | "moderate" | "high";

// 0–7 Low / 8–14 Moderate / 15–20 High, per spec — applied per-category
// (each category is naturally 0–20) and, for the overall figure, to the
// average of the three category scores rather than the raw 0–60 sum
// (see i18n.ts's own doc comment on `overthinkingTestLanding` for why).
function bandFor(score0to20: number): BandKey {
  if (score0to20 <= 7) return "low";
  if (score0to20 <= 14) return "moderate";
  return "high";
}

type Stage = "intro" | "quiz" | "results";

// The Overthinking Test™ (/mind-assessment) — 15 statements across 3
// categories (5 each), one question per screen with a progress
// indicator and a working Back button. All copy is i18n-driven
// (t.overthinkingTestLanding) so the EN/हिंदी toggle works through the
// entire flow, including the quiz questions themselves.
//
// Positioning fix (see the "Remove Lead-Capture Gate, Show Full Report
// Directly" task): this used to gate the 3-category breakdown behind a
// Name + WhatsApp Number form, submitted via a Server Action
// (submitOverthinkingTestLead) that saved to Supabase and/or emailed a
// notification. That submission was the thing breaking in production
// (see the two incident-fix tasks before this one) — rather than keep
// patching a step that isn't reliable yet, the gate is removed entirely
// here. The full report (all 3 category scores/bands, not just the
// overall teaser) now renders immediately once the last question is
// answered — no form, no submit step, no network call standing between
// a visitor and their result. The backend lead-storage pieces
// (submitOverthinkingTestLead.ts, overthinkingTestLeadSchema.ts,
// sendOverthinkingTestLeadNotification.ts, the Supabase migration, and
// buildOverthinkingTestWhatsAppLink) are deliberately left in place,
// unused for now — real backend work worth keeping for whenever lead
// capture is reconsidered, per this task's own instruction not to
// delete "the underlying lead-storage mechanism."
export default function OverthinkingTestExperience(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.overthinkingTestLanding;

  const flatQuestions = useMemo(
    () =>
      section.categories.flatMap((category) =>
        category.statements.map((statement) => ({
          categoryKey: category.key,
          categoryLabel: category.label,
          statement,
        })),
      ),
    [section.categories],
  );
  const totalQuestions = flatQuestions.length;

  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(totalQuestions).fill(null) as (number | null)[]);

  function selectAnswer(score: number): void {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = score;
      return next;
    });
  }

  function goNext(): void {
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((index) => index + 1);
    } else {
      setStage("results");
    }
  }

  function goBack(): void {
    setQuestionIndex((index) => Math.max(0, index - 1));
  }

  function restart(): void {
    setStage("intro");
    setQuestionIndex(0);
    setAnswers(Array(totalQuestions).fill(null) as (number | null)[]);
  }

  const scoresByCategory = useMemo(() => {
    return section.categories.map((category, categoryIndex) => {
      const start = categoryIndex * 5;
      const categoryAnswers = answers.slice(start, start + 5);
      const score = categoryAnswers.reduce((sum: number, value) => sum + (value ?? 0), 0);
      return { key: category.key, label: category.label, score };
    });
  }, [answers, section.categories]);

  const overallScore = scoresByCategory.reduce((sum, category) => sum + category.score, 0);
  const overallAverage = Math.round(overallScore / 3);
  const overallBand = bandFor(overallAverage);

  if (stage === "intro") {
    return (
      <section className="border-b border-line px-6 py-20 text-center sm:px-8 sm:py-28">
        <div className="mx-auto max-w-xl">
          <Eyebrow color="text-rose">{section.hero.eyebrow}</Eyebrow>
          <h1 className="mt-4 text-[30px] font-extrabold leading-tight sm:text-[38px]">{section.hero.headline}</h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-dim">{section.hero.sub}</p>
          <button
            type="button"
            onClick={() => setStage("quiz")}
            className="group mt-9 inline-flex items-center gap-2.5 rounded-sm bg-rose px-8 py-[17px] text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e]"
          >
            {section.hero.startCta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>
    );
  }

  if (stage === "quiz") {
    const question = flatQuestions[questionIndex];
    if (question === undefined) return <></>;
    const currentAnswer = answers[questionIndex] ?? null;

    return (
      <section className="border-b border-line px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center justify-between">
            {questionIndex > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-dim transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {section.backLabel}
              </button>
            ) : (
              <span />
            )}
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">
              {section.progress.label} {questionIndex + 1} {section.progress.of} {totalQuestions}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line-strong">
            <div
              className="h-full rounded-full bg-rose transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint">
            {question.categoryLabel}
          </p>
          <h2 className="mt-3 text-[21px] font-bold leading-snug text-ink sm:text-[24px]">{question.statement}</h2>

          <div className="mt-7 space-y-2.5">
            {section.scaleLabels.map((label, scoreIndex) => {
              const isSelected = currentAnswer === scoreIndex;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => selectAnswer(scoreIndex)}
                  className={`w-full rounded-sm border px-5 py-3.5 text-left text-[15px] font-semibold transition-colors ${
                    isSelected
                      ? "border-rose bg-rose-soft/50 text-ink"
                      : "border-line-strong bg-panel2 text-ink-dim hover:border-ink-dim"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            data-testid="quiz-next"
            onClick={goNext}
            disabled={currentAnswer === null}
            className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-rose px-7 py-[15px] text-[14.5px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {questionIndex < totalQuestions - 1 ? section.progress.label + " " + (questionIndex + 2) : section.fullReport.title}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>
    );
  }

  // stage === "results" — full report shown immediately, no gate.
  return (
    <section className="border-b border-line px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-xl">
        <div className="rounded-sm border-2 border-rose bg-rose-soft/40 px-7 py-8 text-center sm:px-9">
          <Eyebrow color="text-rose">{section.teaser.title}</Eyebrow>
          <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.05em] text-ink-faint">
            {section.teaser.overallScoreLabel}
          </p>
          <p className="mt-1.5 text-[26px] font-extrabold text-ink">{section.bands[overallBand].label}</p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{section.bands[overallBand].shortLine}</p>
        </div>

        <div className="mt-6 rounded-sm border border-line-strong bg-panel2 px-7 py-7 sm:px-9">
          <h3 className="text-[18px] font-bold text-ink">{section.fullReport.title}</h3>

          <div className="mt-5 space-y-4">
            {scoresByCategory.map((category) => {
              const band = section.bands[bandFor(category.score)];
              return (
                <div key={category.key} className="rounded-sm border border-line-strong bg-panel p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[14.5px] font-bold text-ink">{category.label}</p>
                    <p className="font-mono text-[12px] text-ink-faint">{category.score}/20</p>
                  </div>
                  <p className="mt-1.5 text-[13px] font-semibold text-rose">{band.label}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-dim">{band.desc}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-ink-faint">{section.disclaimer}</p>
        </div>

        <div className="mt-5 rounded-sm border-2 border-rose/50 bg-rose-soft/30 px-7 py-6 text-center">
          <p className="text-[15px] font-bold text-ink">{section.fullReport.courseTitle}</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-dim">{section.fullReport.courseDesc}</p>
          <a
            href="/mentoring/overthinking-course"
            className="group mt-4 inline-flex items-center gap-2.5 rounded-sm bg-rose px-7 py-[13px] text-[13.5px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e]"
          >
            {section.fullReport.courseCta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="mt-5 text-center">
          <button type="button" onClick={restart} className="text-[13px] font-semibold text-ink-faint underline hover:text-ink">
            {section.restartLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
