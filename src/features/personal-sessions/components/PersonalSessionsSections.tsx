import Image from "next/image";
import { personalSessionsCopy } from "../personalSessionsCopy";
import { SessionEnquiryForm } from "./SessionEnquiryForm";

// /personal-sessions sections, in page order. Same look as /partner: the
// site's own tokens, dark (.warm-dark) hero and enquiry form.

const wrap = "mx-auto max-w-content";
const section = "border-b border-line px-4 py-16 sm:px-8 sm:py-20";
const h2 = "text-[28px] font-extrabold leading-tight sm:text-[36px]";

export function SessionsHero(): React.JSX.Element {
  const c = personalSessionsCopy.hero;
  return (
    <section id="top" className="warm-dark px-4 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
      <div className={`${wrap} grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12`}>
        <div className="flex min-w-0 flex-col gap-5">
          <p className="text-[13px] font-semibold tracking-[0.06em] text-gold sm:text-[14px]">{c.eyebrow}</p>
          <h1 className="text-[32px] font-extrabold leading-[1.15] sm:text-[44px]">{c.h1}</h1>
          <p className="text-[18px] leading-relaxed text-ink-dim sm:text-[20px]">{c.sub}</p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <a href="#enquire" className="inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-7 py-3.5 text-[17px] font-extrabold text-[#1B1508] transition-transform hover:-translate-y-0.5" data-hero-enquire>
              {c.enquire}
            </a>
            <a href="#areas" className="inline-flex min-h-11 items-center justify-center rounded-md border border-line-strong px-6 py-3.5 text-[17px] font-semibold text-ink transition-colors hover:bg-panel2">
              {c.areas}
            </a>
          </div>
          <p className="text-[15px] font-semibold text-ink" data-clarity-price>
            {c.price}
          </p>
        </div>
        <div className="relative mx-auto aspect-[1374/1145] w-full max-w-[480px] overflow-hidden rounded-lg border border-line-strong bg-panel2">
          <Image src="/dr-kapil-real.jpg" alt={c.photoAlt} fill priority sizes="(min-width: 1024px) 480px, 92vw" className="object-cover object-top" />
        </div>
      </div>
    </section>
  );
}

export function SessionsGroups(): React.JSX.Element {
  const c = personalSessionsCopy.groups;
  return (
    <section id="areas" className={`scroll-mt-20 ${section}`}>
      <div className={`${wrap} flex flex-col gap-8`}>
        <div>
          <h2 className={h2}>{c.title}</h2>
          <p className="mt-2 text-[17px] text-ink-dim sm:text-[18px]">{c.sub}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {c.items.map((group) => (
            <article key={group.id} className="flex flex-col gap-4 rounded-lg border border-line bg-panel p-6 sm:p-7" data-session-group={group.id}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[22px] font-extrabold">{group.title}</h3>
                  {group.badge !== null && <span className="rounded-full bg-gold px-3 py-0.5 text-[13px] font-extrabold text-[#1B1508]">{group.badge}</span>}
                </div>
                <p className="mt-1 text-[16px] text-ink-dim">{group.line}</p>
              </div>
              <ul className="flex flex-col gap-3.5 border-t border-line pt-4">
                {group.topics.map((topic) => (
                  <li key={topic.name}>
                    <p className="text-[17px] font-bold">{topic.name}</p>
                    <p className="text-[15.5px] leading-relaxed text-ink-dim">{topic.text}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SessionsProcess(): React.JSX.Element {
  const c = personalSessionsCopy.process;
  return (
    <section className={`${section} bg-panel`}>
      <div className={`${wrap} flex flex-col gap-8`}>
        <h2 className={h2}>{c.title}</h2>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {c.steps.map((step, index) => (
            <li key={step.title} className="rounded-lg border border-line bg-void p-6">
              <span className="font-mono text-[13px] font-semibold text-gold">0{index + 1}</span>
              <h3 className="mt-1 text-[20px] font-extrabold">{step.title}</h3>
              <p className="mt-1.5 text-[16px] leading-relaxed text-ink-dim">{step.text}</p>
            </li>
          ))}
        </ol>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {c.formats.map((format) => (
            <li key={format.days} className="rounded-md border border-line-strong px-5 py-4">
              <p className="text-[20px] font-extrabold">
                {format.days} <span className="ml-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-gold">{format.tag}</span>
              </p>
              <p className="text-[15.5px] text-ink-dim">{format.text}</p>
            </li>
          ))}
        </ul>
        <p className="rounded-md border border-gold/50 bg-gold-soft px-5 py-4 text-[16px] font-semibold text-ink">{c.feeNote}</p>
      </div>
    </section>
  );
}

export function SessionsAbout(): React.JSX.Element {
  const c = personalSessionsCopy.about;
  return (
    <section className={section}>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <p className="text-[15px] font-semibold text-gold">{c.eyebrow}</p>
        <h2 className={h2}>{c.name}</h2>
        <p className="text-[18px] leading-relaxed">{c.text}</p>
      </div>
    </section>
  );
}

export function SessionsEnquiry(): React.JSX.Element {
  const c = personalSessionsCopy.enquiry;
  return (
    <section id="enquire" className="warm-dark scroll-mt-20 px-4 py-16 sm:px-8 sm:py-20">
      <div className="relative mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <h2 className={h2}>{c.title}</h2>
          <p className="mt-2 text-[17px] text-ink-dim sm:text-[18px]">{c.sub}</p>
        </div>
        <SessionEnquiryForm />
        <p className="text-[13px] leading-relaxed text-ink-dim" data-coaching-note>
          {personalSessionsCopy.note}
        </p>
      </div>
    </section>
  );
}

export function SessionsFaq(): React.JSX.Element {
  const c = personalSessionsCopy.faq;
  return (
    <section id="faq" className={section}>
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <h2 className={`${h2} mb-3`}>{c.title}</h2>
        {c.items.map((item) => (
          <details key={item.question} className="group rounded-lg border border-line bg-panel">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[18px] font-extrabold marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
              <span className="flex-none text-[22px] text-gold transition-transform group-open:rotate-45" aria-hidden="true">
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
