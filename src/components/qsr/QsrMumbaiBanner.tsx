"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// One small, deliberately minor addition to the otherwise-locked main
// QSR page (see the "Add Mumbai In-Person QSR Workshop" task) — a thin
// inline note, not a card or banner with its own visual weight, so it
// never competes with the hero/CTA directly below it.
export default function QsrMumbaiBanner(): React.JSX.Element {
  const { t } = useLanguage();
  const section = t.qsrLanding.mumbaiBanner;

  return (
    <div className="border-b border-line bg-panel2 px-6 py-2.5 text-center sm:px-8">
      <Link
        href="/programs/quantum-speed-reading-mumbai"
        className="inline-flex items-center gap-2 text-[12.5px] font-medium text-ink-dim hover:text-ink"
      >
        <MapPin className="h-3.5 w-3.5 flex-none text-teal" aria-hidden="true" />
        {section.text}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
