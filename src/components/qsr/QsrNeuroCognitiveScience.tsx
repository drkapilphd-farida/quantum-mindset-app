"use client";

import { Gauge, Activity, Zap, Waves, Brain, CircleX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

const METRIC_ICONS = [Gauge, Activity, Zap] as const;

// Science-Backed Neuro-Cognitive Positioning™ — real, already-computed
// metrics (Brain Score, comprehension %, streak consistency — see
// practiceHistory.ts / ThirtyDayCurriculumOverview.tsx) as clean
// typographic stat cards, no chart/dashboard image standing in for real
// EEG data that doesn't exist for the online cohort. The single-city
// "EEG available in Vadodara" highlight box that used to sit at the
// bottom of this section is gone (see the "Homepage, QSR & Multi-City
// EEG Rewrite" task) — the offline EEG track is now offered across 6
// cities, not just Vadodara, so it has its own dedicated section
// (OfflineEegWorkshopSection) further down this page instead of living
// here as a single-city aside.
export default function QsrNeuroCognitiveScience(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.neuroCognitive;

  return (
    <section id="neuro-cognitive" className="border-b border-line px-6 py-24 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mb-14 max-w-xl">
          <Eyebrow color="text-gold">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[28px] font-extrabold leading-tight sm:text-[34px]">{section.title}</h2>
          <p className="mt-3 text-[15.5px] text-ink-dim">{section.desc}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {section.metrics.map((metric, index) => {
            const Icon = METRIC_ICONS[index % METRIC_ICONS.length] ?? Gauge;
            return (
              <div key={metric.label} className="rounded-sm border border-line bg-panel2 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold-soft">
                  <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[16.5px] font-bold leading-snug text-ink">{metric.label}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-dim">{metric.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Normal Reading vs. Quantum Speed Reading (see the "Homepage &
            QSR Conversion Rewrite" task) — replaces the earlier plain
            alpha/theta callout with a fuller side-by-side comparison; the
            same alpha/theta framing now lives inside the right-hand
            column's second point rather than a separate block. */}
        <div className="mt-8 rounded-sm border border-line-strong bg-panel p-7 sm:p-9">
          <h3 className="text-[18px] font-bold leading-snug text-ink">{section.comparison.title}</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-sm border border-line bg-panel2 p-5">
              <p className="inline-flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-[0.05em] text-ink-faint">
                <CircleX className="h-4 w-4 flex-none" aria-hidden="true" />
                {section.comparison.normal.label}
              </p>
              <ul className="mt-4 space-y-2.5">
                {section.comparison.normal.points.map((point) => (
                  <li key={point} className="text-[14.5px] leading-relaxed text-ink-dim">
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-line pt-3 text-[13.5px] font-semibold text-ink">
                {section.comparison.normal.result}
              </p>
            </div>
            <div className="rounded-sm border border-teal/40 bg-teal-soft/20 p-5">
              <p className="inline-flex items-center gap-2 font-mono text-[11.5px] font-bold uppercase tracking-[0.05em] text-teal">
                <Waves className="h-4 w-4 flex-none" aria-hidden="true" />
                {section.comparison.quantum.label}
              </p>
              <ul className="mt-4 space-y-2.5">
                {section.comparison.quantum.points.map((point) => (
                  <li key={point} className="text-[14.5px] leading-relaxed text-ink-dim">
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-teal/30 pt-3 text-[13.5px] font-semibold text-ink">
                {section.comparison.quantum.result}
              </p>
            </div>
          </div>

          <p className="mt-6 text-[13px] leading-relaxed text-ink-dim">{section.comparison.measuredNote}</p>

          <div className="mt-5 flex items-start gap-3 rounded-sm border border-line bg-panel2 p-5">
            <Brain className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
            <p className="text-[14.5px] font-semibold leading-relaxed text-ink">
              {section.comparison.notHypnosisLine}
            </p>
          </div>

          <p className="mt-4 text-[11.5px] leading-relaxed text-ink-faint">{section.comparison.researchNote}</p>

          <p className="mt-4 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-dim">
            {section.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
