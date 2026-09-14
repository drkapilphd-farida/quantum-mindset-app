"use client";

import { Eye, Timer, PhoneOff } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

const TIP_ICONS = [Eye, Timer, PhoneOff] as const;

// Positioning fix (see the "QSR Page Cleanup & Credibility Fixes" task,
// Fix 2) — this used to end with a styled "Pairs Well With QSR" cross-
// sell card promoting the ₹99 Quantum Mindset & Habit Builder inside the
// body of this ₹9,999 flagship page, a second price point diluting the
// one offer this page should be selling. Removed; the Habit Builder
// still has a real link on this page via the shared Footer's own
// program column (see Footer.tsx), just no longer a promotional card in
// the body.
export default function QsrFocusScreenTime(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.focusInDistractedWorld;

  // Visual Rhythm™ — lg:py-20 trims desktop-only vertical padding (base
  // py-24 unchanged, so mobile/tablet render identically to before).
  return (
    <section className="border-b border-line px-6 py-24 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-content">
        <div className="mb-10 max-w-xl">
          <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[34px]">{section.title}</h2>
          <p className="mt-3 text-[15.5px] text-ink-dim">{section.intro}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {section.tips.map((tip, index) => {
            const Icon = TIP_ICONS[index % TIP_ICONS.length] ?? Eye;
            return (
              <div key={tip.title} className="rounded-sm border border-line bg-panel2 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-teal/40 bg-teal-soft">
                  <Icon className="h-5 w-5 text-teal" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[16px] font-bold leading-snug text-ink">{tip.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-dim">{tip.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
