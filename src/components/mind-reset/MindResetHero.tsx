"use client";

import { useLanguage } from "@/context/LanguageContext";
import { CLASSPLUS_OVERTHINKING_COURSE_LINK } from "@/config/overthinkingCoursePaymentLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Dark Product Hero™ — a bounded island (dark only for this hero +
// MindResetNav above it; every section below returns to the site's
// normal light .warm-light treatment). Two CTAs per the master prompt's
// Section 1 spec (primary purchase, secondary free assessment) —
// deliberately no embedded pricing-tier row here (the old three-tier
// hero strip this page used to have is gone along with the ₹2,999/
// ₹5,999/₹8,999 model), since this page's actual pricing comparison
// lives in its own dedicated section further down.
export default function MindResetHero(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.hero;

  return (
    <section id="top" className="relative overflow-hidden bg-[#12162a] px-6 pb-20 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-20">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(235,138,150,0.16),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl">
        <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#eb8a96]">
          {section.eyebrow}
        </p>

        <p className="mt-4 font-display text-[16px] italic text-[#c7cae0] sm:text-[18px]">{section.productName}</p>

        <h1 className="mt-3 text-[32px] font-extrabold leading-[1.15] tracking-tight text-[#f5f1e6] sm:text-[42px] lg:text-[48px]">
          {section.headline}
        </h1>

        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.1em] text-[#eb8a96]/90">{section.tagline}</p>

        <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-[#aeb2c8] sm:text-[16.5px]">
          {section.sub}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={CLASSPLUS_OVERTHINKING_COURSE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("classplus_click", { location: "mind_reset_hero" })}
            className="group inline-flex items-center gap-2.5 rounded-sm bg-[#eb8a96] px-8 py-[17px] text-[15px] font-semibold text-[#12162a] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f2a1ab]"
          >
            {section.ctaPrimary}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="/mind-assessment"
            className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-8 py-[17px] text-[15px] font-semibold text-[#e4e6f0] transition-colors hover:bg-white/[0.05]"
          >
            {section.ctaSecondary}
          </a>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.06em] text-[#8b8fa8]">{section.trustLine}</p>
      </div>
    </section>
  );
}
