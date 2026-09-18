"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow, CtaButton } from "./ui";
import { EEG_WORKSHOP_CITIES } from "@/config/eegWorkshopCities";
import { buildOfflineEegWorkshopWhatsAppLink } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

type OfflineEegWorkshopSectionProps = {
  // "full": the primary placement on the QSR page — full copy, 3-step
  // how-it-works, and every city's own CTA. "teaser": the shorter
  // homepage placement — one line + a single CTA pointing at the full
  // section on the QSR page (id="offline-eeg" below), not a duplicate
  // city grid.
  variant: "full" | "teaser";
};

// Offline QSR + EEG Cognitive Testing — multi-city (see the "Homepage,
// QSR & Multi-City EEG Rewrite" task). Replaces the old single-line
// "EEG available in Vadodara" mention (QsrNeuroCognitiveScience) and the
// old Mumbai-only workshop banner (HomeMumbaiWorkshopFeature/
// QsrMumbaiWorkshopCard, both removed from these pages already). City
// list/status (waitlist vs. confirmed) lives in eegWorkshopCities.ts —
// this component only renders whatever that config says, so flipping a
// city's status is a one-file edit + redeploy, not a change here.
export default function OfflineEegWorkshopSection({
  variant,
}: OfflineEegWorkshopSectionProps): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.offlineEegWorkshop;

  if (variant === "teaser") {
    return (
      <section className="border-b border-line bg-panel px-6 py-14 sm:px-8">
        <div className="mx-auto flex max-w-content flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-[19px] font-bold leading-snug text-ink sm:text-[21px]">{section.title}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">{section.teaserDesc}</p>
          </div>
          <CtaButton
            href="/programs/quantum-speed-reading#offline-eeg"
            variant="ghost"
            accent="teal"
            className="flex-none whitespace-nowrap"
          >
            {section.teaserCta}
          </CtaButton>
        </div>
      </section>
    );
  }

  return (
    <section id="offline-eeg" className="border-b border-line px-6 py-24 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-content">
        <div className="mb-10 max-w-2xl">
          <Eyebrow color="text-teal">{section.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{section.title}</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-dim">{section.desc}</p>
        </div>

        {/* How It Works — 3 numbered steps */}
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {section.steps.map((step, index) => (
            <div key={step} className="rounded-sm border border-line bg-panel2 p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-teal/40 bg-teal-soft font-mono text-[13px] font-bold text-teal">
                {index + 1}
              </span>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">{step}</p>
            </div>
          ))}
        </div>

        {/* Cities — each with its own honest CTA state (waitlist vs.
            confirmed), per eegWorkshopCities.ts. */}
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
          {section.citiesLabel}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EEG_WORKSHOP_CITIES.map((cityEntry) => {
            const isConfirmed = cityEntry.status === "confirmed";
            return (
              <div
                key={cityEntry.city}
                className="flex flex-col justify-between gap-4 rounded-sm border border-line bg-panel2 p-6"
              >
                <div>
                  <p className="inline-flex items-center gap-2 text-[15.5px] font-bold text-ink">
                    <MapPin className="h-4 w-4 flex-none text-teal" aria-hidden="true" />
                    {cityEntry.city}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-faint">
                    {isConfirmed && cityEntry.confirmedDateLine !== undefined
                      ? cityEntry.confirmedDateLine
                      : section.waitlistCta}
                  </p>
                </div>
                <a
                  href={buildOfflineEegWorkshopWhatsAppLink(cityEntry.city, cityEntry.status)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGaEvent("whatsapp_click", {
                      location: `offline_eeg_${cityEntry.city.toLowerCase()}`,
                    })
                  }
                  className={
                    isConfirmed
                      ? "inline-flex items-center justify-center gap-2 rounded-sm bg-teal px-5 py-2.5 text-[13px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-teal-light"
                      : "inline-flex items-center justify-center gap-2 rounded-sm border border-teal/60 px-5 py-2.5 text-[13px] font-semibold text-teal transition-colors hover:bg-teal-soft"
                  }
                >
                  {isConfirmed ? section.registerCta : section.waitlistCta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
