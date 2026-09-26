"use client";

import { trackGaEvent } from "@/lib/analytics/ga4";

// For Corporate Teams™ (see the "Executive Brain Performance Workshop:
// page fixes + homepage positioning" task, section 2.4) — a short,
// lower-page strip pointing corporate/HR visitors at the Executive
// workshop's own #corporate section, distinct from
// HomeExecutiveWorkshopFeature's own individual-seat framing above.
export function HomeCorporateWorkshopStrip(): React.JSX.Element {
  return (
    <section className="border-b border-line bg-panel2 px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-xl text-[14.5px] leading-relaxed text-ink-dim">
          <span className="font-semibold text-ink">For Corporate Teams — </span>
          In-house brain performance programmes for leadership teams — stress regulation, focus and decision clarity, with measurable before/after
          results.
        </p>
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
