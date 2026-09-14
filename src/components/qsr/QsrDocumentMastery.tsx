"use client";

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Positioning fix (see the "QSR Page Cleanup & Credibility Fixes" task,
// Fix 3) — this used to be a 5-screenshot promotional showcase (one large
// primary image + a 4-image supporting grid) for the app's separate
// "AI Document Supercharger" (Upload & Learn) feature. That much visual
// weight, on a page that should have exactly one clear offer (₹9,999
// QSR), risked reading as a second product pitch — shrunk to a single
// compact "what's included" list instead, no screenshots, no separate
// CTA. Deliberately doesn't claim this is free/included with enrollment
// (see the i18n `documentMastery` block's own doc comment on why).
export default function QsrDocumentMastery(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.documentMastery;

  return (
    // Visual Rhythm™ — deliberately NOT `bg-panel`, so it still alternates
    // correctly against QsrCurriculum (`bg-panel`) right after it. Since
    // QsrAllRoundDevelopment was removed (an earlier positioning fix —
    // see page.tsx's own doc comment), this sits directly after
    // QsrFocusScreenTime, also plain — a minor, accepted same-background
    // adjacency rather than cascading a background flip through several
    // unrelated sections.
    <section id="document-mastery" className="border-b border-line px-6 py-16 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl rounded-sm border border-line-strong bg-panel2 px-7 py-6">
          <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[18px] font-bold text-ink">{section.title}</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{section.desc}</p>
          <div className="mt-4 space-y-2.5">
            {section.items.map((item) => (
              <div key={item.title} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-teal" aria-hidden="true" />
                <p className="text-[14.5px] leading-relaxed text-ink-dim">
                  <span className="font-semibold text-ink">{item.title}</span> — {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
