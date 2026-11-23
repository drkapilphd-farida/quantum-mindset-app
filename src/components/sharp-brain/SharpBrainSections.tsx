"use client";

import Image from "next/image";
import Link from "next/link";
import { Brain, CheckCircle2, Eye, Flag, GraduationCap, MicOff, Sparkles, Trophy, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PAGE_VIDEOS, programs } from "@/config/site.config";
import { PageVideo } from "@/components/video/PageVideo";
import { FreeTestButton } from "../FreeTestButton";
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { SHARP_BRAIN_REVIEW_GRID_CLASS, sharpBrainReviewCards } from "@/config/sharpBrainVideoReviews";
import { YOUTUBE_CHANNEL_URL } from "@/config/reviewsPlaylist";
import { useProgramTestimonials } from "@/hooks/useTestimonials";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { sharpBrainCopy, type OfferCell, type SharpBrainPlan } from "@/lib/sharpBrainCopy";
import { waLink } from "@/data/links";
import { PriceLine, useEnrolLabel } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import { Eyebrow } from "../ui";
import { Tilt } from "../fx/Tilt";
import { NeuralOrb } from "../fx/NeuralOrb";
import TrainerBio from "../TrainerBio";
import VideoReviewGrid from "../VideoReviewGrid";

// Sections of /programs/sharp-brain. Page order (Phase 6B): hero → sound
// familiar? → five skills → inside the app → 7 classes → comparison table →
// live batch + self-paced (#enrol) → certificate → video reviews → trainer →
// FAQ → final two buttons. Prices and batch dates come from
// SharpBrainPricingProvider. /reviews uses the reviews hero, proof and final.

function useCopy(): (typeof sharpBrainCopy)["en"] {
  const { lang } = useLanguage();
  return sharpBrainCopy[lang];
}

const sectionClass = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";
const h2Class = "mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]";
// Path + hash, so the same buttons work on /reviews; on the program page itself
// it is a same-page jump to the batch picker.
const ENROL_HREF = "/programs/sharp-brain#enrol";

// The two calls to action (hero and final): enrol (→ batch picker in the
// offer section), or take the free Reading Speed Test.
function EnrolAndTestButtons({ location, className = "" }: { location: string; className?: string }): React.JSX.Element {
  const enrol = useEnrolLabel();
  const { lang } = useLanguage();
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start ${className}`}>
      <a
        href={ENROL_HREF}
        onClick={() => trackGaEvent("sharp_brain_enrol_click", { location })}
        className="inline-flex min-h-12 items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        data-enrol-link
      >
        {enrol}
      </a>
      {/* Owner (Nov 2026): the teal FreeTestButton for every free test; gold only for paid actions. */}
      <FreeTestButton test="reading" lang={lang} align={className.includes("justify-center") ? "center" : "start"} />
    </div>
  );
}

export function SharpBrainProblems(): React.JSX.Element {
  const c = useCopy().problems;
  return (
    <section id="sound-familiar" className={`${sectionClass} band-mint`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.cards.map((card) => (
            <li key={card} className="rounded-sm border border-line bg-void p-5 text-[16px] font-semibold leading-snug text-ink">
              “{card}”
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-ink">{c.line}</p>
      </div>
    </section>
  );
}

export function SharpBrainWhy(): React.JSX.Element {
  const c = useCopy().why;
  return (
    <section id="skills" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-dim">{c.intro}</p>
        <div className="mt-10 hidden grid-cols-[0.7fr_1fr_1.2fr_1fr] gap-4 border-b border-line-strong pb-3 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint lg:grid">
          <span>{c.headings.skill}</span>
          <span>{c.headings.wrong}</span>
          <span>{c.headings.train}</span>
          <span>{c.headings.change}</span>
        </div>
        <ol className="mt-6 space-y-4 lg:mt-0 lg:space-y-0">
          {c.rows.map((row, index) => (
            <li
              key={row.skill}
              className="grid grid-cols-1 gap-3 rounded-sm border border-line bg-panel p-5 lg:grid-cols-[0.7fr_1fr_1.2fr_1fr] lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:bg-transparent lg:px-0 lg:py-5"
            >
              <h3 className="text-[17px] font-bold text-ink">
                <span className="mr-2 font-mono text-[12px] font-semibold text-gold">0{index + 1}</span>
                {row.skill}
              </h3>
              <WhyCell label={c.headings.wrong} text={row.wrong} />
              <WhyCell label={c.headings.train} text={row.train} strong />
              <WhyCell label={c.headings.change} text={row.change} accent />
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-ink-dim">{c.footer}</p>
      </div>
    </section>
  );
}

function WhyCell({ label, text, strong = false, accent = false }: { label: string; text: string; strong?: boolean; accent?: boolean }): React.JSX.Element {
  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-faint lg:hidden">{label}</p>
      <p className={`mt-1 text-[14.5px] leading-relaxed lg:mt-0 ${accent ? "font-semibold text-teal" : strong ? "text-ink" : "text-ink-dim"}`}>{text}</p>
    </div>
  );
}

export function SharpBrainOutcomes(): React.JSX.Element {
  const c = useCopy().outcomes;
  return (
    <section id="outcomes" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {c.items.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-sm border border-line bg-void p-5 text-[15px] leading-relaxed text-ink">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// The 34-second app demo video (Nov 2026, cut from real screen recordings),
// beside a compact list of the skills it trains.
const APP_DEMO = "/assets/sharp-brain/app/sharp-brain-app-demo";

export function SharpBrainApp(): React.JSX.Element {
  const c = useCopy().app;
  return (
    <section id="inside-the-app" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <p className="mt-3 text-[16px] text-ink-dim">{c.note}</p>
        <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,340px)_1fr]">
          <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-sm border border-line bg-panel2 shadow-[0_10px_30px_rgba(20,32,56,0.14)]">
            <video
              className="block aspect-[9/16] h-auto w-full"
              src={`${APP_DEMO}.mp4`}
              poster={`${APP_DEMO}.jpg`}
              aria-label={c.plan.alt}
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
          </div>
          <div>
            <h3 className="text-[20px] font-bold leading-snug text-ink">{c.plan.title}</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-dim">
              {c.plan.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {c.groups.map((group) => (
                <div key={group.id}>
                  <dt className="text-[15px] font-bold text-ink">{group.skill}</dt>
                  <dd className="mt-1 text-[13.5px] leading-relaxed text-ink-dim">{group.exercises.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

const CLASS_STEPS: { icon: LucideIcon; color: string }[] = [
  { icon: Flag, color: "#2b57e8" },
  { icon: Eye, color: "#1d7fd8" },
  { icon: MicOff, color: "#0b9488" },
  { icon: Brain, color: "#7c3aed" },
  { icon: Sparkles, color: "#c026d3" },
  { icon: GraduationCap, color: "#ea7a12" },
  { icon: Trophy, color: "#16a34a" },
];

// The 7 live classes as one colourful journey (owner, 23 Nov 2026: less
// text, easy to grasp at a glance).
export function SharpBrainClasses(): React.JSX.Element {
  const c = useCopy().classes;
  return (
    <section id="live-classes" className="border-b border-line bg-gradient-to-br from-[#0a1630] via-[#10306b] to-[#0b6f6a] px-4 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[#7ee0d4]">{c.eyebrow}</p>
        <h2 className="mt-3 text-[28px] font-extrabold leading-tight sm:text-[38px]">{c.title}</h2>
        <ol className="relative mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:gap-3">
          <span className="pointer-events-none absolute left-[8%] right-[8%] top-8 hidden h-1 rounded-full bg-gradient-to-r from-[#2b57e8] via-[#c026d3] to-[#16a34a] opacity-70 lg:block" aria-hidden="true" />
          {c.items.map((item, index) => {
            const step = CLASS_STEPS[index] ?? CLASS_STEPS[0];
            const Icon = step?.icon ?? Flag;
            return (
              <li key={item.title} className="relative flex items-center gap-4 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/15 lg:flex-col lg:bg-transparent lg:p-0 lg:text-center lg:ring-0">
                <span className="relative flex h-16 w-16 flex-none items-center justify-center rounded-full shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)] ring-4 ring-[#0d2450]" style={{ background: step?.color }}>
                  <Icon className="h-7 w-7 text-white" strokeWidth={2.2} aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[12px] font-black text-[#1B1508]">{index + 1}</span>
                </span>
                <span>
                  <span className="block text-[17px] font-extrabold leading-tight lg:mt-1">{item.title}</span>
                  <span className="mt-1 block text-[14px] leading-snug text-white/75">{item.desc}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-10 inline-flex rounded-full bg-white/10 px-4 py-2 text-[14.5px] font-semibold ring-1 ring-white/20">{c.note}</p>
      </div>
    </section>
  );
}

export function SharpBrainAudiences(): React.JSX.Element {
  const c = useCopy().audiences;
  return (
    <section id="who-its-for" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.cards.map((card) => (
            <article key={card.title} className="rounded-sm border border-line bg-panel p-6">
              <h3 className="text-[17px] font-bold leading-snug text-ink">{card.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{card.desc}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-[17px] font-semibold text-ink">{c.line}</p>
      </div>
    </section>
  );
}

export function SharpBrainHow(): React.JSX.Element {
  const c = useCopy().how;
  return (
    <section id="how-it-works" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step, index) => (
            <li key={step.title} className="rounded-sm border border-line bg-void p-6">
              <span className="font-mono text-[12px] font-semibold text-teal">0{index + 1}</span>
              <h3 className="mt-2 text-[18px] font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// "Your Sharp Brain certificate" — the certificate and share image shown as
// clearly marked SAMPLES ("Your Name", "—" for every number, no signature),
// drawn by the app's own certificate code. No speed or percentage promises.
const CERT_SAMPLES = {
  en: { cert: "/brand/samples/sample-certificate-en.webp", share: "/brand/samples/sample-share-image-en.webp" },
  hi: { cert: "/brand/samples/sample-certificate-hi.webp", share: "/brand/samples/sample-share-image-hi.webp" },
} as const;

export function SharpBrainCertificate(): React.JSX.Element {
  const c = useCopy().certificate;
  const { lang } = useLanguage();
  const samples = CERT_SAMPLES[lang === "hi" ? "hi" : "en"];
  return (
    <section id="certificate" className={`${sectionClass} band-mint`}>
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div className="min-w-0">
          <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
          <h2 className={h2Class}>{c.title}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink">{c.intro}</p>
          <ul className="mt-6 space-y-4">
            {c.points.map((point) => (
              <li key={point.title} className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-2.5">
                <span className="mt-2 size-2 rounded-full bg-gold" aria-hidden="true" />
                <div>
                  <h3 className="text-[16px] font-bold text-ink">{point.title}</h3>
                  <p className="mt-0.5 text-[14.5px] leading-relaxed text-ink-dim">{point.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] text-ink-faint" data-results-vary>
            {c.vary}
          </p>
        </div>
        <div className="flex min-w-0 flex-col items-center gap-4 sm:grid sm:grid-cols-[minmax(0,1fr)_200px] sm:items-end lg:grid-cols-[minmax(0,1fr)_210px]">
          <a href={samples.cert} target="_blank" rel="noopener" className="block w-full" aria-label={`${c.certAlt}. ${c.enlarge}`}>
            <Image src={samples.cert} alt={c.certAlt} width={2000} height={1415} sizes="(min-width: 1024px) 520px, (min-width: 640px) 60vw, 92vw" className="h-auto w-full shadow-[0_10px_30px_rgba(20,32,56,0.14)]" data-certificate-sample />
          </a>
          <a href={samples.share} target="_blank" rel="noopener" className="block w-[62%] max-w-[240px] sm:w-full" aria-label={`${c.shareAlt}. ${c.enlarge}`}>
            <Image src={samples.share} alt={c.shareAlt} width={1080} height={1350} sizes="(min-width: 640px) 210px, 62vw" className="h-auto w-full shadow-[0_10px_30px_rgba(10,16,30,0.3)]" data-share-sample />
          </a>
          <p className="text-center text-[12.5px] text-ink-faint sm:col-span-2">
            {c.caption} <span className="whitespace-nowrap">{c.enlarge}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export function SharpBrainProof(): React.JSX.Element {
  const c = useCopy().proof;
  const { lang } = useLanguage();
  const testimonials = useProgramTestimonials("sharpBrain").filter((item) => item.quote !== null);
  return (
    <section id="testimonials" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>

        {testimonials.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <figure key={item.id} className="rounded-sm border border-line bg-panel p-6">
                <blockquote className="text-[16px] italic leading-relaxed text-ink">&ldquo;{item.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-[13.5px] font-semibold text-ink">
                  {item.name}
                  {item.context !== "" && <span className="font-normal text-ink-faint"> · {item.context}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* Phase 4.5: the 7 new Sharp Brain Shorts (sharpBrainVideoReviews.ts)
            replace the older reviews and their "From earlier batches" label. */}
        <VideoReviewGrid videos={sharpBrainReviewCards(lang)} aspectRatioClassName="aspect-[9/16]" gridClassName={SHARP_BRAIN_REVIEW_GRID_CLASS} className="mt-8" />
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
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
      <div className="mx-auto max-w-2xl">
        <TrainerBio variant="short" accent="gold" eyebrow={c.eyebrow} />
        <Link href="/about" className="mt-4 inline-flex text-[14px] font-semibold text-gold hover:underline">
          {c.readStory}
        </Link>
      </div>
    </section>
  );
}

export function SharpBrainFaq(): React.JSX.Element {
  const c = useCopy().faq;
  return (
    <section id="faq" className={`${sectionClass} band-blue`}>
      <div className="mx-auto max-w-3xl">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {c.items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
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
  const c = useCopy().final;
  const rolling = useCopy().offers.rolling;
  return (
    <section className={sectionClass}>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">{c.title}</h2>
        <EnrolAndTestButtons location="sharp_brain_final" className="mt-7 justify-center" />
        <PriceLine className="mt-4" rollingText={rolling} />
      </div>
    </section>
  );
}

export function SharpBrainStickyBar({ enrolHref = ENROL_HREF }: { enrolHref?: string; hideRegularPrice?: boolean } = {}): React.JSX.Element {
  const { lang } = useLanguage();
  const all = useCopy();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-void/95 backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-ink">{lang === "hi" ? programs.sharpBrain.nameHi : programs.sharpBrain.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{all.offers.stickyFrom}</p>
        </div>
        <a
          href={enrolHref}
          onClick={() => trackGaEvent("sharp_brain_enrol_click", { location: "sharp_brain_sticky" })}
          className="inline-flex flex-none items-center rounded-sm bg-gold px-5 py-2.5 text-[13.5px] font-semibold text-[#1B1508]"
        >
          {all.sticky.cta}
        </a>
      </div>
    </div>
  );
}

// /reviews hero: same look as the program page, one H1, live price.
export function SharpBrainReviewsHero(): React.JSX.Element {
  const c = useCopy();
  const rolling = c.offers.rolling;
  return (
    <section id="top" className="border-b border-line px-4 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold">{c.reviews.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">{c.reviews.h1}</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink">{c.reviews.sub}</p>
        <EnrolAndTestButtons location="reviews_hero" className="mt-8" />
        <PriceLine className="mt-4" rollingText={rolling} />
        <Link href={programs.sharpBrain.url} className="mt-5 inline-block text-[14px] font-semibold text-gold hover:underline">
          {c.reviews.programLink}
        </Link>
      </div>
    </section>
  );
}

// ─── Phase 6B — two offers on one page ─────────────────────────────────────
// Four plans (owner, Nov 2026): ₹499 workshop · ₹2,999 self-paced ·
// ₹4,999 live online · ₹8,999 offline workshop with EEG. Copy and links
// live in sharpBrainCopy.ts (offers.plans).

function OfferButtons({ location, className = "" }: { location: string; className?: string }): React.JSX.Element {
  const c = useCopy().offers;
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <a
        href={ENROL_HREF}
        onClick={() => trackGaEvent("sharp_brain_enrol_click", { location })}
        className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:brightness-95"
        data-offer-live
      >
        {c.heroPlansButton}
      </a>
      <a
        href="/reading-memory-test"
        className="inline-flex items-center justify-center rounded-sm border border-white/40 px-7 py-[15px] text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
        data-offer-self
      >
        {c.heroTestButton}
      </a>
    </div>
  );
}

export function SharpBrainOffersHero(): React.JSX.Element {
  const c = useCopy().offers.hero;
  const { lang } = useLanguage();
  return (
    <section id="top" className="warm-dark hero-vivid relative overflow-hidden border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <NeuralOrb className="-left-40 -top-24 opacity-60 sm:-left-24 lg:left-[30%] lg:top-[-140px] lg:opacity-70" />
      <div className="relative mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <p className="font-mono text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[#7ee0d4]">Sharp Brain™ · Focus · Memory · Smart Reading</p>
          <h1 className="mt-4 text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px]">{c.h1}</h1>
          {/* Owner (Nov 2026): the Sharp Brain page video — under the headline on phones, beside it on desktop. */}
          <PageVideo video={PAGE_VIDEOS.sharpBrain} lang={lang} tone="dark" priority className="mt-6 lg:hidden" />
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink sm:text-[18.5px]">{c.sub}</p>
          <OfferButtons location="sharp_brain_hero" className="mt-8" />
          <p className="mt-5 text-[13.5px] leading-relaxed text-ink-faint" data-seats-line>
            {useCopy().offers.heroLine}
          </p>
        </div>
        <div className="hidden lg:block">
          <PageVideo video={PAGE_VIDEOS.sharpBrain} lang={lang} tone="dark" priority />
        </div>
      </div>
    </section>
  );
}

function CellMark({ value, included, notIncluded }: { value: OfferCell; included: string; notIncluded: string }): React.JSX.Element {
  if (typeof value === "string") return <span className="font-semibold text-ink">{value}</span>;
  if (typeof value === "object") {
    // Included, with a short note — e.g. the EEG test: ✓ (offline).
    return (
      <span className="whitespace-nowrap">
        <span className="text-[17px] font-bold text-teal">✓</span>
        <span className="sr-only"> {included}</span> <span className="text-[13.5px] font-semibold text-ink-dim">({value.note})</span>
      </span>
    );
  }
  return value ? (
    <span className="text-[17px] font-bold text-teal">
      ✓<span className="sr-only"> {included}</span>
    </span>
  ) : (
    <span className="text-[17px] font-bold text-ink-faint">
      ✗<span className="sr-only"> {notIncluded}</span>
    </span>
  );
}

export function SharpBrainCompare(): React.JSX.Element {
  const c = useCopy().offers;
  const t = c.plansTable;
  return (
    <section id="compare" className={`${sectionClass} band-blue`}>
      <div className="mx-auto max-w-content">
        <h2 className={h2Class}>{t.title}</h2>
        <div className="relative mt-8 overflow-x-auto rounded-sm border border-line bg-panel" data-compare-scroll>
          <table className="w-full min-w-[720px] border-collapse text-left text-[15px]" data-compare-table>
            <caption className="sr-only">{t.title}</caption>
            <thead>
              <tr className="border-b border-line-strong">
                <th scope="col" className="sticky left-0 z-10 bg-panel px-4 py-3 font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  {t.feature}
                </th>
                {c.plans.map((plan) => (
                  <th key={plan.id} scope="col" className={`px-4 py-3 text-[15px] font-bold text-ink ${plan.featured ? "bg-gold-soft" : "bg-panel"}`}>
                    {plan.name}
                    <span className="mt-0.5 block text-[14px] font-extrabold text-teal">{plan.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.rows.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-b-0">
                  <th scope="row" className="sticky left-0 z-10 bg-panel px-4 py-3.5 font-semibold text-ink">
                    {row.feature}
                  </th>
                  {row.cells.map((cell, i) => (
                    <td key={c.plans[i]?.id ?? i} className={`px-4 py-3.5 ${c.plans[i]?.featured ? "bg-gold-soft" : "bg-panel"}`}>
                      <CellMark value={cell} included={t.included} notIncluded={t.notIncluded} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const PLAN_COLORS: Record<SharpBrainPlan["id"], string> = { workshop: "#11a197", self: "#2b57e8", live: "#f2a33a", offline: "#7c3aed" };

function planHref(plan: SharpBrainPlan): string {
  return plan.href.kind === "whatsapp" ? waLink(plan.href.message) : plan.href.url;
}

export function SharpBrainOffers(): React.JSX.Element {
  const all = useCopy();
  const c = all.offers;
  return (
    <section id="enrol" className={`scroll-mt-20 ${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <h2 className={h2Class}>{c.plansTitle}</h2>
        <p className="mt-3 max-w-2xl text-[16px] text-ink-dim">{c.plansSub}</p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {c.plans.map((plan) => (
            <Tilt key={plan.id} className="h-full rounded-xl" max={5}>
            <article
              id={plan.id === "live" ? "live-batch" : plan.id === "self" ? "self-paced" : `plan-${plan.id}`}
              className={`flex h-full scroll-mt-20 flex-col overflow-hidden rounded-xl p-6 ${plan.featured ? "warm-dark hero-vivid border-[3px] border-gold shadow-[0_24px_48px_-18px_rgba(10,22,48,0.6)]" : "border border-line-strong bg-white shadow-[0_14px_34px_-22px_rgba(19,32,59,0.35)]"}`}
              style={plan.featured ? undefined : { borderTop: `5px solid ${PLAN_COLORS[plan.id]}` }}
              data-offer-block={plan.id}
            >
              {plan.badge !== null ? (
                <span className={`inline-flex self-start rounded-sm px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${plan.featured ? "bg-gold text-[#1B1508]" : "bg-teal-soft text-teal"}`}>{plan.badge}</span>
              ) : (
                <span className="h-[26px]" aria-hidden="true" />
              )}
              <h3 className="mt-4 text-[22px] font-extrabold leading-tight">{plan.name}</h3>
              <p className="mt-3 text-[40px] font-extrabold leading-none tracking-tight" data-plan-price>
                {plan.price}
              </p>
              <p className="mt-2 text-[13.5px] font-semibold text-ink-dim">{plan.note}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                    <span className="w-5 flex-none text-center font-bold text-teal" aria-hidden="true">
                      ✓
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <a
                href={planHref(plan)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGaEvent("sharp_brain_enrol_click", { location: `sharp_brain_plan_${plan.id}` })}
                className={`mt-7 inline-flex w-full items-center justify-center rounded-sm px-5 py-[14px] text-center text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${plan.featured || plan.id === "workshop" ? "bg-gold text-[#1B1508]" : "border-2 border-ink text-ink hover:bg-panel2"}`}
                data-plan-cta={plan.id}
              >
                {plan.cta}
              </a>
            </article>
            </Tilt>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-content flex-col gap-6">
        <div id="guarantee" className="max-w-3xl rounded-sm border border-line-strong bg-void p-5" data-refund-policy>
          <p className="text-[16px] font-bold text-ink">{c.refund.title}</p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-dim">{c.refund.text}</p>
        </div>
        <a
          href={WHATSAPP_MASTERCLASS_INQUIRY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_offer" })}
          className="inline-flex w-full items-center justify-center rounded-sm border border-line-strong px-7 py-3.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-panel2 sm:w-auto sm:self-start"
        >
          {all.offer.questions}
        </a>
      </div>
    </section>
  );
}

export function SharpBrainOffersFinal(): React.JSX.Element {
  const c = useCopy().final;
  return (
    <section className={sectionClass}>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">{c.title}</h2>
        <OfferButtons location="sharp_brain_final" className="mt-7 justify-center" />
      </div>
    </section>
  );
}
