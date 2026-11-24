import { Check } from "lucide-react";
import { waLink } from "@/data/links";
import { LanguageOverride } from "@/context/LanguageContext";
import SiteNav from "@/components/site/SiteNav";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { HomeMeetKapil, HomeTrustStrip } from "@/components/home/HomeTrustMeet";
import { NeuralOrb } from "@/components/fx/NeuralOrb";
import { WhatsAppGlyph } from "@/features/programs/components/WhatsAppGlyph";
import type { EventCopy, EventLang } from "./types";

// One clean landing page for the smaller offers (Telepathy & Intuition
// online workshop, Rishikesh residential retreat) — same look as the
// 21-Day Online Retreat page: hero, what happens, what you get, price card,
// FAQ, final call. Booking is on WhatsApp until a payment link exists.

const say = (text: { en: string; hi: string }, lang: EventLang): string => text[lang];
const SECTION = "border-b border-line px-4 py-14 sm:px-8 sm:py-20";
const WRAP = "mx-auto max-w-content";
const H2 = "text-[26px] font-extrabold leading-tight sm:text-[34px]";
const GOLD = "inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-gold px-7 py-[15px] text-center text-[16px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-gold-dim";

function BookButton({ copy, lang, className = "" }: { copy: EventCopy; lang: EventLang; className?: string }): React.JSX.Element {
  if (copy.payUrl !== undefined) {
    return (
      <a href={copy.payUrl} target="_blank" rel="noopener noreferrer" className={`${GOLD} ${className}`} data-event-pay>
        {say(copy.book, lang)}
      </a>
    );
  }
  return (
    <a href={waLink(copy.bookMessage)} target="_blank" rel="noopener noreferrer" className={`${GOLD} ${className}`} data-event-book>
      <WhatsAppGlyph />
      {say(copy.book, lang)}
    </a>
  );
}

function AskLink({ copy, lang, dark = false }: { copy: EventCopy; lang: EventLang; dark?: boolean }): React.JSX.Element | null {
  if (copy.payUrl === undefined || copy.ask === undefined) return null;
  return (
    <a href={waLink(copy.bookMessage)} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline underline-offset-4 ${dark ? "text-white decoration-white/50" : "text-ink decoration-teal/50"}`} data-event-ask>
      <WhatsAppGlyph />
      {say(copy.ask, lang)}
    </a>
  );
}

export function EventLandingPage({ copy, lang, path }: { copy: EventCopy; lang: EventLang; path: string }): React.JSX.Element {
  const languageLink = lang === "hi" ? { label: "English", href: path } : { label: "हिंदी", href: `${path}?lang=hi` };
  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light min-h-screen font-sans antialiased" lang={lang}>
        <SiteNav languageLink={languageLink} cta={{ label: say(copy.book, lang), href: "#price", external: false }} />
        <main>
          <section className="hero-vivid relative overflow-hidden border-b border-line px-4 pb-14 pt-12 text-white sm:px-8 sm:pb-20 sm:pt-16" data-event-hero>
            <NeuralOrb className="-right-40 -top-20 opacity-60 lg:right-[-60px]" />
            <div className={`${WRAP} relative max-w-3xl`}>
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[12.5px] font-bold tracking-[0.06em] text-white ring-1 ring-white/25">{say(copy.pill, lang)}</span>
              <h1 className="mt-5 text-balance text-[32px] font-extrabold leading-[1.12] tracking-tight sm:text-[46px]">{say(copy.h1, lang)}</h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/95 sm:text-[19px]">{say(copy.sub, lang)}</p>
              <ul className="mt-6 flex flex-wrap gap-2 text-[14.5px]">
                {copy.facts.map((fact) => (
                  <li key={fact.en} className="rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/20">{say(fact, lang)}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <BookButton copy={copy} lang={lang} />
                <span className="text-[15px] font-semibold text-white/90">{say(copy.priceLine, lang)}</span>
              </div>
              <div className="mt-3">
                <AskLink copy={copy} lang={lang} dark />
              </div>
            </div>
          </section>
          <HomeTrustStrip />

          <section className={`${SECTION} band-mint`} data-event-for>
            <div className={WRAP}>
              <h2 className={H2}>{say(copy.forWhom.heading, lang)}</h2>
              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {copy.forWhom.items.map((item) => (
                  <li key={item.en} className="flex items-start gap-3 rounded-sm border border-line bg-panel p-5 text-[16.5px] leading-relaxed">
                    <Check className="mt-1 h-5 w-5 flex-none text-teal" strokeWidth={3} aria-hidden="true" />
                    {say(item, lang)}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={`${SECTION} bg-panel`} data-event-plan>
            <div className="mx-auto max-w-3xl">
              <h2 className={H2}>{say(copy.plan.heading, lang)}</h2>
              <ol className="relative mt-8 space-y-6 border-l-2 border-line-strong pl-7">
                {copy.plan.steps.map((step, i) => (
                  <li key={step.title.en} className="relative">
                    <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-teal text-[14px] font-extrabold text-white">{i + 1}</span>
                    <p className="text-[18px] font-extrabold">{say(step.title, lang)}</p>
                    <p className="mt-1 text-[15.5px] leading-relaxed text-ink-dim">{say(step.line, lang)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="price" className={`scroll-mt-20 ${SECTION} band-blue`} data-event-price>
            <div className="mx-auto max-w-lg rounded-sm border-[3px] border-gold bg-panel p-6 text-center shadow-[0_18px_40px_-18px_rgba(19,32,59,0.35)] sm:p-8">
              <h2 className="text-[22px] font-extrabold leading-snug sm:text-[26px]">{say(copy.price.title, lang)}</h2>
              <p className="mt-4 text-[52px] font-extrabold leading-none tracking-tight">{copy.price.amount}</p>
              <p className="mt-1.5 text-[14px] text-ink-dim">{say(copy.price.sub, lang)}</p>
              <ul className="mx-auto mt-5 flex max-w-sm flex-wrap justify-center gap-2 text-[14px]">
                {copy.price.included.map((item) => (
                  <li key={item.en} className="rounded-full border border-teal/40 bg-teal-soft px-3 py-1">{say(item, lang)}</li>
                ))}
              </ul>
              <BookButton copy={copy} lang={lang} className="mt-6 w-full" />
              <div className="mt-3"><AskLink copy={copy} lang={lang} /></div>
              <p className="mt-4 rounded-sm border border-line-strong bg-void px-4 py-3 text-[14px] leading-relaxed text-ink">{say(copy.price.note, lang)}</p>
            </div>
          </section>

          <HomeMeetKapil />

          <section className={SECTION} data-event-faq>
            <div className="mx-auto max-w-3xl">
              <h2 className={H2}>{say(copy.faqHeading, lang)}</h2>
              <div className="mt-6 divide-y divide-line border-y border-line">
                {copy.faq.map((item) => (
                  <details key={item.q.en} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                      {say(item.q, lang)}
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line-strong text-[13px] text-ink-faint transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-ink-dim">{say(item.a, lang)}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="hero-vivid px-4 py-16 text-center text-white sm:px-8 sm:py-20" data-event-final>
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-[28px] font-extrabold leading-tight sm:text-[38px]">{say(copy.finalHeading, lang)}</h2>
              <BookButton copy={copy} lang={lang} />
            </div>
          </section>
          {copy.disclaimer !== undefined && (
            <div className="px-4 py-6 sm:px-8">
              <p className="mx-auto max-w-content text-center text-[12.5px] leading-relaxed text-ink-dim">{say(copy.disclaimer, lang)}</p>
            </div>
          )}
        </main>
        <Footer />
        <WhatsAppWidget />
      </div>
    </LanguageOverride>
  );
}
