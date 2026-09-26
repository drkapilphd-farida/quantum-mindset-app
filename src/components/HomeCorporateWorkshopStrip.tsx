"use client";

import { trackGaEvent } from "@/lib/analytics/ga4";

// For Corporate Teams™ (see the "Executive Brain Performance Workshop:
// page fixes + homepage positioning" task, section 2.4) — a short,
// lower-page strip pointing corporate/HR visitors at the Executive
// workshop's own #corporate section, distinct from
// HomeExecutiveWorkshopFeature's own individual-seat framing above.
// Heading matches ExecutiveWorkshopCorporate.tsx's own headline verbatim
// (not paraphrased) so the two pages read as one consistent message.
export function HomeCorporateWorkshopStrip(): React.JSX.Element {
  return (
    <section className="border-b border-line bg-panel2 px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-teal">For Corporate Teams</p>
          <h2 className="mt-2 text-[20px] font-bold leading-tight text-ink sm:text-[24px]">
            Bring the Executive Brain Performance Workshop to your team.
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">
            In-house brain performance programmes for leadership teams — stress regulation, focus and decision clarity, with measurable before/after
            results.
          </p>
        </div>
        <a
          href="/executive-brain-workshop#corporate"
          onClick={() => trackGaEvent("signup_cta_click", { location: "home_corporate_strip" })}
          className="inline-flex flex-none items-center justify-center rounded-sm border border-teal/60 px-5 py-2.5 text-[13.5px] font-semibold text-teal transition-colors hover:bg-teal-soft"
        >
          Enquire for your team →
        </a>
      </div>
    </section>
  );
}
