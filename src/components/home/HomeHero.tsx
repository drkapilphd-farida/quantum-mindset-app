"use client";

import Image from "next/image";
import Link from "next/link";
import { trainer } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import { homeV2, say, telepathyHref } from "@/lib/homeV2Copy";

// 1. Hero (Phase 4.2, copy/home-v2.md): proof strip, H1, subtitle, "अपनी
// तारीख चुनिए" (→ the date cards, #dates), "वर्कशॉप में क्या होता है →"
// (→ /telepathy-workshop; from /en its English copy) and the small booking
// line. The photo is unchanged. The page's only <h1>.
export default function HomeHero(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.hero;

  return (
    <section id="top" className="border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <p className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-gold">{say(c.strip, lang)}</p>
          <h1 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-tight sm:text-[46px] lg:text-[52px]">{say(c.h1, lang)}</h1>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink-dim sm:text-[18px]">{say(c.sub, lang)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#dates"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              {say(c.ctaPrimary, lang)}
            </a>
            <Link
              href={telepathyHref(lang)}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
            >
              {say(c.ctaSecondary, lang)}
            </Link>
          </div>
          <p className="mt-4 text-[14.5px] text-ink-dim">{say(c.smallLine, lang)}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-[1374/1145] w-full overflow-hidden rounded-sm border border-line-strong bg-panel2">
            <Image
              src={trainer.photo.src}
              alt={trainer.photo.alt}
              fill
              priority
              sizes="(min-width: 1024px) 520px, 92vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
