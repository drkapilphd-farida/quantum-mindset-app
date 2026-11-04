"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { contact, qsrGuarantee, waLink } from "@/config/site.config";
import { SHARP_BRAIN_DEMO_VIDEO_ID } from "@/config/liveClassCycle";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { readUtmParams } from "@/lib/analytics/utm";
import { DEMO_WATCHED_WHATSAPP, sharpBrainDemoCopy } from "@/lib/sharpBrainCopy";
import { langFromParam } from "@/features/telepathy-workshop/telepathyWorkshop";
import { inr } from "@/features/sharp-brain-enrol/copy";
import { SeatCheckout, SeatCounter, useCurrentPrice } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import { TrackedYouTube } from "./TrackedYouTube";

// /sharp-brain/demo: the demo video, then two big buttons — "Book a seat"
// (opens the same checkout as the program page, right here) and WhatsApp /
// call — then three lines about the program, the guarantee and the real
// seat counter. Plays, % watched and every button tap go to GA with the
// UTM source.

const utm = (): string => readUtmParams().utm_source ?? "(none)";

export function SharpBrainDemo(): React.JSX.Element {
  const { lang, setLang } = useLanguage();
  const c = sharpBrainDemoCopy[lang];
  const price = useCurrentPrice();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const urlLang = langFromParam(new URLSearchParams(window.location.search).get("lang"));
    if (urlLang !== null) setLang(urlLang);
  }, [setLang]);

  return (
    <section className="px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-[28px] font-extrabold leading-tight sm:text-[38px]">{c.h1}</h1>

        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-sm border border-line-strong bg-panel2">
          {SHARP_BRAIN_DEMO_VIDEO_ID === null ? (
            <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-[15px] text-ink-dim" data-demo-video-slot>
              {c.videoSoon}
            </p>
          ) : (
            <TrackedYouTube
              videoId={SHARP_BRAIN_DEMO_VIDEO_ID}
              title={c.h1}
              onPlay={() => trackGaEvent("sharp_brain_demo_video", { action: "play", utm_source: utm() })}
              onProgress={(percent) => trackGaEvent("sharp_brain_demo_video", { action: "progress", percent: String(percent), utm_source: utm() })}
            />
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setCheckoutOpen(true);
              trackGaEvent("sharp_brain_enrol_click", { location: "demo_page", utm_source: utm() });
              window.setTimeout(() => document.getElementById("demo-checkout")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
            }}
            className="inline-flex min-h-16 items-center justify-center rounded-sm bg-gold px-6 text-[18px] font-extrabold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            aria-expanded={checkoutOpen}
            data-demo-book
          >
            {price === null ? "…" : lang === "hi" ? `सीट बुक करें — ${inr(price.amountInr)}` : `Book a seat — ${inr(price.amountInr)}`}
          </button>
          <a
            href={waLink(DEMO_WATCHED_WHATSAPP)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGaEvent("whatsapp_click", { location: "demo_page", utm_source: utm() })}
            className="inline-flex min-h-16 items-center justify-center rounded-sm bg-[#0b7a3e] px-6 text-center text-[17px] font-extrabold text-white"
            data-demo-whatsapp
          >
            {c.call}
          </a>
        </div>
        <p className="mt-2 text-center text-[14px] text-ink-dim sm:text-right">
          {c.or}{" "}
          <a href={contact.phoneHref} onClick={() => trackGaEvent("sharp_brain_demo_call", { location: "demo_page", utm_source: utm() })} className="font-semibold text-ink underline underline-offset-2">
            {contact.phoneDisplay}
          </a>
        </p>

        {checkoutOpen && (
          <div id="demo-checkout" className="mt-6 rounded-sm border-2 border-gold bg-void p-5 sm:p-6">
            <SeatCheckout location="demo_page" showPerDay />
          </div>
        )}

        <ul className="mt-10 space-y-3">
          {c.lines.map((line) => (
            <li key={line} className="flex items-start gap-3 text-[16.5px] leading-relaxed text-ink">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
        <p className="mt-6 flex items-start gap-2 rounded-sm bg-gold-soft px-4 py-3 text-[14.5px] leading-relaxed text-ink" data-guarantee-short>
          <ShieldCheck className="mt-0.5 size-4 flex-none text-gold" aria-hidden="true" />
          {qsrGuarantee[lang].statement}
        </p>
        <SeatCounter className="mt-4 text-center text-[16px] font-bold text-gold" />
      </div>
    </section>
  );
}
