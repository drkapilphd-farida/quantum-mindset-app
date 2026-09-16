"use client";

import { Check, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// SECTION 8 — What You Get™. The core pricing-correction section: a
// universal-inclusions list (both plans) rendered separately from, and
// visually distinct from, the single ₹999-only addition — never
// presented as one combined list the way the old courseLanding.inside
// did with "2 live sessions" folded in as a universal item.
export default function MindResetIncluded(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.included;

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-12 max-w-xl">
          <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-sm border border-line-strong bg-panel2 p-7">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
              {section.universalLabel}
            </p>
            <div className="mt-4 space-y-2.5">
              {section.universalItems.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-teal" aria-hidden="true" />
                  <p className="text-[14px] leading-relaxed text-ink-dim">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-sm border-2 border-gold/50 bg-gold-soft/40 p-7 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-gold-soft">
              <Sparkles className="h-5 w-5 text-gold-dim" aria-hidden="true" />
            </div>
            <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-gold-dim">
              {section.extraLabel}
            </p>
            <p className="mt-2 text-[16px] font-bold leading-snug text-ink">{section.extraItem}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
