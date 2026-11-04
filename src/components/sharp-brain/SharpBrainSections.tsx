"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ENABLE_MEMORY_KIT, qsrGuarantee, trainer, waLink } from "@/config/site.config";
import { FREE_TEST_LINKS } from "@/config/navigation";
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { QSR_ADULT_VIDEO_REVIEWS, QSR_MORE_VIDEO_REVIEWS, QSR_YOUNG_LEARNER_VIDEO_REVIEWS } from "@/config/qsrVideoReviews";
import { YOUTUBE_CHANNEL_URL } from "@/config/reviewsPlaylist";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { readUtmParams } from "@/lib/analytics/utm";
import { LIVE_QA_WHATSAPP, sharpBrainCopy } from "@/lib/sharpBrainCopy";
import { classWhen, inr } from "@/features/sharp-brain-enrol/copy";
import { SeatCheckout, SeatCounter, useCurrentPrice, useSharpBrainPricing } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import { Eyebrow } from "../ui";
import GuaranteeBadge from "./GuaranteeBadge";
import VideoReviewGrid from "../VideoReviewGrid";

// Sections of /programs/sharp-brain — Sharp Brain for parents (4 Nov 2026),
// in page order: hero (+ trust strip) → sound familiar? → reframe → five
// skills → Day 30 → how it works → parents' role → certificate → video
// reviews → trainer → what's included → price + guarantee (#enrol) → FAQ →
// final CTA (+ "also for", free test link). Price, seats and the next class
// come from SharpBrainPricingProvider (server).

function useCopy(): (typeof sharpBrainCopy)["en"] {
  const { lang } = useLanguage();
  return sharpBrainCopy[lang];
}

const sectionClass = "border-b border-line px-4 py-14 sm:px-8 sm:py-20";
const h2Class = "text-[26px] font-extrabold leading-tight sm:text-[34px]";
const goldButton = "inline-flex items-center justify-center rounded-sm bg-gold px-6 py-[15px] text-center text-[15.5px] font-bold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]";
const outlineButton = "inline-flex items-center justify-center rounded-sm border border-line-strong px-6 py-[14px] text-center text-[15px] font-semibold text-ink transition-colors hover:bg-panel2";
// Path + hash, so the same buttons work on /reviews; on the program page itself
// it is a same-page jump to the checkout.
const ENROL_HREF = "/programs/sharp-brain#enrol";
const DEMO_HREF = "/sharp-brain/demo";
const LIVE_QA_HREF = waLink(LIVE_QA_WHATSAPP);

const utm = (): string => readUtmParams().utm_source ?? "(none)";
const trackBook = (location: string): void => trackGaEvent("sharp_brain_enrol_click", { location, utm_source: utm() });
const trackDemo = (location: string): void => trackGaEvent("sharp_brain_demo_click", { location, utm_source: utm() });

/** The intro-seat count while it applies ("first 100 seats"), else null. */
function useFirstSeats(): number | null {
  const price = useCurrentPrice();
  return price !== null && price.seatsLeft > 0 ? price.introSeats : null;
}

function usePriceLabel(): string {
  const price = useCurrentPrice();
  return price === null ? "" : inr(price.amountInr);
}

export function SharpBrainHero(): React.JSX.Element {
  const c = useCopy().hero;
  const { lang } = useLanguage();
  const price = useCurrentPrice();
  const firstSeats = useFirstSeats();
  const nextClassAt = useSharpBrainPricing().snapshot?.nextClassAt ?? null;
  return (
    <section id="top" className="border-b border-line px-4 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-14">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div>
          <h1 className="text-[30px] font-extrabold leading-[1.15] tracking-tight sm:text-[42px] lg:text-[48px]">{c.h1}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink sm:text-[18.5px]">{c.sub}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={ENROL_HREF} onClick={() => trackBook("sharp_brain_hero")} className={`${goldButton} flex-col gap-0.5 sm:items-start`} data-enrol-link>
              {price !== null && (
                <>
                  <span>{c.book(inr(price.amountInr), firstSeats)}</span>
                  <s className="text-[12.5px] font-semibold opacity-70">{inr(price.struckInr)}</s>
                </>
              )}
            </a>
            <Link href={DEMO_HREF} onClick={() => trackDemo("sharp_brain_hero")} className={outlineButton} data-demo-link>
              {c.demo}
            </Link>
          </div>
          <ul className="mt-5 space-y-1.5 text-[14.5px] leading-relaxed text-ink-dim">
            <li>{c.forWho}</li>
            <li className="font-semibold text-ink" data-next-class>
              {c.startToday(nextClassAt === null ? null : classWhen(nextClassAt, lang))}
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 flex-none text-gold" aria-hidden="true" />
              {c.guarantee}
            </li>
          </ul>
          <SeatCounter className="mt-3 text-[14px] font-bold text-gold" />
        </div>
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="relative aspect-[1374/1145] w-full overflow-hidden rounded-sm border border-line-strong bg-panel2">
            <Image src={trainer.photo.src} alt={trainer.photo.alt} fill priority sizes="(min-width: 1024px) 420px, 92vw" className="object-cover object-top" />
          </div>
        </div>
      </div>
      <ul className="mx-auto mt-10 flex max-w-content flex-wrap justify-center gap-x-5 gap-y-2 border-t border-line pt-6 text-[13.5px] font-semibold text-ink-dim" data-trust-strip>
        {c.strip.map((item) => (
          <li key={item} className="whitespace-nowrap">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SharpBrainPain(): React.JSX.Element {
  const c = useCopy().pain;
  return (
    <section id="sound-familiar" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <h2 className={h2Class}>{c.title}</h2>
        <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {c.items.map((item) => (
            <li key={item} className="rounded-sm border border-line bg-void p-5 text-[16px] font-semibold leading-snug text-ink">
              “{item}”
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SharpBrainReframe(): React.JSX.Element {
  const c = useCopy().reframe;
  return (
    <section id="not-intelligence" className={sectionClass}>
      <div className="mx-auto max-w-3xl">
        <h2 className={h2Class}>{c.title}</h2>
        <p className="mt-5 text-[17.5px] leading-relaxed text-ink">{c.body}</p>
      </div>
    </section>
  );
}

export function SharpBrainSkills(): React.JSX.Element {
  const c = useCopy().skills;
  return (
    <section id="skills" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <h2 className={h2Class}>{c.title}</h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {c.cards.map((card, index) => (
            <li key={card.title} className="flex flex-col rounded-sm border border-line bg-void p-5" data-skill-card>
              <h3 className="text-[18px] font-bold text-ink">
                <span className="mr-2 font-mono text-[12px] font-semibold text-gold">0{index + 1}</span>
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-[15.5px] leading-relaxed text-ink">“{card.quote}”</p>
              <p className="mt-4 border-t border-line pt-3 text-[13.5px] leading-relaxed text-teal">{card.method}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SharpBrainDay30(): React.JSX.Element {
  const c = useCopy().day30;
  return (
    <section id="day-30" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <h2 className={h2Class}>{c.title}</h2>
        <ul className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {c.items.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-sm border border-line bg-panel p-5 text-[15.5px] leading-relaxed text-ink">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SharpBrainHow(): React.JSX.Element {
  const c = useCopy().how;
  return (
    <section id="how-it-works" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <h2 className={h2Class}>{c.title}</h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step, index) => (
            <li key={step} className="rounded-sm border border-line bg-void p-6">
              <span className="font-mono text-[13px] font-bold text-teal">{index + 1}</span>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function SharpBrainParents(): React.JSX.Element {
  const c = useCopy().parents;
  return (
    <section id="parents" className={sectionClass}>
      <div className="mx-auto max-w-3xl rounded-sm border border-gold/40 bg-gold-soft p-6 sm:p-8">
        <h2 className="text-[24px] font-extrabold leading-tight sm:text-[30px]">{c.title}</h2>
        <p className="mt-4 text-[17px] leading-relaxed text-ink">{c.body}</p>
      </div>
    </section>
  );
}

// "Your Sharp Brain certificate" — half size: the certificate sample and
// four short points side by side. Samples only ("Your Name", "—" for every
// number, no signature), drawn by the app's own certificate code.
const CERT_SAMPLES = {
  en: "/brand/samples/sample-certificate-en.webp",
  hi: "/brand/samples/sample-certificate-hi.webp",
} as const;

export function SharpBrainCertificate(): React.JSX.Element {
  const c = useCopy().certificate;
  const { lang } = useLanguage();
  const sample = CERT_SAMPLES[lang === "hi" ? "hi" : "en"];
  return (
    <section id="certificate" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-10">
        <div className="min-w-0">
          <h2 className="text-[22px] font-extrabold leading-tight sm:text-[26px]">{c.title}</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink">{c.intro}</p>
          <ul className="mt-4 space-y-1.5 text-[14.5px] leading-relaxed text-ink-dim">
            {c.points.map((point) => (
              <li key={point.title}>
                <span className="font-semibold text-ink">{point.title}:</span> {point.desc}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12.5px] text-ink-faint" data-results-vary>
            {c.vary}
          </p>
        </div>
        <a href={sample} target="_blank" rel="noopener" className="mx-auto block w-full max-w-[420px]" aria-label={`${c.certAlt}. ${c.enlarge}`}>
          <Image src={sample} alt={c.certAlt} width={2000} height={1415} sizes="(min-width: 640px) 420px, 92vw" className="h-auto w-full shadow-[0_8px_24px_rgba(20,32,56,0.14)]" data-certificate-sample />
          <span className="mt-2 block text-center text-[12px] text-ink-faint">{c.caption}</span>
        </a>
      </div>
    </section>
  );
}

// Real proof only. The before/after results block (real, consented Day 1 /
// Day 30 numbers) comes once at least 3 entries exist; until then, the
// verified video reviews.
export function SharpBrainProof(): React.JSX.Element {
  const c = useCopy().proof;
  const [showMore, setShowMore] = useState(false);
  return (
    <section id="testimonials" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className={`mt-4 ${h2Class}`}>{c.title}</h2>
        <p className="mt-6 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{c.oldLabel}</p>
        <VideoReviewGrid
          videos={[...QSR_YOUNG_LEARNER_VIDEO_REVIEWS, ...QSR_ADULT_VIDEO_REVIEWS]}
          aspectRatioClassName="aspect-[9/16]"
          gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          className="mt-4"
        />
        {showMore && (
          <VideoReviewGrid
            videos={QSR_MORE_VIDEO_REVIEWS}
            aspectRatioClassName="aspect-[9/16]"
            gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            className="mt-4"
          />
        )}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="button" onClick={() => setShowMore((value) => !value)} className="text-[14px] font-semibold text-gold hover:underline">
            {showMore ? c.fewer : c.more}
          </button>
          <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-[14px] font-semibold text-gold hover:underline">
            {c.playlistCta} →
          </a>
        </div>
      </div>
    </section>
  );
}

export function SharpBrainTrainer(): React.JSX.Element {
  const c = useCopy().trainer;
  return (
    <section id="trainer" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="relative size-28 flex-none overflow-hidden rounded-full border border-line-strong bg-panel2 sm:size-36">
          <Image src={trainer.photo.src} alt={trainer.photo.alt} fill sizes="144px" className="object-cover object-top" />
        </div>
        <div>
          <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[22px] font-extrabold leading-tight sm:text-[26px]">{c.title}</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-dim">{c.line}</p>
          <p className="mt-3 text-[15.5px] font-semibold text-ink">{c.method}</p>
          <Link href="/about" className="mt-3 inline-flex text-[14px] font-semibold text-gold hover:underline">
            {c.readStory}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SharpBrainIncluded(): React.JSX.Element {
  const c = useCopy().included;
  return (
    <section id="included" className={sectionClass}>
      <div className="mx-auto max-w-3xl">
        <h2 className={h2Class}>{c.title}</h2>
        <ul className="mt-7 space-y-3">
          {[...c.items, ...(ENABLE_MEMORY_KIT ? [c.memoryKit] : [])].map((item) => (
            <li key={item} className="flex items-start gap-3 text-[16.5px] leading-relaxed text-ink">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SharpBrainOffer(): React.JSX.Element {
  const c = useCopy().offer;
  const { lang } = useLanguage();
  const price = useCurrentPrice();
  const firstSeats = useFirstSeats();
  return (
    <section id="enrol" className={`scroll-mt-20 ${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-2xl rounded-sm border-2 border-gold bg-void p-6 sm:p-8">
        <h2 className="text-[22px] font-extrabold leading-tight sm:text-[28px]">{c.title(firstSeats)}</h2>
        {price !== null && (
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1" data-price-state={price.offer}>
            <s className="text-[20px] text-ink-faint">{inr(price.struckInr)}</s>
            <span className="text-[40px] font-extrabold leading-none text-ink">{inr(price.amountInr)}</span>
            <span className="text-[16px] text-ink-dim">{c.oneTime}</span>
          </p>
        )}
        {price !== null && <p className="mt-2 text-[14px] text-ink-dim">{c.perDay(inr(Math.round(price.amountInr / 30)))}</p>}
        <SeatCounter className="mt-3 text-[15px] font-bold text-gold" />
        <p className="mt-4 flex items-start gap-2 rounded-sm bg-gold-soft px-4 py-3 text-[14px] leading-relaxed text-ink" data-guarantee-short>
          <ShieldCheck className="mt-0.5 size-4 flex-none text-gold" aria-hidden="true" />
          <span>
            {qsrGuarantee[lang].statement}{" "}
            <a href="#guarantee" className="font-medium underline underline-offset-2">
              {qsrGuarantee[lang].fullTerms}
            </a>
          </span>
        </p>
        <div className="mt-6">
          <SeatCheckout location="sharp_brain_offer" />
        </div>
        <a
          href={WHATSAPP_MASTERCLASS_INQUIRY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_offer", utm_source: utm() })}
          className={`mt-4 w-full sm:w-auto ${outlineButton}`}
        >
          {c.questions}
        </a>
      </div>
      <div className="mx-auto mt-6 max-w-2xl">
        <GuaranteeBadge id="guarantee" />
      </div>
    </section>
  );
}

export function SharpBrainFaq(): React.JSX.Element {
  const c = useCopy().faq;
  return (
    <section id="faq" className={sectionClass}>
      <div className="mx-auto max-w-3xl">
        <h2 className={h2Class}>{c.title}</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {c.items.map((item, index) => (
            <details
              key={item.question}
              className="group py-5"
              onToggle={(event) => {
                if (event.currentTarget.open) trackGaEvent("sharp_brain_faq_open", { question: String(index + 1), utm_source: utm() });
              }}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16.5px] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line-strong text-[13px] text-ink-faint transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 pr-8 text-[15.5px] leading-relaxed text-ink-dim">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SharpBrainFinal(): React.JSX.Element {
  const c = useCopy();
  const priceLabel = usePriceLabel();
  return (
    <section className={`${sectionClass} bg-panel`}>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-[21px] font-bold leading-snug text-ink sm:text-[26px]">{priceLabel !== "" && c.final.body(priceLabel)}</p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href={ENROL_HREF} onClick={() => trackBook("sharp_brain_final")} className={goldButton}>
            {c.final.book}
          </a>
          <a href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} target="_blank" rel="noopener noreferrer" onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_final", utm_source: utm() })} className={outlineButton}>
            {c.final.ask}
          </a>
        </div>
        <a href={LIVE_QA_HREF} target="_blank" rel="noopener noreferrer" onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_live_qa", utm_source: utm() })} className="mt-5 text-[14.5px] font-semibold text-gold hover:underline" data-live-qa>
          {c.liveQa} →
        </a>
        <div className="mt-10 w-full border-t border-line pt-6 text-[14.5px] text-ink-dim" data-also-for>
          <p className="font-semibold text-ink">{c.alsoFor.title}</p>
          <ul className="mt-1.5 space-y-0.5">
            {c.alsoFor.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <a href={WHATSAPP_MASTERCLASS_INQUIRY_LINK} target="_blank" rel="noopener noreferrer" onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_also_for", utm_source: utm() })} className="mt-1.5 inline-block font-semibold text-gold hover:underline">
            {c.alsoFor.ask} →
          </a>
        </div>
        <Link href={FREE_TEST_LINKS.speedTest} className="mt-6 text-[13.5px] text-ink-faint underline underline-offset-2 hover:text-ink">
          {c.freeTest}
        </Link>
      </div>
    </section>
  );
}

/** Phone only: "₹2,999 · Book a seat" + WhatsApp, always at the bottom. */
export function SharpBrainStickyBar(): React.JSX.Element {
  const c = useCopy().sticky;
  const priceLabel = usePriceLabel();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-void/95 backdrop-blur-md sm:hidden" data-sticky-bar>
      <div className="mx-auto flex max-w-content items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a href={ENROL_HREF} onClick={() => trackBook("sharp_brain_sticky")} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm bg-gold px-4 text-[15px] font-bold text-[#1B1508]">
          {priceLabel !== "" ? `${priceLabel} · ${c.book}` : c.book}
        </a>
        <a
          href={WHATSAPP_MASTERCLASS_INQUIRY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_sticky", utm_source: utm() })}
          className="inline-flex min-h-12 flex-none items-center justify-center rounded-sm bg-[#0b7a3e] px-4 text-[14.5px] font-bold text-white"
        >
          {c.whatsapp}
        </a>
      </div>
    </div>
  );
}

/** Scroll depth (25 / 50 / 75 / 100 %), each sent once per visit. */
export function SharpBrainScrollDepth(): null {
  useEffect(() => {
    const sent = new Set<number>();
    const onScroll = (): void => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const percent = (window.scrollY / max) * 100;
      for (const mark of [25, 50, 75, 100]) {
        if (percent >= mark - 1 && !sent.has(mark)) {
          sent.add(mark);
          trackGaEvent("sharp_brain_scroll_depth", { percent: String(mark), utm_source: utm() });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}

// /reviews hero: same look as the program page, one H1, live price.
export function SharpBrainReviewsHero(): React.JSX.Element {
  const c = useCopy();
  const price = useCurrentPrice();
  const firstSeats = useFirstSeats();
  return (
    <section id="top" className="border-b border-line px-4 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold">{c.reviews.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">{c.reviews.h1}</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink">{c.reviews.sub}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={ENROL_HREF} onClick={() => trackBook("reviews_hero")} className={goldButton} data-enrol-link>
            {price !== null && c.hero.book(inr(price.amountInr), firstSeats)}
          </a>
          <Link href={DEMO_HREF} onClick={() => trackDemo("reviews_hero")} className={outlineButton}>
            {c.hero.demo}
          </Link>
        </div>
        <SeatCounter className="mt-3 text-[14px] font-bold text-gold" />
        <Link href="/programs/sharp-brain" className="mt-5 inline-block text-[14px] font-semibold text-gold hover:underline">
          {c.reviews.programLink}
        </Link>
      </div>
    </section>
  );
}
