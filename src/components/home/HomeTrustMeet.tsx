"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { trainer } from "@/config/site.config";
import { homeV2, say } from "@/lib/homeV2Copy";

// Two homepage sections reused on other pages (e.g. /calm-mind-batch), kept in
// their own small file so those pages don't load the whole homepage module.

const SECTION = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";

// Trust strip under the hero (owner, homepage upgrade): one line of 4 facts.
export function HomeTrustStrip(): React.JSX.Element {
  const { lang } = useLanguage();
  return (
    <section className="border-b border-line bg-panel px-4 py-5 sm:px-8" aria-label={lang === "hi" ? "भरोसा" : "Trust"} data-home-trust>
      <ul className="mx-auto grid max-w-content grid-cols-2 gap-x-4 gap-y-2.5 text-center text-[14px] font-semibold text-ink sm:text-[15px] lg:flex lg:items-center lg:justify-between lg:gap-0">
        {homeV2.trust.map((item, index) => (
          <li key={item.en} className="flex items-center justify-center gap-4">
            {index > 0 && <span className="hidden text-line-strong lg:inline" aria-hidden="true">|</span>}
            {say(item, lang)}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Meet Dr. Kapil (owner, homepage upgrade): the photo that was in the hero, 3 lines, "My story".
export function HomeMeetKapil(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = homeV2.meet;
  return (
    <section className={SECTION} aria-labelledby="home-meet" data-home-meet>
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12">
        <div className="relative mx-auto aspect-[1374/1145] w-full max-w-[520px] overflow-hidden rounded-sm border border-line-strong bg-panel2">
          <Image src={trainer.photo.src} alt={trainer.photo.alt} fill sizes="(min-width: 768px) 480px, 92vw" className="object-cover object-top" />
        </div>
        <div>
          <h2 id="home-meet" className="text-[26px] font-extrabold leading-tight sm:text-[34px]">
            {say(c.heading, lang)}
          </h2>
          <ul className="mt-6 space-y-3 text-[17px] leading-relaxed">
            {c.lines.map((line) => (
              <li key={line.en} className="flex items-start gap-2.5">
                <span className="font-bold text-gold" aria-hidden="true">✓</span>
                {say(line, lang)}
              </li>
            ))}
          </ul>
          <Link href="/about" className="mt-6 inline-flex min-h-11 items-center text-[15.5px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
            {say(c.story, lang)}
          </Link>
        </div>
      </div>
    </section>
  );
}
