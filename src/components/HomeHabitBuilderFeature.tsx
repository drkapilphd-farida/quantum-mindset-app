"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "./ui";
import { HABIT_BUILDER_APP_URL } from "@/config/habitBuilderSignupLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Low-Commitment On-Ramp™ — positioning fix (see the "Fix Homepage & QSR
// Page Positioning" task). This used to be a hero-scale section (a large
// headline, a dominant 250px phone mockup plus four supporting
// thumbnails) that competed visually with the QSR flagship offer,
// contradicting the site's actual pricing/positioning hierarchy (QSR
// ₹9,999 masterclass = flagship; this ₹99 habit app = a low-commitment
// entry point). Shrunk to a compact banner — one small real screenshot,
// no gallery — and moved lower in page.tsx (below the main QSR push,
// above the footer) so it never sits between the first scroll and the
// flagship offer. Copy now explicitly names itself as the lower-
// commitment alternative rather than implying it through layout alone.
export default function HomeHabitBuilderFeature(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.homeHabitFeature;

  return (
    <section className="border-b border-line bg-panel2 px-6 py-12 sm:px-8">
      <div className="mx-auto flex max-w-content flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative hidden w-14 flex-none overflow-hidden rounded-[10px] border border-line-strong bg-panel shadow-[0_6px_16px_rgba(34,31,29,0.1)] sm:block">
            <div className="relative aspect-[738/1270] w-full">
              <Image
                src="/habit_dashboard_clean.png"
                alt={section.mainScreenshotAlt}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          </div>
          <div className="max-w-lg">
            <Eyebrow color="text-ink-faint">{section.eyebrow}</Eyebrow>
            <h2 className="mt-2 text-[18px] font-bold leading-snug text-ink sm:text-[20px]">{section.title}</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-dim">{section.lead}</p>
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.05em] text-ink-faint">
              {section.freeLabel} · {section.priceLabel} · {section.noSubscriptionLabel}
            </p>
          </div>
        </div>

        <a
          href={HABIT_BUILDER_APP_URL}
          onClick={() => trackGaEvent("signup_cta_click", { location: "home_habit_feature" })}
          className="group inline-flex flex-none items-center gap-2 whitespace-nowrap rounded-sm border border-line-strong px-6 py-3 text-[13.5px] font-semibold text-ink transition-colors hover:bg-panel"
        >
          {section.cta}
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>
  );
}
