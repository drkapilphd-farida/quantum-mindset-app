"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";
import { CLASSPLUS_OVERTHINKING_COURSE_LINK } from "@/config/overthinkingCoursePaymentLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// SECTION 13 — Final CTA. No Habit Builder button here or anywhere else
// on this page (see the master prompt's Step 1b) — exactly two
// conversion paths, purchase and the free assessment.
export default function MindResetFinalCta(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.finalCta;

  return (
    <section className="px-6 py-20 text-center sm:px-8">
      <div className="mx-auto max-w-xl">
        <div className="flex justify-center">
          <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[34px]">{section.headline}</h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-dim">{section.desc}</p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={CLASSPLUS_OVERTHINKING_COURSE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("classplus_click", { location: "mind_reset_final_cta" })}
            className="group inline-flex items-center gap-2.5 rounded-sm bg-rose px-8 py-[17px] text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e]"
          >
            {section.ctaPrimary}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="/mind-assessment"
            className="inline-flex items-center gap-2 rounded-sm border border-line-strong px-8 py-[17px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
          >
            {section.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
