"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { programs, trainer, primaryCheckoutHref } from "@/config/site.config";
import { FREE_TEST_LINKS, ORGANISATIONS_HREF, SCHOOLS_HREF } from "@/config/navigation";
import { WHATSAPP_FREE_INTRO_SESSION_LINK } from "@/config/whatsappSupportLink";
import { QSR_ADULT_VIDEO_REVIEWS, QSR_MORE_VIDEO_REVIEWS, QSR_YOUNG_LEARNER_VIDEO_REVIEWS } from "@/config/qsrVideoReviews";
import { SUCCESS_STORIES_PLAYLIST_WATCH_URL } from "@/config/reviewsPlaylist";
import { useProgramTestimonials } from "@/hooks/useTestimonials";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { sharpBrainCopy, type AudienceTab } from "@/lib/sharpBrainCopy";
import { Eyebrow } from "../ui";
import TrainerBio from "../TrainerBio";
import VideoReviewGrid from "../VideoReviewGrid";

// Sections of /programs/sharp-brain (site-rebuild Phase 5B), in page order:
// hero → audiences (tabs) → 5 skills → how it works → formats & prices →
// parents → proof → trainer → guarantee → FAQ → final CTA.

function useCopy(): (typeof sharpBrainCopy)["en"] {
  const { lang } = useLanguage();
  return sharpBrainCopy[lang];
}

const PROGRAM_CHECKOUT = primaryCheckoutHref("sharpBrain");

function inr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const sectionClass = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";

export function SharpBrainHero(): React.JSX.Element {
  const c = useCopy().hero;
  return (
    <section id="top" className="border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold">{c.parentLine}</p>
          <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px] lg:text-[50px]">{c.h1}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink sm:text-[18.5px]">{c.sub}</p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-dim">{c.positioning}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#formats"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              {c.ctaPrimary} ↓
            </a>
            <Link
              href={programs.focusStarter.url}
              className="inline-flex items-center justify-center rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
            >
              {c.ctaSecondary}
            </Link>
          </div>
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

export function SharpBrainAudiences(): React.JSX.Element {
  const c = useCopy().audiences;
  const [active, setActive] = useState<AudienceTab["id"]>("parents");
  // #parents / #students / #professionals links (hero, nav, other pages) open that tab.
  useEffect(() => {
    function fromHash(): void {
      const id = window.location.hash.replace("#", "");
      if (id === "parents" || id === "students" || id === "professionals") setActive(id);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);
  const tab = c.tabs.find((item) => item.id === active) ?? c.tabs[0];

  return (
    <section id="who-its-for" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <div role="tablist" aria-label={c.title} className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {c.tabs.map((item) => (
            <button
              key={item.id}
              id={item.id}
              type="button"
              role="tab"
              aria-selected={active === item.id}
              aria-controls="audience-panel"
              onClick={() => setActive(item.id)}
              className={`scroll-mt-24 rounded-sm border px-4 py-2.5 text-left text-[14px] font-semibold transition-colors ${
                active === item.id ? "border-gold bg-gold text-[#1B1508]" : "border-line-strong text-ink-dim hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {tab !== undefined && (
          <div id="audience-panel" role="tabpanel" aria-labelledby={tab.id} className="mt-6 rounded-sm border border-line bg-void p-6 sm:p-7">
            <h3 className="text-[19px] font-bold text-ink">{tab.title}</h3>
            <ul className="mt-4 space-y-3">
              {tab.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-dim">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function SharpBrainSkills(): React.JSX.Element {
  const c = useCopy().skills;
  return (
    <section id="skills" className={sectionClass}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {c.items.map((item, index) => (
            <div key={item.title} className="rounded-sm border border-line bg-panel p-5">
              <span className="font-mono text-[12px] font-semibold text-gold">0{index + 1}</span>
              <h3 className="mt-2 text-[17px] font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{item.desc}</p>
            </div>
          ))}
        </div>
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
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((step, index) => (
            <li key={step.title} className="rounded-sm border border-line bg-void p-6">
              <span className="font-mono text-[12px] font-semibold text-teal">0{index + 1}</span>
              <h3 className="mt-2 text-[18px] font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{step.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[13.5px] leading-relaxed text-ink-faint">{c.eegLine}</p>
      </div>
    </section>
  );
}

function GuaranteeBox(): React.JSX.Element {
  const c = useCopy().guarantee;
  return (
    <div className="flex items-start gap-3 rounded-sm border border-gold/40 bg-gold-soft px-5 py-4">
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
      <div>
        <p className="text-[14px] font-bold text-ink">{c.title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-dim">
          {c.statement} {c.request}{" "}
          <Link href="/refund-policy" className="underline underline-offset-2 hover:text-ink">
            {c.policy}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function SharpBrainFormats(): React.JSX.Element {
  const c = useCopy().formats;
  const { lang } = useLanguage();
  const byId = {
    workshop: programs.sharpBrainWorkshop,
    program: programs.sharpBrain,
    self: programs.sharpBrainSelfLearning,
  } as const;

  return (
    <section id="formats" className={`scroll-mt-20 ${sectionClass}`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <p className="mt-3 text-[15px] text-ink-dim">{c.batchLine}</p>
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {c.items.map((item) => {
            const program = byId[item.id];
            const amounts = program.prices.map((price) => price.amountInr).filter((amount) => amount > 0);
            const price = amounts.length > 0 ? inr(Math.min(...amounts)) : null;
            const isPaid = item.id === "program";
            const href = isPaid ? PROGRAM_CHECKOUT : (program.checkout[0]?.href ?? "#");
            return (
              <article
                key={item.id}
                className={`flex flex-col rounded-sm border p-6 sm:p-7 ${item.recommended === true ? "border-gold bg-panel" : "border-line-strong bg-panel"}`}
              >
                <h3 className="text-[19px] font-bold text-ink">{item.name}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-ink-dim">{item.desc}</p>
                <p className="mt-5 text-[26px] font-extrabold text-ink">
                  {price ?? <span className="text-[14px] font-semibold text-ink-faint">{c.priceOnRequest}</span>}
                  {price !== null && <span className="ml-2 text-[13px] font-semibold uppercase tracking-[0.04em] text-ink-faint">{c.oneTime}</span>}
                </p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGaEvent(isPaid ? "razorpay_checkout_click" : "whatsapp_click", { location: `sharp_brain_format_${item.id}` })
                  }
                  className={`mt-5 inline-flex items-center justify-center rounded-sm px-5 py-3 text-[14.5px] font-semibold transition-transform hover:-translate-y-0.5 ${
                    isPaid ? "bg-gold text-[#1B1508] hover:bg-[#cb9a44]" : "border border-line-strong text-ink hover:bg-panel2"
                  }`}
                >
                  {item.cta} →
                </a>
              </article>
            );
          })}
        </div>
        <div className="mt-6 max-w-2xl">
          <GuaranteeBox />
        </div>
        <p className="mt-4 text-[12.5px] text-ink-faint">
          {lang === "hi" ? "Razorpay के ज़रिए सुरक्षित चेकआउट" : "Secure checkout via Razorpay"}
        </p>
        <p className="mt-6 text-[14px] text-ink-dim">
          {c.orgLine.lead}{" "}
          <Link href={SCHOOLS_HREF} className="font-semibold text-gold hover:underline">
            {c.orgLine.schools} →
          </Link>
          <span className="mx-2 text-ink-faint">·</span>
          <Link href={ORGANISATIONS_HREF} className="font-semibold text-gold hover:underline">
            {c.orgLine.corporate} →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function SharpBrainParents(): React.JSX.Element {
  const c = useCopy().parents;
  return (
    <section id="for-parents" className={`${sectionClass} bg-panel`}>
      <div className="mx-auto max-w-content">
        <Eyebrow color="text-teal">{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {c.points.map((point) => (
            <li key={point} className="flex items-start gap-3 rounded-sm border border-line bg-void p-5 text-[15px] leading-relaxed text-ink">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
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
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>

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
          <a href={SUCCESS_STORIES_PLAYLIST_WATCH_URL} target="_blank" rel="noopener noreferrer" className="text-[14px] font-semibold text-gold hover:underline">
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
    <section id="faq" className={sectionClass}>
      <div className="mx-auto max-w-3xl">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.title}</h2>
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
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">{c.title}</h2>
        <a
          href={PROGRAM_CHECKOUT}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGaEvent("razorpay_checkout_click", { location: "sharp_brain_final" })}
          className="mt-7 inline-flex items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
        >
          {c.cta} →
        </a>
        <div className="mt-10 rounded-sm border border-line bg-panel p-6">
          <p className="text-[16px] font-bold text-ink">{c.freeTitle}</p>
          <p className="mt-1 text-[14px] text-ink-dim">{c.freeDesc}</p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            <Link href={programs.focusStarter.url} className="text-[14px] font-semibold text-teal hover:underline">
              {c.starter} →
            </Link>
            <Link href={FREE_TEST_LINKS.speedTest} className="text-[14px] font-semibold text-teal hover:underline">
              {c.speedTest} →
            </Link>
            <a
              href={WHATSAPP_FREE_INTRO_SESSION_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGaEvent("whatsapp_click", { location: "sharp_brain_live_session" })}
              className="text-[14px] font-semibold text-teal hover:underline"
            >
              {c.liveSession} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SharpBrainStickyBar(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = useCopy().sticky;
  const amount = programs.sharpBrain.prices[0]?.amountInr;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-void/95 backdrop-blur-md sm:hidden">
      <div className="mx-auto flex max-w-content items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-semibold text-ink">{lang === "hi" ? programs.sharpBrain.nameHi : programs.sharpBrain.name}</p>
          {amount !== undefined && <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{inr(amount)}</p>}
        </div>
        <a
          href={PROGRAM_CHECKOUT}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGaEvent("razorpay_checkout_click", { location: "sharp_brain_sticky" })}
          className="inline-flex flex-none items-center rounded-sm bg-gold px-5 py-2.5 text-[13.5px] font-semibold text-[#1B1508]"
        >
          {c.cta}
        </a>
      </div>
    </div>
  );
}
