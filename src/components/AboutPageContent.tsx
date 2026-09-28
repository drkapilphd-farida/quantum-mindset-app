"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { trainer } from "@/config/site.config";
import { aboutCopy } from "@/lib/aboutCopy";
import SimplePageNav from "./SimplePageNav";
import Footer from "./Footer";
import WhatsAppWidget from "./WhatsAppWidget";
import TrainerBio from "./TrainerBio";
import AboutTestimonials from "./AboutTestimonials";
import HomePodcastFeature from "./HomePodcastFeature";
import HomeProof from "./home/HomeProof";
import OrganisationsWorkedWith from "./site/OrganisationsWorkedWith";
import SiteTodo from "./site/SiteTodo";
import { Eyebrow } from "./ui";

// /about — the main trust page (site-rebuild Phase 6): hero with the master
// photo → his story (longBio, numbers from site.config via TrainerBio) →
// Mind Ur Mind → organisations (site.config only) → three pillars →
// podcast → verified testimonials + labelled video reviews → CTAs.

const sectionClass = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";

function Ctas({ c }: { c: (typeof aboutCopy)["en"]["hero"] }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href={c.ctaPrimary.href}
        className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]"
      >
        {c.ctaPrimary.label}
      </Link>
      <Link
        href={c.ctaSecondary.href}
        className="inline-flex items-center justify-center rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
      >
        {c.ctaSecondary.label} →
      </Link>
    </div>
  );
}

export default function AboutPageContent(): React.JSX.Element {
  const { t, lang } = useLanguage();
  const c = aboutCopy[lang];
  const a = t.aboutPage;

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SimplePageNav />
      <main>
        <section className="border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
          <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <Eyebrow color="text-gold">{c.hero.eyebrow}</Eyebrow>
              <h1 className="mt-4 text-[30px] font-extrabold leading-[1.12] tracking-tight sm:text-[42px] lg:text-[46px]">{c.hero.h1}</h1>
              <p className="mt-5 font-mono text-[13px] uppercase tracking-[0.08em] text-gold">{c.hero.tagline}</p>
              <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-dim">{trainer[lang].shortBio}</p>
              <div className="mt-8">
                <Ctas c={c.hero} />
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[500px]">
              <div className="relative aspect-[1374/1145] w-full overflow-hidden rounded-sm border border-line-strong bg-panel2">
                <Image src={trainer.photo.src} alt={trainer.photo.alt} fill priority sizes="(min-width: 1024px) 500px, 92vw" className="object-cover object-top" />
              </div>
            </div>
          </div>
        </section>

        <TrainerBio variant="long" accent="gold" eyebrow={c.story.eyebrow} heading={c.story.heading} quote={a.guide.quote} showPhoto={false} />
        {trainer.doctorate === null && (
          <div className="mx-auto max-w-content px-4 pt-6 sm:px-8">
            <SiteTodo>doctorate wording (subject and university) is empty in site.config (trainer.doctorate) — hidden on production.</SiteTodo>
          </div>
        )}

        <section className={sectionClass}>
          <div className="mx-auto max-w-2xl">
            <Eyebrow>{c.company.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[32px]">{a.headline}</h2>
            <div className="mt-6 space-y-5">
              {a.body.map((paragraph) => (
                <p key={paragraph} className="text-[15.5px] leading-relaxed text-ink-dim">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-6">
              <SiteTodo>no real workshop photos in public assets (gallery entries have no src) — add photos to show them here.</SiteTodo>
            </div>
          </div>
        </section>

        <OrganisationsWorkedWith eyebrow={lang === "hi" ? "जिन संस्थाओं के साथ काम किया है" : "Organisations Dr. Kapil has worked with"} />

        <section id="pillars" className={`${sectionClass} bg-panel`}>
          <div className="mx-auto max-w-content">
            <Eyebrow color="text-gold">{c.pillars.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.pillars.title}</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {c.pillars.items.map((pillar) => (
                <article key={pillar.name} className="flex flex-col rounded-sm border border-line-strong bg-void p-6">
                  <h3 className="text-[20px] font-extrabold text-ink">{pillar.name}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{pillar.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {pillar.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-[14.5px] font-semibold text-gold hover:underline">
                          {link.label} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <HomePodcastFeature />
        <AboutTestimonials />
        <HomeProof />

        <section className={sectionClass}>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[26px] font-extrabold leading-tight sm:text-[32px]">{c.final.title}</h2>
            <div className="mt-8 flex justify-center">
              <Ctas c={c.hero} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
