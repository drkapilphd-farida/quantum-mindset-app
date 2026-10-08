"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { programs, qsrGuarantee, trainer } from "@/config/site.config";
import { FREE_TEST_LINKS } from "@/config/navigation";
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { QSR_ADULT_VIDEO_REVIEWS, QSR_MORE_VIDEO_REVIEWS, QSR_YOUNG_LEARNER_VIDEO_REVIEWS } from "@/config/qsrVideoReviews";
import { YOUTUBE_CHANNEL_URL } from "@/config/reviewsPlaylist";
import { useProgramTestimonials } from "@/hooks/useTestimonials";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { sharpBrainCopy, type ExerciseGroup } from "@/lib/sharpBrainCopy";
import { istDayMonth } from "@/features/sharp-brain-enrol/copy";
import { BatchCheckout, PriceLine, useEnrolLabel, useNextBatch } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import { Eyebrow } from "../ui";
import TrainerBio from "../TrainerBio";
import GuaranteeBadge from "./GuaranteeBadge";
import VideoReviewGrid from "../VideoReviewGrid";

// Sections of /programs/sharp-brain (rewritten 1 Oct 2026), in page order:
// hero → sound familiar? → why it happens / what we train → outcomes →
// inside the app → 7 live classes → who it's for → how it works → proof →
// trainer → the offer (#enrol: value stack, batch, price, guarantee) →
// FAQ → final CTA. Prices and batch dates come from SharpBrainPricingProvider.

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
function EnrolAndTestButtons({ speedTest, location, className = "" }: { speedTest: string; location: string; className?: string }): React.JSX.Element {
  const enrol = useEnrolLabel();
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <a
        href={ENROL_HREF}
        onClick={() => trackGaEvent("sharp_brain_enrol_click", { location })}
        className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        data-enrol-link
      >
        {enrol}
      </a>
      <Link
        href={FREE_TEST_LINKS.speedTest}
        className="inline-flex items-center justify-center rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
      >
        {speedTest}
      </Link>
    </div>
  );
}

export function SharpBrainHero(): React.JSX.Element {
  const c = useCopy().hero;
  const { lang } = useLanguage();
  const next = useNextBatch();
  return (
    <section id="top" className="border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold">{c.eyebrow}</p>
          <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px] lg:text-[50px]">{c.h1}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink sm:text-[18.5px]">{c.sub}</p>
          <EnrolAndTestButtons speedTest={c.speedTest} location="sharp_brain_hero" className="mt-8" />
          <PriceLine className="mt-4" />
          {next !== null && <p className="mt-5 text-[13.5px] leading-relaxed text-ink-faint">{c.trust(istDayMonth(next.startsAtMs, lang))}</p>}
        </div>
        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="relative aspect-[1374/1145] w-full overflow-hidden rounded-sm border border-line-strong bg-panel2">
            <Image src={trainer.photo.src} alt={trainer.photo.alt} fill priority sizes="(min-width: 1024px) 480px, 92vw" className="object-cover object-top" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SharpBrainProblems(): React.JSX.Element {
  const c = useCopy().problems;
  return (
    <section id="sound-familiar" className={`${sectionClass} bg-panel`}>
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

const APP_SHOTS: Record<ExerciseGroup["id"], string> = {
  focus: "/assets/sharp-brain/app/focus-color-word-sync.webp",
  reading: "/assets/sharp-brain/app/reading-phrase-reading.webp",
  memory: "/assets/sharp-brain/app/memory-dot-memory-grid.webp",
  visual: "/assets/sharp-brain/app/visual-sensory-imagery-builder.webp",
  calm: "/assets/sharp-brain/app/calm-breath-balance.webp",
};

export function SharpBrainApp(): React.JSX.Element {
  const c = useCopy().app;
  return (
    <section id="inside-the-app" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <p className="mt-3 text-[16px] text-ink-dim">{c.note}</p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {c.groups.map((group) => (
            <article key={group.id} className="flex flex-col overflow-hidden rounded-sm border border-line bg-panel">
              <div className="relative aspect-[9/16] w-full border-b border-line bg-panel2 sm:aspect-[3/4] lg:aspect-[9/16]">
                <Image src={APP_SHOTS[group.id]} alt={c.shotAlt[group.id]} fill sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 92vw" className="object-cover object-top" />
              </div>
              <div className="p-5">
                <h3 className="text-[16px] font-bold text-ink">{group.skill}</h3>
                <ul className="mt-2 space-y-1 text-[13.5px] leading-relaxed text-ink-dim">
                  {group.exercises.map((exercise) => (
                    <li key={exercise}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SharpBrainClasses(): React.JSX.Element {
  const c = useCopy().classes;
  return (
    <section id="live-classes" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {c.items.map((item, index) => (
            <li key={item.title} className="rounded-sm border border-line bg-void p-5">
              <span className="font-mono text-[12px] font-semibold text-teal">{index + 1}</span>
              <h3 className="mt-1 text-[16.5px] font-bold leading-snug text-ink">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{item.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[15px] font-semibold text-ink">{c.note}</p>
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
    <section id="certificate" className={sectionClass}>
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
  const testimonials = useProgramTestimonials("sharpBrain").filter((item) => item.quote !== null);
  const [showMore, setShowMore] = useState(false);
  const { lang } = useLanguage();

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

        <p className="mt-8 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{c.oldLabel}</p>
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
            {showMore ? (lang === "hi" ? "कम दिखाएं" : "Show fewer") : lang === "hi" ? "और वीडियो देखें" : "Watch more videos"}
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
      <div className="mx-auto max-w-2xl">
        <TrainerBio variant="short" accent="gold" eyebrow={c.eyebrow} />
        <Link href="/about" className="mt-4 inline-flex text-[14px] font-semibold text-gold hover:underline">
          {c.readStory}
        </Link>
      </div>
    </section>
  );
}

export function SharpBrainOffer(): React.JSX.Element {
  const c = useCopy().offer;
  const { lang } = useLanguage();
  return (
    <section id="enrol" className={`scroll-mt-20 ${sectionClass}`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className={h2Class}>{c.title}</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <ul className="space-y-3">
            {c.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="rounded-sm border border-gold bg-panel p-6 sm:p-7">
            <p className="text-[19px] font-bold text-ink">{lang === "hi" ? programs.sharpBrain.nameHi : programs.sharpBrain.name}</p>
            <PriceLine className="mt-2" />
            <div className="mt-6">
              <BatchCheckout location="sharp_brain_offer" showPerDay />
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-dim" data-guarantee-short>
              {qsrGuarantee[lang].short}{" "}
              <a href="#guarantee" className="font-medium text-ink underline underline-offset-2">
                {qsrGuarantee[lang].fullTerms}
              </a>
            </p>
            <a
              href={WHATSAPP_MASTERCLASS_INQUIRY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_offer" })}
              className="mt-4 inline-flex w-full items-center justify-center rounded-sm border border-line-strong px-7 py-3.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-panel2 sm:w-auto"
            >
              {c.questions}
            </a>
          </div>
        </div>
        <div className="mt-8 max-w-3xl">
          <GuaranteeBadge id="guarantee" />
        </div>
      </div>
    </section>
  );
}

export function SharpBrainFaq(): React.JSX.Element {
  const c = useCopy().faq;
  return (
    <section id="faq" className={`${sectionClass} bg-panel`}>
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
  return (
    <section className={sectionClass}>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">{c.title}</h2>
        <EnrolAndTestButtons speedTest={c.speedTest} location="sharp_brain_final" className="mt-7 justify-center" />
        <PriceLine className="mt-4" />
      </div>
    </section>
  );
}

export function SharpBrainStickyBar(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = useCopy().sticky;
  const next = useNextBatch();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-void/95 backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-ink">{lang === "hi" ? programs.sharpBrain.nameHi : programs.sharpBrain.name}</p>
          {next !== null && (
            <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">
              {next.offer !== "regular" && <s className="mr-1">₹{next.regularInr.toLocaleString("en-IN")}</s>}₹{next.amountInr.toLocaleString("en-IN")} ·{" "}
              {istDayMonth(next.startsAtMs, lang)}
            </p>
          )}
        </div>
        <a
          href={ENROL_HREF}
          onClick={() => trackGaEvent("sharp_brain_enrol_click", { location: "sharp_brain_sticky" })}
          className="inline-flex flex-none items-center rounded-sm bg-gold px-5 py-2.5 text-[13.5px] font-semibold text-[#1B1508]"
        >
          {c.cta}
        </a>
      </div>
    </div>
  );
}

// /reviews hero: same look as the program page, one H1, live price.
export function SharpBrainReviewsHero(): React.JSX.Element {
  const c = useCopy();
  return (
    <section id="top" className="border-b border-line px-4 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
      <div className="mx-auto max-w-content">
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold">{c.reviews.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">{c.reviews.h1}</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink">{c.reviews.sub}</p>
        <EnrolAndTestButtons speedTest={c.hero.speedTest} location="reviews_hero" className="mt-8" />
        <PriceLine className="mt-4" />
        <Link href={programs.sharpBrain.url} className="mt-5 inline-block text-[14px] font-semibold text-gold hover:underline">
          {c.reviews.programLink}
        </Link>
      </div>
    </section>
  );
}
