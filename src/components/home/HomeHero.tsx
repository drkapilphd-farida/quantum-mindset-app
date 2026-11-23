"use client";

import Link from "next/link";
import { PAGE_VIDEOS } from "@/config/site.config";
import { PageVideo } from "@/components/video/PageVideo";
import { NeuralOrb } from "@/components/fx/NeuralOrb";
import { Tilt } from "@/components/fx/Tilt";
import { useLanguage } from "@/context/LanguageContext";
import { homeV2, say } from "@/lib/homeV2Copy";

// 1. Hero: proof strip, H1, subtitle, two doors (Sharp Brain for students
// and professionals; the 21-Day Online Retreat for stress and overthinking)
// and the small price line. The page's only <h1>. Owner (Nov 2026): the intro page video replaces
// the photo — under the headline on phones, beside it on desktop.
/** Owner (Nov 2026): the homepage caption, the same in both languages. */
const HERO_VIDEO_CAPTION = "डॉ. कपिल से मिलिए · Meet Dr. Kapil";

export default function HomeHero(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.hero;

  return (
    <section id="top" className="warm-dark hero-vivid relative overflow-hidden border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <NeuralOrb className="-left-48 -top-28 opacity-50 lg:left-[28%] lg:top-[-150px] lg:opacity-70" />
      {/* One video only (owner: it showed twice): under the headline on phones,
          beside the text on desktop — placed by the grid, not by a second copy. */}
      <div className="relative mx-auto grid max-w-content grid-cols-1 gap-y-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-14 lg:gap-y-0">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-[#7ee0d4]">{say(c.strip, lang)}</p>
          <h1 className="mt-4 text-balance text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-[50px] lg:text-[58px]">{say(c.h1, lang)}</h1>
        </div>
        <PageVideo video={PAGE_VIDEOS.intro} lang={lang} tone="dark" priority caption={HERO_VIDEO_CAPTION} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" />
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-xl text-[16.5px] leading-relaxed text-ink-dim sm:text-[18px] lg:mt-5">{say(c.sub, lang)}</p>
          {/* Owner (23 Nov 2026): two doors — Sharp Brain and the 21-Day Online Retreat. */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2" data-home-doors>
            {c.doors.map((door, i) => (
              <Tilt key={door.id} className="rounded-xl">
              <Link
                href={lang === "hi" ? door.hrefHi : door.hrefEn}
                className={`group flex h-full flex-col rounded-xl border-2 p-5 transition-transform hover:-translate-y-0.5 ${i === 0 ? "border-[#6d8dff]/70 bg-[#2b57e8]/20 hover:bg-[#2b57e8]/30" : "border-[#4fd1c5]/70 bg-[#11a197]/20 hover:bg-[#11a197]/30"} backdrop-blur`}
                data-home-door={door.id}
              >
                <span className={`font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] ${i === 0 ? "text-[#a9bcff]" : "text-[#7ee0d4]"}`}>{say(door.who, lang)}</span>
                <span className="mt-2 text-[21px] font-extrabold leading-snug text-ink">{say(door.title, lang)}</span>
                <span className="mt-1.5 text-[14.5px] leading-snug text-ink-dim">{say(door.line, lang)}</span>
                <span className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[15px] font-extrabold text-ink">{say(door.price, lang)}</span>
                  <span className="inline-flex items-center rounded-sm bg-gold px-3.5 py-2 text-[14px] font-semibold text-[#1B1508] group-hover:bg-gold-dim" aria-hidden="true">→</span>
                </span>
              </Link>
              </Tilt>
            ))}
          </div>
          <p className="mt-4 text-[14px] text-ink-dim">{say(c.smallLine, lang)}</p>
        </div>
      </div>
    </section>
  );
}
