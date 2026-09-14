"use client";

import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Eyebrow } from "../ui";

// Every detail here that isn't yet confirmed renders as a bracketed
// placeholder string straight from i18n (venueLine/dateLine/timeLine) —
// no invented address, date, or time. pilotNote is real, honest "limited
// seats, pilot batch" framing, not fabricated urgency.
export default function QsrMumbaiVenue(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrMumbaiLanding.venue;

  const rows = [
    { icon: MapPin, label: section.venueLine },
    { icon: Calendar, label: section.dateLine },
    { icon: Clock, label: section.timeLine },
  ];

  return (
    <section className="border-b border-line bg-panel px-6 py-20 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl rounded-sm border border-line-strong bg-panel2 p-7 sm:p-9">
          <Eyebrow color="text-gold">{section.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">{section.title}</h2>

          <div className="mt-5 space-y-2.5">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start gap-2.5 text-[14.5px] text-ink-dim">
                <row.icon className="mt-0.5 h-4 w-4 flex-none text-ink-faint" aria-hidden="true" />
                {row.label}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-2.5 border-t border-line pt-5 text-[14.5px] leading-relaxed text-ink-dim">
            <Users className="mt-0.5 h-4 w-4 flex-none text-gold" aria-hidden="true" />
            {section.pilotNote}
          </div>
        </div>
      </div>
    </section>
  );
}
