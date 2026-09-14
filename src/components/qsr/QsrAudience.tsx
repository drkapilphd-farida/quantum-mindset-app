"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Positioning fix — this used to open with a 3-column "Three kinds of
// people take this Masterclass" persona grid (Students/Professionals/
// Lifelong Learners), which diluted the ICP. Removed (see i18n.ts's own
// doc comment on qsrLanding.audience) — what's left is the one piece
// that was never about persona-spreading: concrete, day-to-day
// parent-facing outcomes, plus one real trust quote.
export default function QsrAudience(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.audience;
  // Ananya R.'s quote is the featured card in QsrVideoTestimonials below,
  // on the same page — picking a different real QSR quote here (by the
  // stable, untranslated `id`, not `name` — the Hindi name is a
  // different string entirely, and array position broke once real
  // testimonials replaced the placeholder pool) so the two sections
  // don't repeat each other. Karan Mehra's quote ties directly to this
  // section's exam/study-time framing. Falls back to the first QSR entry
  // if that id is ever removed.
  const qsrTestimonials = t.testimonials.items.filter((item) => item.programKey === "qsr");
  const trustQuote = qsrTestimonials.find((item) => item.id === "karan-mehra") ?? qsrTestimonials[0];

  // Visual Rhythm™ — lg:py-16 trims desktop-only vertical padding (base
  // py-24 unchanged, so mobile/tablet render identically to before).
  return (
    <section id="who-its-for" className="border-b border-line px-6 py-24 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl rounded-sm border border-line-strong bg-panel2 px-7 py-6">
          <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[18px] font-bold text-ink">{section.title}</h2>
          <div className="mt-4 space-y-2.5">
            {section.items.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-teal" aria-hidden="true" />
                <p className="text-[15.5px] leading-relaxed text-ink-dim">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {trustQuote !== undefined && (
          <p className="mx-auto mt-10 max-w-xl border-l-2 border-gold/40 pl-4 text-[16.5px] italic leading-relaxed text-ink-dim">
            &ldquo;{trustQuote.quote}&rdquo;
            <span className="not-italic text-ink-faint"> — {trustQuote.name}</span>
          </p>
        )}
      </div>
    </section>
  );
}
