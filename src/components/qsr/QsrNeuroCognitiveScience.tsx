"use client";

import { Gauge, Activity, Zap, Waves, Brain, ShieldCheck, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow, Pill } from "../ui";
import { WHATSAPP_VADODARA_EEG_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

const METRIC_ICONS = [Gauge, Activity, Zap] as const;

// Science-Backed Neuro-Cognitive Positioning™ — real, already-computed
// metrics (Brain Score, comprehension %, streak consistency — see
// practiceHistory.ts / ThirtyDayCurriculumOverview.tsx) as clean
// typographic stat cards, no chart/dashboard image standing in for real
// EEG data that doesn't exist for the online cohort. The EEG/Vadodara
// block below is the one place on this page an actual hardware claim is
// made — confirmed as a real, existing offline offering before writing
// this copy, not assumed.
export default function QsrNeuroCognitiveScience(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.neuroCognitive;
  const eeg = t.qsrLanding.eeg;

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

        <div className="mt-8 rounded-sm border border-line-strong bg-panel p-7 sm:p-9">
          <h3 className="font-mono text-[12px] font-bold uppercase tracking-[0.06em] text-ink-dim">
            {section.brainStates.title}
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Waves className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
              <div>
                <p className="text-[14.5px] font-bold text-ink">{section.brainStates.alpha.title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-dim">{section.brainStates.alpha.desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Brain className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
              <div>
                <p className="text-[14.5px] font-bold text-ink">{section.brainStates.theta.title}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-dim">{section.brainStates.theta.desc}</p>
              </div>
            </div>
          </div>
          <p className="mt-6 border-t border-line pt-4 text-[11.5px] leading-relaxed text-ink-dim">
            {section.disclaimer}
          </p>
        </div>

        {/* Vadodara EEG Highlight™ — the one hardware-backed claim on this
            page, kept visually distinct (gold-bordered, not the plain
            panel above) so it reads as a genuine bonus for one specific
            group, not blended into the general online-program science
            framing above it. */}
        <div className="mt-8 rounded-sm border border-gold/50 bg-gold-soft/30 p-7 sm:p-9">
          <div className="flex flex-wrap items-start gap-3.5">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-gold/50 bg-gold-soft">
              <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[15.5px] font-bold leading-snug text-ink">{eeg.badge}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-gold">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {eeg.badgeLocation}
              </p>
            </div>
          </div>

          <h3 className="mt-6 text-[16.5px] font-bold text-ink">{eeg.title}</h3>
          <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed text-ink-dim">{eeg.desc}</p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {eeg.pills.map((pill) => (
              <Pill key={pill}>{pill}</Pill>
            ))}
          </div>

          <a
            href={WHATSAPP_VADODARA_EEG_INQUIRY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("whatsapp_click", { location: "qsr_eeg_vadodara" })}
            className="mt-6 inline-flex items-center gap-2 rounded-sm border border-gold/60 px-6 py-3 text-[13.5px] font-semibold text-gold transition-colors hover:bg-gold-soft"
          >
            {eeg.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
