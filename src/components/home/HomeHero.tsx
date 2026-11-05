"use client";

import Image from "next/image";
import { trainer } from "@/config/site.config";
import Link from "next/link";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { dayRange, upcomingBatches } from "@/data/batches";
import { DEMO_WA_TEXT, waLink } from "@/data/links";
import { useHomeCopy } from "./useHomeCopy";

const CITY_LINE = ["mumbai", "online", "ahmedabad", "vadodara"] as const;
type CityLineId = (typeof CITY_LINE)[number];
const isCityLineId = (id: string): id is CityLineId => (CITY_LINE as readonly string[]).includes(id);

// 1. Hero (positioning rework, copy/home-hi.md / copy/home-en.md): H1,
// subtitle, proof strip, "Vadodara batch — ₹1,000" → /vadodara, "free
// demo" → WhatsApp, and the city line under the buttons — upcoming batches
// in date order from src/data/batches.ts (past ones drop off). The photo
// is unchanged. The page's only <h1>.
export default function HomeHero(): React.JSX.Element {
  const c = useHomeCopy().hero;
  const cityLine = upcomingBatches().filter((b) => isCityLineId(b.id));

  return (
    <section id="top" className="border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px]">{c.h1}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-dim sm:text-[18.5px]">{c.sub}</p>
          <p className="mt-5 font-mono text-[12.5px] uppercase tracking-[0.08em] text-gold">{c.trust}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/vadodara"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              {c.ctaPrimary}
            </Link>
            <a
              href={waLink(DEMO_WA_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGaEvent("whatsapp_click", { location: "home_hero_demo" })}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
            >
              {c.ctaSecondary}
            </a>
          </div>
          {cityLine.length > 0 && (
            <p className="mt-5 text-[15px] text-ink-dim">
              {cityLine.map((batch, i) => (
                <span key={batch.id}>
                  {i > 0 && " · "}
                  {batch.id === "vadodara" ? (
                    <strong className="text-ink">{`${isCityLineId(batch.id) ? c.cities[batch.id] : ""} ${dayRange(batch)}`}</strong>
                  ) : (
                    `${isCityLineId(batch.id) ? c.cities[batch.id] : ""} ${dayRange(batch)}`
                  )}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-[1374/1145] w-full overflow-hidden rounded-sm border border-line-strong bg-panel2">
            <Image
              src={trainer.photo.src}
              alt={c.photoAlt}
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
