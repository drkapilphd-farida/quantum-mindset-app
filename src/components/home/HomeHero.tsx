"use client";

import Link from "next/link";
import { PAGE_VIDEOS, programs } from "@/config/site.config";
import { PageVideo } from "@/components/video/PageVideo";
import { useLanguage } from "@/context/LanguageContext";
import { homeV2, say, sharpBrainHref } from "@/lib/homeV2Copy";

// 1. Hero (Phase 4.2, copy/home-v2.md): proof strip, H1, subtitle, "अपनी
// तारीख चुनिए" (→ the date cards, #dates), "वर्कशॉप में क्या होता है →"
// (→ /telepathy-workshop; from /hi its Hindi version) and the small booking
// line. The page's only <h1>. Owner (Nov 2026): the intro page video replaces
// the photo — under the headline on phones, beside it on desktop.
/** Owner (Nov 2026): the homepage caption, the same in both languages. */
const HERO_VIDEO_CAPTION = "डॉ. कपिल से मिलिए · Meet Dr. Kapil";

export default function HomeHero(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.hero;

  return (
    <section id="top" className="border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      {/* One video only (owner: it showed twice): under the headline on phones,
          beside the text on desktop — placed by the grid, not by a second copy. */}
      <div className="mx-auto grid max-w-content grid-cols-1 gap-y-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-14 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-gold">{say(c.strip, lang)}</p>
          <h1 className="mt-4 text-balance text-[32px] font-extrabold leading-[1.12] tracking-tight sm:text-[46px] lg:text-[52px]">{say(c.h1, lang)}</h1>
        </div>
        <PageVideo video={PAGE_VIDEOS.intro} lang={lang} tone="light" priority caption={HERO_VIDEO_CAPTION} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" />
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-xl text-[16.5px] leading-relaxed text-ink-dim sm:text-[18px] lg:mt-5">{say(c.sub, lang)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={sharpBrainHref(lang)}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              {say(c.ctaPrimary, lang)}
            </Link>
            <Link
              href={programs.oneOnOneCoaching.url}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
            >
              {say(c.ctaSecondary, lang)}
            </Link>
          </div>
          <p className="mt-4 text-[14.5px] text-ink-dim">{say(c.smallLine, lang)}</p>
        </div>
      </div>
    </section>
  );
}
