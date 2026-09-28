"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { programs, trainer } from "@/config/site.config";
import { corporateCopy, CORPORATE_WHATSAPP_LINK } from "@/lib/corporateCopy";
import { trackGaEvent } from "@/lib/analytics/ga4";
import SimplePageNav from "../SimplePageNav";
import Footer from "../Footer";
import WhatsAppWidget from "../WhatsAppWidget";
import TrainerBio from "../TrainerBio";
import { Eyebrow } from "../ui";
import OrganisationsWorkedWith from "../site/OrganisationsWorkedWith";
import { CorporateEnquiryForm } from "./CorporateEnquiryForm";

// /corporate — companies, schools and institutions (site-rebuild Phase 6).
// Hero → company formats → schools (#schools) → what you get → trainer →
// organisations (from site.config) → FAQ → enquiry form (#enquiry).

const sectionClass = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";

function CardGrid({ items, cols }: { items: { title: string; desc: string }[]; cols: string }): React.JSX.Element {
  return (
    <div className={`mt-8 grid grid-cols-1 gap-4 ${cols}`}>
      {items.map((item) => (
        <article key={item.title} className="rounded-sm border border-line-strong bg-panel2 p-6">
          <h3 className="text-[17px] font-bold leading-snug text-ink">{item.title}</h3>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-dim">{item.desc}</p>
        </article>
      ))}
    </div>
  );
}

export default function CorporatePageContent(): React.JSX.Element {
  const { lang } = useLanguage();
  const c = corporateCopy[lang];

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SimplePageNav />
      <main>
        <section className="border-b border-line px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
          <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <Eyebrow color="text-teal">{c.hero.eyebrow}</Eyebrow>
              <h1 className="mt-4 text-[28px] font-extrabold leading-[1.15] tracking-tight sm:text-[38px] lg:text-[42px]">{c.hero.h1}</h1>
              <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink-dim">{c.hero.sub}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-sm bg-teal px-7 py-[15px] text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-teal-light"
                >
                  {c.hero.ctaPrimary} ↓
                </a>
                <a
                  href={CORPORATE_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackGaEvent("whatsapp_click", { location: "corporate_hero" })}
                  className="inline-flex items-center justify-center rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink transition-colors hover:bg-panel2"
                >
                  {c.hero.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[480px]">
              <div className="relative aspect-[1374/1145] w-full overflow-hidden rounded-sm border border-line-strong bg-panel2">
                <Image src={trainer.photo.src} alt={trainer.photo.alt} fill priority sizes="(min-width: 1024px) 480px, 92vw" className="object-cover object-top" />
              </div>
            </div>
          </div>
        </section>

        <section id="companies" className={`${sectionClass} bg-panel`}>
          <div className="mx-auto max-w-content">
            <Eyebrow color="text-teal">{c.companies.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.companies.title}</h2>
            <CardGrid items={c.companies.items} cols="md:grid-cols-3" />
            <Link href={programs.executiveWorkshop.url} className="mt-6 inline-flex text-[14.5px] font-semibold text-gold hover:underline">
              {c.companies.executiveLink}
            </Link>
          </div>
        </section>

        <section id="schools" className={`${sectionClass} scroll-mt-20`}>
          <div className="mx-auto max-w-content">
            <Eyebrow color="text-gold">{c.schools.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.schools.title}</h2>
            <CardGrid items={c.schools.items} cols="md:grid-cols-2" />
            <Link href={programs.sharpBrain.url} className="mt-6 inline-flex text-[14.5px] font-semibold text-gold hover:underline">
              {c.schools.sharpBrainLink}
            </Link>
          </div>
        </section>

        <section className={`${sectionClass} bg-panel`}>
          <div className="mx-auto max-w-content">
            <Eyebrow>{c.gets.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.gets.title}</h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {c.gets.items.map((item) => (
                <li key={item.title} className="flex items-start gap-3 rounded-sm border border-line bg-void p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal" aria-hidden="true" />
                  <div>
                    <p className="text-[15.5px] font-bold text-ink">{item.title}</p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TrainerBio variant="long" accent="teal" eyebrow={c.trainer.eyebrow} ctaLabel={lang === "hi" ? "पूरी कहानी पढ़ें" : "Read his full story"} ctaHref="/about" />

        <OrganisationsWorkedWith eyebrow={c.organisations.eyebrow} />

        <section id="faq" className={sectionClass}>
          <div className="mx-auto max-w-3xl">
            <Eyebrow>{c.faq.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.faq.title}</h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {c.faq.items.map((item) => (
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

        <section id="enquiry" className={`${sectionClass} scroll-mt-20 bg-panel`}>
          <div className="mx-auto max-w-4xl">
            <Eyebrow color="text-teal">{c.enquiry.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-[26px] font-extrabold leading-tight sm:text-[34px]">{c.enquiry.title}</h2>
            <p className="mt-3 text-[15.5px] text-ink-dim">{c.enquiry.sub}</p>
            <CorporateEnquiryForm
              key={lang}
              page="corporate"
              lang={lang}
              formatOptions={c.enquiry.formatOptions}
              whatsappIntro={c.enquiry.whatsappIntro}
              companyPlaceholder={c.enquiry.companyPlaceholder}
            />
            <a
              href={CORPORATE_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGaEvent("whatsapp_click", { location: "corporate_enquiry" })}
              className="mt-5 inline-flex text-[14.5px] font-semibold text-gold hover:underline"
            >
              {c.enquiry.whatsappCta}
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppWidget href={CORPORATE_WHATSAPP_LINK} analyticsLocation="corporate_widget" />
    </div>
  );
}
