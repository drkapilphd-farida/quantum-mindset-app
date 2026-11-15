import Image from "next/image";
import {
  BookOpenText,
  Brain,
  Building2,
  CircleCheck,
  Download,
  GraduationCap,
  Headphones,
  Info,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Target,
  Timer,
  TrendingDown,
  Users,
  Frown,
} from "lucide-react";
import { SITE_CONFIG_WHATSAPP_NUMBER } from "@/config/site.config";
import { CONSENT_PDF, SCHOOLS_COPY, type SchoolsLang } from "../copy";
import {
  faqFor,
  filledMetrics,
  heroMedia,
  METRIC_UNITS,
  pick,
  priceLabel,
  visibleResults,
  type MetricId,
  type MetricValues,
  type SchoolSettings,
} from "../settings";
import { upcomingMonths } from "../leadSchema";
import { SchoolLeadForm } from "./SchoolLeadForm";
import { HeadbandIllustration } from "./HeadbandIllustration";

// /schools sections, in the founder's order (brief, 15 Nov 2026). Inside the
// "play" design scope (Sunny Playground light / Night Sky dark, Baloo
// headings, Noto body), like Brain Unlock. Sections whose data comes from the
// admin settings are hidden while it is empty.

type P = { lang: SchoolsLang; settings: SchoolSettings };

const wrap = "mx-auto w-full max-w-5xl";
const section = "px-4 py-14 sm:px-8 sm:py-20";
const h2 = "text-[28px] leading-tight sm:text-[36px]";
const primaryBtn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-[2.5px] border-[var(--play-outline)] bg-primary px-6 py-3 text-center font-heading text-[17px] text-primary-foreground shadow-[0_4px_0_#4c1d95] transition-transform active:translate-y-0.5 dark:border-0 dark:shadow-[0_6px_20px_rgb(124_58_237/0.45)]";
const outlineBtn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--play-outline)] bg-card px-6 py-3 text-center text-[16px] font-bold text-card-foreground";

const SKILL: Record<MetricId, string> = {
  focus: "var(--skill-focus)",
  memory: "var(--skill-memory)",
  reading: "var(--skill-reading)",
  retention: "var(--skill-calm)",
};

export const whatsappHref = (text: string): string =>
  `https://wa.me/${SITE_CONFIG_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export function Disclaimer({ lang, className = "" }: { lang: SchoolsLang; className?: string }): React.JSX.Element {
  return (
    <p className={`flex items-start gap-1.5 text-[14px] text-muted-foreground ${className}`} data-disclaimer>
      <Info aria-hidden className="mt-0.5 size-4 flex-none" />
      <span>{SCHOOLS_COPY[lang].disclaimer}</span>
    </p>
  );
}

export function SchoolHero({ lang, settings }: P): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].hero;
  const media = heroMedia(settings);
  return (
    <section id="top" className={`${section} pt-10 sm:pt-14`} data-school-hero>
      <div className={`${wrap} grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12`}>
        <div className="flex min-w-0 flex-col gap-5">
          <p className="w-fit rounded-full bg-[var(--skill-focus)]/10 px-3 py-1 text-[14px] font-bold text-[var(--skill-focus)]">{c.eyebrow}</p>
          <h1 className="text-[30px] leading-[1.15] sm:text-[44px]">{c.h1}</h1>
          <p className="text-[17px] leading-relaxed text-muted-foreground sm:text-[19px]">{c.sub}</p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            <a href="#book" className={primaryBtn} data-school-book>
              {c.book}
            </a>
            <a href={whatsappHref(c.whatsappText)} target="_blank" rel="noopener noreferrer" className={outlineBtn} data-school-whatsapp>
              <MessageCircle aria-hidden className="size-5 text-[#16a34a]" />
              {c.whatsapp}
            </a>
          </div>
          <Disclaimer lang={lang} />
        </div>
        <div className="play-card overflow-hidden p-0" data-school-hero-media={media?.kind ?? "illustration"}>
          {media === null ? (
            <HeadbandIllustration label={c.mediaAlt} />
          ) : media.kind === "video" ? (
            <video
              className="aspect-[4/3] w-full object-cover"
              src={media.url}
              poster={media.poster || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={c.mediaAlt}
            />
          ) : (
            <Image src={media.url} alt={c.mediaAlt} width={1200} height={900} className="aspect-[4/3] w-full object-cover" sizes="(min-width: 1024px) 440px, 100vw" priority />
          )}
        </div>
      </div>
    </section>
  );
}

const CHALLENGE_ICONS = [TrendingDown, Smartphone, BookOpenText, Frown];

export function SchoolChallenge({ lang }: { lang: SchoolsLang }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].challenge;
  return (
    <section className={`${section} bg-muted`} data-school-challenge>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.points.map((p, i) => {
            const Icon = CHALLENGE_ICONS[i] ?? Info;
            return (
              <li key={p.title} className="play-card flex gap-4 p-5">
                <Icon aria-hidden className="mt-1 size-7 flex-none text-[var(--skill-reading)]" />
                <div>
                  <h3 className="text-[20px]">{p.title}</h3>
                  <p className="mt-1 text-[16px] leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="font-heading text-[22px] leading-snug text-[var(--skill-focus)] sm:text-[26px]">{c.line}</p>
      </div>
    </section>
  );
}

const STEP_ICONS = [Headphones, Target, BookOpenText, Brain, MessageCircle];
const STEP_COLORS = ["var(--skill-calm)", "var(--skill-focus)", "var(--skill-reading)", "var(--skill-memory)", "#16a34a"];

export function SchoolHowItWorks({ lang }: { lang: SchoolsLang }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].how;
  return (
    <section className={section} data-school-how>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {c.steps.map((s, i) => {
            const Icon = STEP_ICONS[i] ?? Info;
            return (
              <li key={s.title} className="play-card flex flex-col gap-2 p-5">
                <span className="flex items-center gap-3">
                  <span className="flex size-11 flex-none items-center justify-center rounded-2xl text-white" style={{ background: STEP_COLORS[i] }}>
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <span className="font-heading text-[15px] text-muted-foreground">{i + 1}</span>
                </span>
                <h3 className="text-[19px]">{s.title}</h3>
                <p className="text-[15.5px] leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            );
          })}
        </ol>
        <ul className="flex flex-wrap gap-2" data-school-how-note>
          {c.note.map((n, i) => (
            <li key={n} className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--play-outline)] bg-card px-3 py-1.5 text-[15px] font-semibold">
              {i === 0 ? <Timer aria-hidden className="size-4" /> : <CircleCheck aria-hidden className="size-4 text-[var(--play-good)]" />}
              {n}
            </li>
          ))}
        </ul>
        <Disclaimer lang={lang} />
      </div>
    </section>
  );
}

const GET_ICONS = [GraduationCap, Users, Building2, BookOpenText];
const GET_COLORS = ["var(--skill-focus)", "var(--skill-memory)", "var(--skill-reading)", "var(--skill-calm)"];

export function SchoolWhatEveryoneGets({ lang }: { lang: SchoolsLang }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].gets;
  return (
    <section className={`${section} bg-muted`} data-school-gets>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {c.cards.map((card, i) => {
            const Icon = GET_ICONS[i] ?? Info;
            return (
              <li key={card.who} className="play-card flex flex-col gap-3 p-5">
                <span className="flex items-center gap-3">
                  <Icon aria-hidden className="size-7" style={{ color: GET_COLORS[i] }} />
                  <span className="font-heading text-[15px] uppercase tracking-wide" style={{ color: GET_COLORS[i] }}>
                    {card.who}
                  </span>
                </span>
                <h3 className="text-[22px]">{card.title}</h3>
                <ul className="flex flex-col gap-1.5">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[16px]">
                      <CircleCheck aria-hidden className="mt-0.5 size-5 flex-none text-[var(--play-good)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <Disclaimer lang={lang} />
      </div>
    </section>
  );
}

function CompareBars({ lang, metrics, compact = false }: { lang: SchoolsLang; metrics: MetricValues; compact?: boolean }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].passport;
  return (
    <ul className={`flex flex-col ${compact ? "gap-3" : "gap-4"}`}>
      {filledMetrics(metrics).map((m) => {
        const max = Math.max(m.day1, m.day30, 1);
        const unit = METRIC_UNITS[m.id];
        return (
          <li key={m.id} className="flex flex-col gap-1.5" data-metric={m.id}>
            <span className="font-heading text-[17px]">{c.metrics[m.id]}</span>
            {(["day1", "day30"] as const).map((d) => (
              <span key={d} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-2 text-[14.5px]">
                <span className="text-muted-foreground">{d === "day1" ? c.day1 : c.day30}</span>
                <span className="h-3.5 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${Math.max(4, (m[d] / max) * 100)}%`, background: d === "day1" ? "color-mix(in srgb, var(--muted-foreground) 55%, transparent)" : SKILL[m.id] }}
                  />
                </span>
                <span className="min-w-16 text-right font-semibold tabular-nums">
                  {m[d]}
                  {unit}
                </span>
              </span>
            ))}
          </li>
        );
      })}
    </ul>
  );
}

export function SchoolSamplePassport({ lang, settings }: P): React.JSX.Element | null {
  const c = SCHOOLS_COPY[lang];
  const images = settings.sampleReports;
  const hasExample = filledMetrics(settings.example).length > 0;
  if (images.length === 0 && !hasExample) return null;
  return (
    <section className={section} data-school-passport>
      <div className={`${wrap} flex flex-col gap-8`}>
        <div>
          <h2 className={h2}>{c.passport.title}</h2>
          <p className="mt-2 text-[17px] text-muted-foreground">{c.passport.sub}</p>
        </div>
        {images.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-school-samples>
            {images.map((img) => (
              <li key={img.url} className="play-card overflow-hidden p-0">
                <Image src={img.url} alt={pick(img.caption, lang) || c.passport.title} width={800} height={1100} className="h-auto w-full bg-white object-contain" sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" />
                <p className="px-4 py-3 text-[14.5px] text-muted-foreground">{pick(img.caption, lang) || c.passport.sampleNote}</p>
              </li>
            ))}
          </ul>
        )}
        {hasExample && (
          <div className="play-card flex max-w-2xl flex-col gap-5 p-5 sm:p-6" data-school-example>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-[22px]">{c.passport.compareTitle}</h3>
              <span className="rounded-full bg-[var(--play-warn-bg)] px-3 py-0.5 text-[14px] font-bold text-[var(--play-warn)]" data-example-label>
                {c.example}
              </span>
            </div>
            <CompareBars lang={lang} metrics={settings.example} />
          </div>
        )}
        <Disclaimer lang={lang} />
      </div>
    </section>
  );
}

export function SchoolPackages({ lang, settings }: P): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].packages;
  return (
    <section id="packages" className={`${section} bg-muted`} data-school-packages>
      <div className={`${wrap} flex flex-col gap-8`}>
        <div>
          <h2 className={h2}>{c.title}</h2>
          <p className="mt-2 text-[17px] text-muted-foreground">{c.sub}</p>
        </div>
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {c.items.map((p) => (
            <li key={p.id} className={`play-card relative flex flex-col gap-4 p-6 ${p.id === "program" ? "ring-4 ring-[var(--skill-memory)]/40" : ""}`} data-package={p.id}>
              {p.id === "program" && (
                <span className="absolute -top-3.5 right-5 rounded-full bg-[var(--skill-memory)] px-3 py-1 text-[13px] font-bold text-white">{c.popular}</span>
              )}
              <div>
                <h3 className="text-[23px]">{p.name}</h3>
                <p className="text-[15.5px] text-muted-foreground">{p.who}</p>
              </div>
              <p className="font-heading text-[28px] leading-none text-[var(--skill-focus)]" data-package-price>
                {priceLabel(settings, p.id, lang)}
              </p>
              <ul className="flex flex-1 flex-col gap-2">
                {p.includes.map((x) => (
                  <li key={x} className="flex items-start gap-2 text-[16px]">
                    <CircleCheck aria-hidden className="mt-0.5 size-5 flex-none text-[var(--play-good)]" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="text-[15px] font-semibold">{p.note}</p>
              <a href="#book" className={p.id === "pilot" ? primaryBtn : outlineBtn}>
                {c.cta}
              </a>
            </li>
          ))}
        </ul>
        <Disclaimer lang={lang} />
      </div>
    </section>
  );
}

export function SchoolResults({ lang, settings }: P): React.JSX.Element | null {
  const results = visibleResults(settings);
  if (results.length === 0) return null;
  const c = SCHOOLS_COPY[lang].results;
  return (
    <section className={section} data-school-results>
      <div className={`${wrap} flex flex-col gap-8`}>
        <div>
          <h2 className={h2}>{c.title}</h2>
          <p className="mt-2 text-[17px] text-muted-foreground">{c.sub}</p>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {results.map((r, i) => (
            <li key={i} className="play-card flex flex-col gap-4 p-5">
              <div>
                <h3 className="text-[20px]">{pick(r.label, lang)}</h3>
                {r.students !== null && (
                  <p className="text-[15px] text-muted-foreground">
                    {r.students} {c.students}
                  </p>
                )}
              </div>
              <CompareBars lang={lang} metrics={r.metrics} compact />
            </li>
          ))}
        </ul>
        <Disclaimer lang={lang} />
      </div>
    </section>
  );
}

export function SchoolAbout({ lang }: { lang: SchoolsLang }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].about;
  return (
    <section className={`${section} bg-muted`} data-school-about>
      <div className={`${wrap} flex flex-col gap-6`}>
        <h2 className={h2}>{c.title}</h2>
        <div className="play-card overflow-hidden p-0">
          <Image
            src="/images/telepathy-workshop/dr-kapil-portrait.jpg"
            alt={c.photoAlt}
            width={1512}
            height={688}
            className="aspect-[2.2/1] w-full object-cover object-left"
            sizes="(min-width: 1024px) 1024px, 100vw"
          />
          <div className="flex flex-col gap-3 p-5 sm:p-6">
            <p className="font-heading text-[19px] leading-snug sm:text-[21px]" data-coach-line>
              {c.coachLine}
            </p>
            {c.bio.map((line) => (
              <p key={line} className="text-[16.5px] leading-relaxed text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SchoolSafety({ lang }: { lang: SchoolsLang }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].safety;
  const other: SchoolsLang = lang === "en" ? "hi" : "en";
  return (
    <section id="safety" className={section} data-school-safety>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {c.points.map((p) => (
            <li key={p.title} className="play-card flex gap-3 p-5">
              <ShieldCheck aria-hidden className="mt-0.5 size-6 flex-none text-[var(--skill-calm)]" />
              <div>
                <h3 className="text-[19px]">{p.title}</h3>
                <p className="mt-1 text-[15.5px] leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="play-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-xl">
            <h3 className="text-[21px]">{c.consentTitle}</h3>
            <p className="mt-1 text-[16px] text-muted-foreground">{c.consentText}</p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <a href={CONSENT_PDF[lang]} target="_blank" rel="noopener" className={primaryBtn} data-consent-pdf={lang}>
              <Download aria-hidden className="size-5" />
              {c.download}
            </a>
            <a href={CONSENT_PDF[other]} target="_blank" rel="noopener" className="text-center text-[15px] font-semibold underline underline-offset-4" data-consent-pdf={other}>
              {c.downloadOther}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SchoolFaq({ lang, settings }: P): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].faq;
  return (
    <section id="faq" className={`${section} bg-muted`} data-school-faq>
      <div className={`${wrap} flex flex-col gap-6`}>
        <h2 className={h2}>{c.title}</h2>
        <div className="flex flex-col gap-3">
          {faqFor(settings, lang).map((item) => (
            <details key={item.q} className="play-card group p-0">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-heading text-[18px] [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="text-[22px] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-[16px] leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SchoolBook({ lang }: { lang: SchoolsLang }): React.JSX.Element {
  const c = SCHOOLS_COPY[lang].form;
  return (
    <section id="book" className={`${section} scroll-mt-20`} data-school-book-section>
      <div className={`${wrap} flex max-w-3xl flex-col gap-6`}>
        <div>
          <h2 className={h2}>{c.title}</h2>
          <p className="mt-2 text-[17px] text-muted-foreground">{c.sub}</p>
        </div>
        <SchoolLeadForm lang={lang} months={upcomingMonths()} />
      </div>
    </section>
  );
}
