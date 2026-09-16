"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// SECTION 6 — 21-Day Course Journey™. Compact 3-stage accordion (details/
// summary, same pattern as the site's FAQ accordions) rather than a long
// wall of text — each stage expands to reveal its broad topic list. All
// topic labels are the broad-overview stage descriptions supplied in the
// master prompt, not invented exact lesson titles.
export default function MindResetJourney(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.mindResetLanding.journey;

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8">
      <div className="mx-auto max-w-content">
        <div className="mb-12 max-w-xl">
          <Eyebrow color="text-rose">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
          <p className="mt-3 text-[14.5px] text-ink-dim">{section.desc}</p>
        </div>

        <div className="mx-auto max-w-2xl space-y-4">
          {section.stages.map((stage, index) => (
            <details key={stage.label} className="group rounded-sm border border-line-strong bg-panel2" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:content-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-rose/50 bg-rose-soft font-mono text-[13px] font-semibold text-rose">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-faint">{stage.label}</p>
                    <p className="text-[16px] font-bold leading-snug text-ink">{stage.title}</p>
                  </div>
                </div>
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line-strong text-[13px] text-ink-faint transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="border-t border-line px-6 pb-5 pt-4">
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {stage.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-dim">
                      <span className="mt-[7px] h-1 w-1 flex-none rounded-full bg-rose" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
