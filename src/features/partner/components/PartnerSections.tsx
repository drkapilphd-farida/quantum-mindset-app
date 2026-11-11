import Image from "next/image";
import { PAGE_VIDEOS } from "@/config/site.config";
import { PageVideo } from "@/components/video/PageVideo";
import { Check } from "lucide-react";
import { FOUNDING_PARTNERS } from "@/config/partnerProgram";
import { YOUTUBE_CHANNEL } from "@/data/links";
import { partnerCopy } from "../partnerCopy";
import { EarningsCalculator, HeroEarningsCard, PartnerApplyForm, PartnerReviews } from "./PartnerInteractive";

// /partner sections, in page order. Colours: the site's own tokens; the
// reference design's blue (#1F3A8A) and light-blue band (#EEF2FB) only
// where the site has no matching colour (sliders, highlights, the band).

const wrap = "mx-auto max-w-content";
const section = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";
const h2 = "text-[28px] font-extrabold leading-tight sm:text-[36px]";
const goldButton =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-7 py-3.5 text-[17px] font-extrabold text-[#1B1508] transition-transform hover:-translate-y-0.5";

export function PartnerHero(): React.JSX.Element {
  const c = partnerCopy.hero;
  return (
    <section id="top" className="warm-dark px-4 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
      <div className={`${wrap} grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12`}>
        <div className="flex min-w-0 flex-col gap-5">
          <p className="text-[13px] font-semibold tracking-[0.06em] text-gold sm:text-[14px]">{c.eyebrow}</p>
          <h1 className="text-[32px] font-extrabold leading-[1.15] sm:text-[44px]">{c.h1}</h1>
          {/* Owner (Nov 2026): the Partner page video — under the headline on phones, beside it on desktop. */}
          <PageVideo video={PAGE_VIDEOS.partner} lang="en" className="lg:hidden" priority />
          <p className="text-[18px] leading-relaxed text-ink-dim sm:text-[20px]">{c.sub}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <a href="#apply" className={goldButton} data-hero-apply>
              {c.apply}
            </a>
            <a
              href="#calc"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong px-6 py-3.5 text-[17px] font-semibold text-ink transition-colors hover:bg-panel2"
            >
              {c.calc}
            </a>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-8">
          <PageVideo video={PAGE_VIDEOS.partner} lang="en" className="hidden lg:flex" priority />
          <HeroEarningsCard />
        </div>
      </div>
      <ul className={`${wrap} mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5`}>
        {c.stats.map((stat) => (
          <li key={stat.value} className="rounded-md border border-line-strong px-4 py-4 sm:px-5">
            <p className="text-[24px] font-extrabold sm:text-[30px]">{stat.value}</p>
            <p className="text-[14.5px] text-ink-dim sm:text-[15.5px]">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PartnerProblem(): React.JSX.Element {
  const c = partnerCopy.problem;
  return (
    <section className={section}>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {c.cards.map((card) => (
            <li key={card.quote} className="rounded-lg border border-line bg-panel p-6">
              <p className="text-[21px] font-extrabold leading-snug">“{card.quote}”</p>
              <p className="mt-2 text-[16.5px] text-ink-dim">{card.line}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-5 rounded-lg bg-[#EEF2FB] p-6 sm:p-7 md:flex-row md:items-center md:gap-8">
          <div className="min-w-0 flex-1">
            <p className="text-[21px] font-extrabold leading-snug sm:text-[24px]">{c.band.title}</p>
            <p className="mt-2 text-[16.5px] leading-relaxed text-[#33415C]">{c.band.text}</p>
          </div>
          <div className="flex gap-3 md:w-[260px] md:flex-none">
            {c.band.prices.map((item) => (
              <div key={item.label} className="flex-1 rounded-md bg-white p-3.5 text-center">
                <p className="text-[14px] text-[#4A5568]">{item.label}</p>
                <p className="text-[24px] font-extrabold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border-l-4 border-[#1F3A8A] bg-panel p-6 sm:p-7" data-not-midbrain>
          <p className="text-[20px] font-extrabold leading-snug sm:text-[22px]">{c.different.title}</p>
          <p className="mt-2 text-[16.5px] leading-relaxed text-ink-dim">{c.different.text}</p>
        </div>
      </div>
    </section>
  );
}

export function PartnerProof(): React.JSX.Element {
  const c = partnerCopy.proof;
  return (
    <section id="reviews" className={`${section} bg-panel`}>
      <div className={wrap}>
        <h2 className={h2}>{c.title}</h2>
        <p className="mt-2 text-[17px] text-ink-dim">{c.sub}</p>
        <PartnerReviews />
        <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center text-[16px] font-bold text-[#1F3A8A] hover:underline">
          {c.youtube}
        </a>
      </div>
    </section>
  );
}

export function PartnerCalculator(): React.JSX.Element {
  const c = partnerCopy.calculator;
  return (
    <section id="calc" className={`scroll-mt-20 ${section}`}>
      <div className={`${wrap} flex flex-col gap-8`}>
        <div>
          <h2 className={h2}>{c.title}</h2>
          <p className="mt-2 text-[17px] text-ink-dim sm:text-[18px]">{c.sub}</p>
        </div>
        <EarningsCalculator />
      </div>
    </section>
  );
}

export function PartnerFirstMonth(): React.JSX.Element {
  const c = partnerCopy.firstMonth;
  return (
    <section className={`${section} bg-panel`}>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {c.weeks.map((week) => (
            <li key={week.week} className="flex flex-col gap-2 rounded-lg border border-line bg-void p-6">
              <span className="w-fit rounded-full bg-[#EEF2FB] px-3 py-0.5 text-[14px] font-extrabold text-[#1F3A8A]">{week.week}</span>
              <h3 className="text-[20px] font-extrabold leading-snug">{week.title}</h3>
              <p className="text-[16px] leading-relaxed text-ink-dim">{week.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PartnerCompare(): React.JSX.Element {
  const c = partnerCopy.compare;
  return (
    <section className={section}>
      <div className={`${wrap} flex flex-col gap-6`}>
        <h2 className={h2}>{c.title}</h2>
        <div className="relative overflow-x-auto rounded-lg border border-line bg-panel" data-compare-scroll>
          <table className="w-full min-w-[620px] border-collapse text-left text-[16px] sm:text-[17px]">
            <caption className="sr-only">{c.caption}</caption>
            <thead>
              <tr className="bg-panel2">
                <td className="px-5 py-4" />
                <th scope="col" className="px-5 py-4 font-semibold text-ink-dim">
                  {c.typical}
                </th>
                <th scope="col" className="bg-[#1F3A8A] px-5 py-4 font-extrabold text-white">
                  {c.ours}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <th scope="row" className="px-5 py-4 font-bold">
                    {row.label}
                  </th>
                  <td className="px-5 py-4 text-ink-dim">{row.typical}</td>
                  <td className="bg-[#EEF2FB] px-5 py-4 font-extrabold">{row.ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-ink-dim">{c.footnote}</p>
      </div>
    </section>
  );
}

export function PartnerWhatYouGet(): React.JSX.Element {
  const c = partnerCopy.get;
  return (
    <section className={`${section} bg-panel`}>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[17.5px] leading-snug">
              <Check className="mt-0.5 h-6 w-6 flex-none text-[#1F3A8A]" strokeWidth={2.5} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PartnerPackages(): React.JSX.Element {
  const c = partnerCopy.packages;
  return (
    <section id="packages" className="border-b border-line bg-[#EEF2FB] px-4 py-16 sm:px-8 sm:py-20">
      <div className={`${wrap} flex flex-col gap-8`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={h2}>{c.title}</h2>
          {FOUNDING_PARTNERS.seatsLeft > 0 && (
            <p className="rounded-full bg-gold px-4 py-2 text-[15.5px] font-extrabold text-[#1B1508] sm:text-[17px]" data-founding-badge>
              {c.founding}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {c.items.map((item) => (
            <article key={item.name} className={`flex flex-col gap-3.5 rounded-lg bg-white p-7 sm:p-8 ${item.primary ? "border-2 border-[#1F3A8A]" : "border border-[#C5CCD8]"}`}>
              <h3 className="text-[22px] font-extrabold">{item.name}</h3>
              <p className="text-[40px] font-extrabold leading-[1.1] sm:text-[44px]">
                {item.price} <span className="text-[17px] font-semibold text-[#4A5568]">{c.gst}</span>
              </p>
              <p className="text-[17px] text-[#33415C]">{item.sub}</p>
              <p className="text-[17px]">{item.text}</p>
              <a
                href="#apply"
                className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 text-[17px] font-extrabold transition-colors ${item.primary ? "bg-[#1F3A8A] text-white hover:bg-[#152a66]" : "border-2 border-[#1F3A8A] text-[#1F3A8A] hover:bg-[#EEF2FB]"}`}
              >
                {c.apply}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnerAbout(): React.JSX.Element {
  const c = partnerCopy.about;
  return (
    <section id="about" className={section}>
      <div className={`${wrap} grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}>
        <div className="relative mx-auto aspect-[1374/1145] w-full max-w-[460px] overflow-hidden rounded-lg border border-line-strong bg-panel2">
          <Image src="/dr-kapil-real.jpg" alt={c.photoAlt} fill sizes="(min-width: 768px) 460px, 92vw" className="object-cover object-top" />
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-[15px] font-semibold text-[#1F3A8A]">{c.eyebrow}</p>
          <h2 className={h2}>{c.name}</h2>
          <p className="text-[18px] leading-relaxed text-ink">{c.text}</p>
          <blockquote className="border-l-4 border-gold pl-4 text-[18px] italic leading-relaxed text-ink">{c.quote}</blockquote>
        </div>
      </div>
    </section>
  );
}

export function PartnerApply(): React.JSX.Element {
  const c = partnerCopy.apply;
  return (
    <section id="apply" className="warm-dark scroll-mt-20 px-4 py-16 sm:px-8 sm:py-20">
      <div className="relative mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <h2 className={h2}>{c.title}</h2>
          <p className="mt-2 text-[17px] text-ink-dim sm:text-[18px]">{c.sub}</p>
        </div>
        <PartnerApplyForm />
      </div>
    </section>
  );
}

export function PartnerFaq(): React.JSX.Element {
  const c = partnerCopy.faq;
  return (
    <section id="faq" className={section}>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <h2 className={`${h2} mb-3`}>{c.title}</h2>
        {c.items.map((item) => (
          <details key={item.question} className="group rounded-lg border border-line bg-panel">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[18px] font-extrabold marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
              <span className="flex-none text-[22px] text-[#1F3A8A] transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-[17px] leading-relaxed text-ink-dim">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
