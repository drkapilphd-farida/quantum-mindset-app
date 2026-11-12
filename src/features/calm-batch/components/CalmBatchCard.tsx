"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { calmMindBatch } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import { batchState, formatBatchDate, type Lang } from "../batch";
import { CALM_COPY } from "../copy";

// "Prefer learning in a group?" card (owner's brief): hub (above the plans),
// the stress page (after "What you get") and the overthinking course page.
// Once the start date has passed it shows the waitlist line instead
// (checked in the browser, so a pre-built page never shows a past date).

const say = (text: { en: string; hi: string }, lang: Lang): string => text[lang];

/** lang: the page's language; omitted on pages that follow the site language (e.g. the overthinking course). */
export function CalmBatchCard({ lang: pageLang, className = "" }: { lang?: Lang; className?: string }): React.JSX.Element {
  const siteLang = useLanguage().lang;
  const lang = pageLang ?? siteLang;
  const [ended, setEnded] = useState(false);
  useEffect(() => setEnded(batchState(Date.now(), null).status === "ended"), []);
  const c = CALM_COPY.card;
  const start = formatBatchDate(calmMindBatch.nextBatch.startDate, lang);
  const href = lang === "hi" ? "/calm-mind-batch?lang=hi" : "/calm-mind-batch";
  return (
    <div className={`flex flex-col gap-4 rounded-[14px] border-2 border-[#F2A93B] bg-[#FFF8EC] p-5 text-[#0E1B2C] sm:flex-row sm:items-center sm:justify-between sm:p-6 ${className}`} data-calm-card>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-[#4A5568]">{say(c.lead, lang)}</p>
        <p className="mt-0.5 text-[19px] font-extrabold leading-snug sm:text-[21px]">{say(c.name, lang)}</p>
        <p className="mt-1 text-[15px] text-[#33415C]">{ended ? say(CALM_COPY.ended, lang) : say(c.detail(start), lang)}</p>
      </div>
      <Link href={href} className="inline-flex min-h-12 flex-none items-center justify-center rounded-[10px] bg-[#F2A93B] px-6 py-3 text-[16px] font-extrabold text-[#0E1B2C] hover:bg-[#E39A2A]" data-calm-card-link>
        {say(c.button, lang)} →
      </Link>
    </div>
  );
}
