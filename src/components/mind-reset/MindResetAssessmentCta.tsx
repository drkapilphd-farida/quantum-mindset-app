"use client";

import { Brain, HeartPulse, Gauge } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

const SCORE_ICONS = [Brain, HeartPulse, Gauge] as const;

// SECTION 4 — Free Mind Assessment CTA™. Judgment call: the master
// prompt's standalone "4. SELF-ASSESSMENT TEST" spec (headline "How Is
// Your Mind Doing Today?") and its numbered "SECTION 4" in the page
// structure (headline "Understand Your Thought, Worry & Stress
// Patterns", 3 score cards) describe the same CTA concept twice with
// different headlines — treated as one section here (using SECTION 4's
// more detailed version, since it's the one placed in the explicit
// ordered structure) rather than building two near-duplicate assessment
// CTAs back to back. No actual scores are shown (per spec — the
// assessment logic itself isn't implemented yet, see /mind-assessment).
export default function MindResetAssessmentCta(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.assessmentCta;

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl rounded-sm border border-rose/40 bg-rose-soft/30 px-7 py-9 text-center sm:px-10 sm:py-10">
          <div className="flex justify-center">
            <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          </div>
          <h2 className="mt-4 text-[24px] font-extrabold leading-tight sm:text-[28px]">{section.title}</h2>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-dim">{section.desc}</p>

          <div className="mx-auto mt-7 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
            {section.scoreCards.map((card, index) => {
              const Icon = SCORE_ICONS[index % SCORE_ICONS.length] ?? Brain;
              return (
                <div key={card.title} className="rounded-sm border border-line-strong bg-panel px-4 py-5 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-rose/40 bg-rose-soft">
                    <Icon className="h-4 w-4 text-rose" aria-hidden="true" />
                  </div>
                  <p className="mt-2.5 text-[12.5px] font-semibold leading-snug text-ink">{card.title}</p>
                </div>
              );
            })}
          </div>

          <a
            href="/mind-assessment"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-sm bg-rose px-7 py-[15px] text-[14.5px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#b8757e]"
          >
            {section.cta}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <p className="mx-auto mt-4 max-w-sm text-[12px] leading-relaxed text-ink-faint">{section.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
