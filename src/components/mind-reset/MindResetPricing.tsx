"use client";

import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";
import { CLASSPLUS_OVERTHINKING_COURSE_LINK } from "@/config/overthinkingCoursePaymentLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// SECTION 10 — Pricing™. The single most important pricing-correction
// section: Card 1 (₹499) never lists live sessions; Card 2 (₹999) lists
// the same feature list PLUS a distinctly highlighted (bordered, icon,
// accent-colored) live-sessions line, not just another bullet in the
// same list. Both CTAs use the same real Classplus link — tier/price
// selection happens at Classplus checkout itself, same "all access
// lengths selected at checkout" pattern the old 3-tier courseLanding
// page already used (see CLASSPLUS_OVERTHINKING_COURSE_LINK's own doc
// comment).
export default function MindResetPricing(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.pricing;
  const { card1, card2 } = section;

  return (
    <section id="pricing" className="border-b border-line px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <div className="flex justify-center">
            <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          </div>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Card 1 — primary, ₹499, no live sessions anywhere in this list */}
          <div className="flex flex-col rounded-sm border-2 border-rose bg-panel p-7 shadow-[0_16px_36px_rgba(166,97,107,0.14)] sm:p-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-rose">{card1.name}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-[38px] font-extrabold text-ink">{card1.price}</span>
              <span className="text-[13px] text-ink-faint">{card1.period}</span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">{card1.desc}</p>

            <div className="mt-6 space-y-2.5">
              {card1.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-teal" aria-hidden="true" />
                  <p className="text-[13.5px] leading-relaxed text-ink-dim">{feature}</p>
                </div>
              ))}
            </div>

            <a
              href={CLASSPLUS_OVERTHINKING_COURSE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGaEvent("classplus_click", { location: "mind_reset_pricing_499" })}
              className="group mt-7 inline-flex items-center justify-center gap-2.5 rounded-sm bg-rose px-6 py-[14px] text-[14px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e]"
            >
              {card1.cta}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Card 2 — secondary, ₹999, same list PLUS a highlighted live-sessions line */}
          <div className="flex flex-col rounded-sm border border-line-strong bg-panel2 p-7 sm:p-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint">{card2.name}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-[38px] font-extrabold text-ink">{card2.price}</span>
              <span className="text-[13px] text-ink-faint">{card2.period}</span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-dim">{card2.desc}</p>

            <div className="mt-6 space-y-2.5">
              {card2.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-ink-faint" aria-hidden="true" />
                  <p className="text-[13.5px] leading-relaxed text-ink-dim">{feature}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-sm border-2 border-gold/50 bg-gold-soft/40 px-4 py-3.5">
              <Sparkles className="mt-0.5 h-4 w-4 flex-none text-gold-dim" aria-hidden="true" />
              <p className="text-[13.5px] font-bold leading-snug text-ink">{card2.liveSessionHighlight}</p>
            </div>

            <a
              href={CLASSPLUS_OVERTHINKING_COURSE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGaEvent("classplus_click", { location: "mind_reset_pricing_999" })}
              className="group mt-7 inline-flex items-center justify-center gap-2.5 rounded-sm border border-line-strong px-6 py-[14px] text-[14px] font-semibold text-ink transition-colors hover:bg-panel"
            >
              {card2.cta}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-[12.5px] leading-relaxed text-ink-faint">
          {section.comparisonNote}
        </p>
        <p className="mx-auto mt-1.5 max-w-2xl text-center font-mono text-[11px] uppercase tracking-[0.05em] text-ink-faint">
          {section.classplusNote}
        </p>
      </div>
    </section>
  );
}
