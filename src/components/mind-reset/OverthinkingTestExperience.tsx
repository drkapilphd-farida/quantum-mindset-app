"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";
import { submitOverthinkingTestLead } from "@/app/mind-assessment/actions/submitOverthinkingTestLead";
import { OverthinkingTestLeadInputSchema } from "@/app/mind-assessment/actions/overthinkingTestLeadSchema";
import { buildOverthinkingTestWhatsAppLink } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

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

const LeadFormSchema = OverthinkingTestLeadInputSchema.pick({ fullName: true, whatsappNumber: true });
type LeadFormValues = z.infer<typeof LeadFormSchema>;

type Stage = "intro" | "quiz" | "results";

// The Overthinking Test™ (/mind-assessment) — 15 statements across 3
// categories (5 each), one question per screen with a progress
// indicator and a working Back button, per the "Build the Overthinking
// Test Free Assessment" task. All copy is i18n-driven
// (t.overthinkingTestLanding) so the EN/हिंदी toggle works through the
// entire flow, including the quiz questions themselves.
//
// Results render in two stages on the same screen (never two separate
// routes/screens): the overall band teaser is always visible the moment
// the quiz finishes; the 3-category breakdown and course invite stay
// behind the name/WhatsApp lead form until it's submitted. The lead is
// saved via submitOverthinkingTestLead (Supabase, same "leads" pattern
// already used by the Discover Your Learning Potential quiz and the
// franchise application form) the moment the form succeeds — this is
// the durable record, independent of whether the visitor goes on to tap
// Send on the follow-up WhatsApp message. That WhatsApp hand-off is
// attempted automatically right after a successful save (best-effort —
// browsers commonly block a window.open() that happens after an awaited
// server call, since it breaks the direct user-gesture chain), with the
// same link also rendered as an always-reliable manual button in the
// unlocked report, so the flow never depends on the auto-open working.
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
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: { fullName: "", whatsappNumber: "" },
  });

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
    setSubmitted(false);
    setSubmittedName("");
    setServerError(null);
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

  async function onSubmitLead(values: LeadFormValues): Promise<void> {
    setServerError(null);
    const overthinkingCategory = scoresByCategory.find((category) => category.key === "overthinking");
    const worryCategory = scoresByCategory.find((category) => category.key === "worry");
    const stressCategory = scoresByCategory.find((category) => category.key === "stress");

    const result = await submitOverthinkingTestLead({
      fullName: values.fullName,
      whatsappNumber: values.whatsappNumber,
      overthinkingScore: overthinkingCategory?.score ?? 0,
      worryScore: worryCategory?.score ?? 0,
      stressScore: stressCategory?.score ?? 0,
      overallScore,
    });

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setSubmitted(true);
    setSubmittedName(values.fullName);
    trackGaEvent("signup_cta_click", { location: "overthinking_test_lead_saved" });

    const waLink = buildOverthinkingTestWhatsAppLink({
      name: values.fullName,
      overthinkingBand: section.bands[bandFor(overthinkingCategory?.score ?? 0)].label,
      worryBand: section.bands[bandFor(worryCategory?.score ?? 0)].label,
      stressBand: section.bands[bandFor(stressCategory?.score ?? 0)].label,
    });
    // Best-effort — see this file's own doc comment on why this can be
    // silently blocked, and why the report below always also renders a
    // manual button using the exact same link.
    window.open(waLink, "_blank", "noopener,noreferrer");
    trackGaEvent("whatsapp_click", { location: "overthinking_test_auto_open" });
  }

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
            {questionIndex < totalQuestions - 1 ? section.progress.label + " " + (questionIndex + 2) : section.teaser.title}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>
    );
  }

  // stage === "results"
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

        {!submitted ? (
          <form
            onSubmit={(event) => void handleSubmit(onSubmitLead)(event)}
            noValidate
            className="mt-6 rounded-sm border border-line-strong bg-panel2 px-7 py-7 sm:px-9"
          >
            <h3 className="text-[18px] font-bold text-ink">{section.gateForm.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-dim">{section.gateForm.desc}</p>

            <div className="mt-5 space-y-3.5">
              <div>
                <label htmlFor="fullName" className="text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-faint">
                  {section.gateForm.nameLabel}
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder={section.gateForm.namePlaceholder}
                  {...register("fullName")}
                  className="mt-1.5 w-full rounded-sm border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink outline-none transition-colors focus:border-rose"
                />
                {errors.fullName && <p className="mt-1 text-[12px] text-rose">{errors.fullName.message}</p>}
              </div>

              <div>
                <label
                  htmlFor="whatsappNumber"
                  className="text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-faint"
                >
                  {section.gateForm.phoneLabel}
                </label>
                <input
                  id="whatsappNumber"
                  type="tel"
                  autoComplete="tel"
                  placeholder={section.gateForm.phonePlaceholder}
                  {...register("whatsappNumber")}
                  className="mt-1.5 w-full rounded-sm border border-line-strong bg-panel px-4 py-3 text-[14.5px] text-ink outline-none transition-colors focus:border-rose"
                />
                {errors.whatsappNumber && <p className="mt-1 text-[12px] text-rose">{errors.whatsappNumber.message}</p>}
              </div>
            </div>

            <p className="mt-3.5 text-[12px] leading-relaxed text-ink-faint">{section.gateForm.consentLine}</p>
            {serverError !== null && <p className="mt-2 text-[12.5px] text-rose">{serverError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-rose px-7 py-[15px] text-[14.5px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? section.gateForm.submittingLabel : section.gateForm.submitLabel}
            </button>
          </form>
        ) : (
          <div className="mt-6">
            <div className="rounded-sm border border-line-strong bg-panel2 px-7 py-7 sm:px-9">
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

              <a
                href={buildOverthinkingTestWhatsAppLink({
                  name: submittedName,
                  overthinkingBand: section.bands[bandFor(scoresByCategory[0]?.score ?? 0)].label,
                  worryBand: section.bands[bandFor(scoresByCategory[1]?.score ?? 0)].label,
                  stressBand: section.bands[bandFor(scoresByCategory[2]?.score ?? 0)].label,
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGaEvent("whatsapp_click", { location: "overthinking_test_report" })}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-teal/60 px-7 py-[15px] text-[14px] font-semibold text-teal transition-colors hover:bg-teal-soft"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {section.fullReport.whatsappCta}
              </a>
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
        )}
      </div>
    </section>
  );
}
