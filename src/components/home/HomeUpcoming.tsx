"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { trainer, upcomingEvents, type UpcomingEvent } from "@/config/site.config";
import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";

const MAX_EVENTS = 2;

// 7. Upcoming live events — at most two "upcoming" programs from the
// registry. The server renders the list as of build/revalidate time; the
// browser re-filters on mount so an event disappears the moment its end
// time passes, even from a cached page.
export default function HomeUpcoming({ initial }: { initial: UpcomingEvent[] }): React.JSX.Element | null {
  const { lang } = useLanguage();
  const c = useHomeCopy().upcoming;
  const [events, setEvents] = useState<UpcomingEvent[]>(initial);

  useEffect(() => {
    setEvents(upcomingEvents(new Date()).slice(0, MAX_EVENTS));
  }, []);

  if (events.length === 0) return null;

  return (
    <section id="upcoming" className="border-b border-line bg-panel px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((event) => {
            const from = event.prices.map((p) => p.amountInr).filter((a) => a > 0);
            const price = from.length > 0 ? `₹${Math.min(...from).toLocaleString("en-IN")}` : null;
            return (
              <article key={event.id} className="flex flex-col overflow-hidden rounded-sm border border-line-strong bg-void sm:flex-row">
                <div className="relative aspect-[4/3] w-full flex-none sm:aspect-auto sm:w-[180px]">
                  <Image src={trainer.photo.src} alt={trainer.photo.alt} fill sizes="(min-width: 640px) 180px, 92vw" className="object-cover object-top" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-gold">
                    {lang === "hi" ? event.event.dateDisplayHi : event.event.dateDisplay} · {lang === "hi" ? event.event.cityHi : event.event.city}
                  </p>
                  <h3 className="mt-2 text-[18px] font-bold leading-snug text-ink">{lang === "hi" ? event.nameHi : event.name}</h3>
                  {price !== null && (
                    <p className="mt-1 text-[13.5px] text-ink-dim">
                      {lang === "hi" ? `${price} ${c.from}` : `${c.from} ${price}`}
                    </p>
                  )}
                  <Link href={event.url} className="mt-auto pt-4 text-[14px] font-semibold text-gold hover:underline">
                    {c.cta} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
