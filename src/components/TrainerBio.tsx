"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/lib/i18n";
import { trainer } from "@/config/site.config";
import { Eyebrow } from "./ui";

// The one place the trainer's name, title, bio, stats and photo are
// rendered (site-rebuild Phase 2). Every value comes from
// src/config/site.config.ts — pages only supply their own section framing
// (eyebrow, quote, CTA), never a bio, number or photo of their own.
//
// variant="short" — compact avatar + name + title + one-line shortBio, for
//   hero cards and small "your guide" blocks.
// variant="long"  — full profile section: photo, longBio, stats grid.
// tone="light"    — for the light-themed Executive workshop page; the
//   default "dark" uses the site's ink/panel tokens.

type Accent = "rose" | "gold" | "teal";

type TrainerBioProps = {
  variant: "short" | "long";
  tone?: "dark" | "light";
  accent?: Accent;
  /** long: small label above the heading. short: label above the name. */
  eyebrow?: string;
  /** long only — defaults to the trainer's name. */
  heading?: string;
  /** long only. */
  quote?: string;
  /** long only. */
  ctaLabel?: string;
  ctaHref?: string;
  /** long only — render as a full-width <section> (default) or a bare block inside an existing section. */
  asSection?: boolean;
  /** Force a language on English-only pages; defaults to the site language toggle. */
  lang?: Lang;
};

const ACCENT_CLASSES = {
  rose: { eyebrow: "text-rose", ring: "border-rose/50", quote: "border-rose/40" },
  gold: { eyebrow: "text-gold", ring: "border-gold/50", quote: "border-gold/40" },
  teal: { eyebrow: "text-teal", ring: "border-teal/50", quote: "border-teal/40" },
} as const;

const TONE_CLASSES = {
  dark: {
    section: "border-b border-line bg-panel",
    name: "text-ink",
    body: "text-ink-dim",
    faint: "text-ink-faint",
    statCard: "border-line-strong bg-panel2",
    statValue: "text-ink",
    quote: "text-ink",
    shortCard: "border-line-strong bg-panel2",
  },
  light: {
    section: "border-b border-slate-200 bg-white",
    name: "text-slate-900",
    body: "text-slate-600",
    faint: "text-slate-500",
    statCard: "border-slate-200 bg-slate-50",
    statValue: "text-slate-900",
    quote: "text-slate-800",
    shortCard: "border-slate-200 bg-white/95",
  },
} as const;

export default function TrainerBio({
  variant,
  tone = "dark",
  accent = "gold",
  eyebrow,
  heading,
  quote,
  ctaLabel,
  ctaHref,
  asSection = true,
  lang: forcedLang,
}: TrainerBioProps): React.JSX.Element {
  const { lang: siteLang } = useLanguage();
  const lang = forcedLang ?? siteLang;
  const copy = trainer[lang];
  const name = lang === "hi" ? trainer.nameHi : trainer.name;
  const accentClasses = ACCENT_CLASSES[accent];
  const toneClasses = TONE_CLASSES[tone];

  if (variant === "short") {
    return (
      <div className={`rounded-sm border p-5 ${toneClasses.shortCard}`}>
        {eyebrow !== undefined && (
          <p className={`font-mono text-[11px] uppercase tracking-[0.08em] ${toneClasses.faint}`}>{eyebrow}</p>
        )}
        <div className={`flex items-center gap-3.5 ${eyebrow !== undefined ? "mt-4" : ""}`}>
          <div className={`relative h-14 w-14 flex-none overflow-hidden rounded-full border-2 ${accentClasses.ring}`}>
            <Image src={trainer.photo.src} alt={trainer.photo.alt} fill sizes="56px" className="object-cover object-top" />
          </div>
          <div>
            <div className={`text-[15px] font-bold ${toneClasses.name}`}>{name}</div>
            <div className={`mt-0.5 text-[12px] font-semibold ${toneClasses.body}`}>{copy.title}</div>
          </div>
        </div>
        <p className={`mt-3 text-[12px] leading-snug ${toneClasses.faint}`}>{copy.shortBio}</p>
      </div>
    );
  }

  const body = (
    <div className="mx-auto max-w-content">
      <div className="mb-14 max-w-xl">
        {eyebrow !== undefined && <Eyebrow color={accentClasses.eyebrow}>{eyebrow}</Eyebrow>}
        <h2 className={`mt-4 text-[28px] font-extrabold leading-tight sm:text-[34px] ${toneClasses.name}`}>{heading ?? name}</h2>
        <p className={`mt-2 text-[13.5px] font-semibold ${toneClasses.body}`}>{copy.title}</p>
        {trainer.doctorate !== null && trainer.doctorate !== "" && (
          <p className={`mt-1 text-[12.5px] ${toneClasses.faint}`}>{trainer.doctorate}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
        <div className={`relative aspect-square w-full max-w-[240px] overflow-hidden rounded-sm border ${accentClasses.ring}`}>
          <Image src={trainer.photo.src} alt={trainer.photo.alt} fill sizes="240px" className="object-cover object-top" />
        </div>

        <div>
          <p className={`text-[16px] leading-relaxed ${toneClasses.body}`}>{copy.longBio}</p>

          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {copy.stats.map((stat) => (
              <div key={stat.label} className={`rounded-sm border px-4 py-4 text-center ${toneClasses.statCard}`}>
                <div className={`font-display text-[26px] font-bold ${toneClasses.statValue}`}>{stat.value}</div>
                <div className={`mt-1 text-[11px] leading-snug ${toneClasses.faint}`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {quote !== undefined && (
            <p className={`mt-7 border-l-2 pl-4 text-[15px] italic leading-relaxed ${toneClasses.quote} ${accentClasses.quote}`}>
              &ldquo;{quote}&rdquo;
            </p>
          )}

          {ctaLabel !== undefined && ctaHref !== undefined && (
            <a href={ctaHref} className={`group mt-7 inline-flex items-center gap-2 text-[13.5px] font-semibold ${toneClasses.name}`}>
              {ctaLabel}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  if (!asSection) return body;

  return <section className={`px-6 py-24 sm:px-8 ${toneClasses.section}`}>{body}</section>;
}
