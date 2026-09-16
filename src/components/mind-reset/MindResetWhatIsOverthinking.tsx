"use client";

import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// SECTION 3 — the "clean visual comparison" the master prompt asks for
// (Productive Thinking: Understand → Decide → Act vs. Overthinking:
// Repeat → Worry → Mental Exhaustion), as two simple chip rows —
// educational, not medical framing throughout.
export default function MindResetWhatIsOverthinking(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.whatIsOverthinking;

  return (
    <section className="border-b border-line px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          </div>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-dim">{section.desc}</p>
        </div>

        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="rounded-sm border border-teal/40 bg-teal-soft/30 px-6 py-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-teal">
              {section.productiveLabel}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {section.productiveSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2.5">
                  <span className="rounded-full bg-panel px-4 py-1.5 text-[13.5px] font-semibold text-ink">{step}</span>
                  {index < section.productiveSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-teal" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-rose/40 bg-rose-soft/30 px-6 py-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-rose">
              {section.overthinkingLabel}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {section.overthinkingSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2.5">
                  <span className="rounded-full bg-panel px-4 py-1.5 text-[13.5px] font-semibold text-ink">{step}</span>
                  {index < section.overthinkingSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-rose" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
