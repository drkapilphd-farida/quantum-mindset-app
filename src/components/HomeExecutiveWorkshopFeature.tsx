"use client";

import Image from "next/image";
import { Activity, Gauge, MessageCircle } from "lucide-react";
import { EegWaveform } from "@/features/executive-brain-workshop/components/EegWaveform";
import { trackGaEvent } from "@/lib/analytics/ga4";

const POINTS = [
  { icon: Activity, text: "See your brain state change live on EEG" },
  { icon: Gauge, text: "Measure your own before-and-after" },
  { icon: MessageCircle, text: "21 days of guided practice on WhatsApp" },
] as const;

// Homepage Featured Block™ (see the "Executive Brain Performance
// Workshop: page fixes + homepage positioning" task, section 2.3) —
// placed directly below HeroSection, before ProgramSelector (the
// homepage has a single static hero, not a slider, so "first slide"
// wasn't an option — see that task's own note on this choice).
// Deliberately its own dark, navy/teal "spotlight" block rather than
// matching the homepage's own .warm-light palette: reuses the exact
// same colors as the landing page (/executive-brain-workshop) via
// literal hex values, not the --color-void/panel/ink/teal/gold custom
// properties those pages read from directly — this section sits INSIDE
// the homepage's own `.warm-light`-scoped wrapper, which remaps those
// same token names to the warm parchment palette, so referencing the
// token names here would silently render the wrong (warm) colors
// instead of the intended navy ones.
export function HomeExecutiveWorkshopFeature(): React.JSX.Element {
  function handleReserveClick(): void {
    trackGaEvent("signup_cta_click", { location: "home_executive_workshop_feature" });
  }

  return (
    <section className="relative overflow-hidden border-b border-[#1c2333] bg-[#0b0f17] px-6 py-14 text-[#edeef3] sm:px-8 sm:py-16">
      <EegWaveform className="pointer-events-none absolute inset-x-0 top-1/2 h-56 w-full -translate-y-1/2 text-[#178a7a]/20" />
      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="inline-flex rounded-full border border-[#2a3247] bg-[#121826] px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#22a896]">
            For Leaders &amp; Professionals
          </span>
          <h2 className="mt-4 text-[26px] font-bold tracking-tight sm:text-[32px]">Executive Brain Performance Workshop</h2>
          <p className="mt-2 text-[15px] text-[#9ca3b8]">Stay Calm Under Pressure. Focus Deeper. Decide Clearer.</p>

          <ul className="mt-5 space-y-2.5">
            {POINTS.map((point) => (
              <li key={point.text} className="flex items-center gap-2.5 text-[14px] text-[#9ca3b8]">
                <point.icon className="size-4 flex-none text-[#22a896]" aria-hidden="true" strokeWidth={1.75} />
                {point.text}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[13px] text-[#616b82]">Sunday, 18 October 2026 · Hotel Better Home International, Sahar Road, Andheri East, Mumbai</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/executive-brain-workshop#pricing"
              onClick={handleReserveClick}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#d4af37] px-6 py-3 text-[14.5px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              Reserve My Seat
            </a>
            <a
              href="/executive-brain-workshop#corporate"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#2a3247] px-6 py-3 text-[14.5px] font-semibold text-[#edeef3] transition-colors hover:bg-[#121826]"
            >
              For Corporate Teams
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[260px] lg:max-w-none">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#2a3247]">
            <Image
              src="/founder-warm.jpg"
              alt="Dr. Kapil Dev Sharma, mind trainer and founder of Mind Ur Mind"
              fill
              sizes="(min-width: 1024px) 320px, 60vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
