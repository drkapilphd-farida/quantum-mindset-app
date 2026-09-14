"use client";

import { Activity, Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Cognitive & Focus Engagement Demo™ — deliberately NOT titled or worded
// as a "Brain Test" or "Brain Mapping" anywhere (non-negotiable, see the
// "Build the Mumbai Offline Workshop Feature + Fix EEG Copy" task, Fix
// A — this exact term was chosen there over an earlier "Attention &
// Focus Engagement Snapshot" pass). The disclaimer line is rendered as
// its own visually distinct callout, not buried in the description
// paragraph, so the "not diagnostic/medical" framing is hard to miss.
// Note: this is intentionally different, more conservative language
// than QsrNeuroCognitiveScience.tsx's existing Vadodara EEG section on
// the main QSR page ("Brain Mapping," "clinical cognitive tracking") —
// that section predates this rule and describes a different, hardware-
// verified offline offering; it's out of scope here (the QSR page's own
// FAQ mention of it was removed in this same task, but the standalone
// Vadodara section itself was left untouched) and the inconsistency
// between the two is still worth a dedicated cleanup pass.
export default function QsrMumbaiEegDemo(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrMumbaiLanding.eegDemo;

  return (
    <section className="border-b border-line px-6 py-20 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl rounded-sm border border-teal/40 bg-teal-soft/30 p-7 sm:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-teal/50 bg-teal-soft">
            <Activity className="h-5 w-5 text-teal" aria-hidden="true" />
          </div>
          <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">{section.title}</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-dim">{section.desc}</p>

          <div className="mt-5 flex items-start gap-2.5 rounded-sm border border-line-strong bg-panel px-5 py-4">
            <Info className="mt-0.5 h-4 w-4 flex-none text-ink-faint" aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-ink-dim">{section.disclaimer}</p>
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <h3 className="text-[15px] font-bold text-ink">{section.addOn.title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{section.addOn.desc}</p>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.05em] text-gold-dim">
              {section.addOn.pricePlaceholder}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
