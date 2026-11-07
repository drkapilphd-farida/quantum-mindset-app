import { COMMON, GROUPS, say } from "../common";
import { bookingHref, getProgram, programHref } from "../programs";
import type { Program, ProgramLang } from "../types";
import { Faq } from "./Faq";
import { Tick } from "./HubPage";
import { HeroMedia, ShortsRow, VideoCard } from "./Media";
import { StickyBookBar } from "./StickyBookBar";

// Program page — built from design-program-page-telepathy.html (owner,
// Nov 2026): same sections, order, colours, sizes and spacing for all 15.
// A page with no review videos shows the photo in the hero, hides
// "Watch experiences ↓" and hides the whole reviews section.

const PHOTO = "/dr-kapil-real.jpg";
const wrap = "mx-auto w-full max-w-[1160px]";
const sectionPad = "px-4 py-14 sm:px-6 md:py-20";

export function ProgramPage({ program: p, lang }: { program: Program; lang: ProgramLang }): React.JSX.Element {
  const g = GROUPS[p.group];
  const hasVideos = p.videos.length > 0;
  const book = bookingHref(p.slug, lang);
  const experience = p.experienceSuffix === undefined ? say(COMMON.experience, lang) : `${say(COMMON.experience, lang)} · ${say(p.experienceSuffix, lang)}`;
  const hubHref = lang === "hi" ? "/personal-sessions?lang=hi" : "/personal-sessions";

  return (
    <>
      {/* HERO */}
      <section className="bg-[#0E1B2C] px-4 py-14 text-white sm:px-6 md:py-16">
        <div className={`${wrap} flex flex-wrap items-center gap-12`}>
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-[18px]">
            <nav aria-label="Breadcrumb" className="text-[14px]">
              <a href={hubHref} className="text-[#AEB8CA] hover:text-white">
                {say(COMMON.breadcrumbHub, lang)}
              </a>{" "}
              <span className="text-[#5B6B85]">/</span> <span className="text-[#D6DCE8]">{say(p.name, lang)}</span>
            </nav>
            <span className="self-start rounded-full px-3 py-[3px] text-[13px] font-extrabold" style={{ background: g.tagBg, color: g.tagFg }}>
              {say(g.label, lang)} · {say(COMMON.only1on1, lang)}
            </span>
            <h1 className="text-[34px] font-extrabold leading-[1.15] md:text-[50px]">{say(p.h1, lang)}</h1>
            <p className="text-[18px] text-[#D6DCE8] md:text-[20px]">{say(p.heroLine, lang)}</p>
            <div className="flex flex-wrap gap-3 pt-1.5">
              <a href={book} className="inline-flex min-h-12 items-center rounded-[10px] bg-[#F2A93B] px-7 py-3.5 text-[18px] font-extrabold text-[#0E1B2C] hover:bg-[#E39A2A]" data-hero-book>
                {say(COMMON.bookButton, lang)}
              </a>
              {hasVideos && (
                <a href="#reviews" className="inline-flex min-h-12 items-center rounded-[10px] border-[1.5px] border-[#5B6B85] px-6 py-3.5 text-[18px] font-semibold text-white" data-hero-watch>
                  {say(COMMON.watchButton, lang)}
                </a>
              )}
            </div>
            <p className="text-[15px] text-[#AEB8CA]">{experience}</p>
          </div>
          <div className="min-w-0 flex-[1_1_380px]">
            <HeroMedia
              videoId={p.videos[0]?.id ?? null}
              photoSrc={PHOTO}
              photoAlt={say(COMMON.photoAlt, lang)}
              playLabel={`${say(COMMON.playVideo, lang)}: ${p.videos[0] === undefined ? "" : say(p.videos[0].title, lang)}`}
            />
          </div>
        </div>
      </section>

      {/* USED FOR */}
      <section className={sectionPad}>
        <div className={`${wrap} flex flex-col gap-7`}>
          <h2 className="text-[28px] font-extrabold leading-[1.2] md:text-[40px]">{say(COMMON.usedForHeading, lang)}</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {p.usedFor.map((card) => (
              <div key={card.title.en} className="flex flex-col gap-2 rounded-[16px] border border-[#E3E6EC] bg-white p-6" style={{ borderTop: `5px solid ${g.border}` }}>
                <p className="text-[21px] font-extrabold">{say(card.title, lang)}</p>
                <p className="text-[#4A5568]">{say(card.text, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO + HOW */}
      <section className={`border-y border-[#E3E6EC] bg-white ${sectionPad}`}>
        <div className={`${wrap} flex flex-wrap gap-10`}>
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
            <h2 className="text-[26px] font-extrabold leading-[1.2] md:text-[34px]">{say(COMMON.whoHeading, lang)}</h2>
            {p.who.map((item) => (
              <p key={item.en} className="flex gap-2.5 text-[18px]">
                <Tick color="#1F3A8A" />
                {say(item, lang)}
              </p>
            ))}
          </div>
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
            <h2 className="text-[26px] font-extrabold leading-[1.2] md:text-[34px]">{say(p.howHeading === "works" ? COMMON.howWorks : COMMON.howTeaches, lang)}</h2>
            <div className="flex flex-col gap-3.5">
              {p.how.map((step, index) => (
                <div key={step.lead.en} className="flex gap-3.5">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#0E1B2C] font-extrabold text-[#F2A93B]">{index + 1}</span>
                  <p className="text-[18px]">
                    <strong>{say(step.lead, lang)}</strong> {say(step.rest, lang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="bg-[#0E1B2C] px-4 py-14 text-white sm:px-6 md:py-[72px]">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3.5 text-center">
          <p className="text-[24px] font-extrabold leading-[1.35] md:text-[32px]">{say(p.quote, lang)}</p>
          <p className="text-[18px] text-[#AEB8CA]">{say(COMMON.quoteBy, lang)}</p>
        </div>
      </section>

      {/* REVIEWS — hidden when the topic has no videos */}
      {hasVideos && (
        <section id="reviews" className={`scroll-mt-20 ${sectionPad}`}>
          <div className={`${wrap} flex flex-col gap-7`}>
            <h2 className="text-[28px] font-extrabold leading-[1.2] md:text-[40px]">{say(COMMON.reviewsHeading, lang)}</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
              {p.videos.map((v) => (
                <VideoCard key={v.id} id={v.id} title={say(v.title, lang)} playLabel={say(COMMON.playVideo, lang)} />
              ))}
            </div>
            <ShortsRow ids={p.shorts} playLabel={say(COMMON.playVideo, lang)} />
          </div>
        </section>
      )}

      {/* AMBER BOOKING BAND */}
      <section className="bg-[#F2A93B] px-4 py-14 sm:px-6">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-6`}>
          <div className="min-w-0 flex-[999_1_420px]">
            <p className="text-[26px] font-extrabold leading-[1.25] text-[#0E1B2C] md:text-[32px]">{say(COMMON.bandTitle, lang)}</p>
            <p className="mt-1 text-[18px] text-[#3A2A08]">{say(COMMON.bandLine, lang)}</p>
          </div>
          <a href={book} className="inline-flex min-h-12 items-center rounded-[10px] bg-[#0E1B2C] px-7 py-4 text-[18px] font-extrabold text-white" data-band-book>
            {say(COMMON.bandButton, lang)}
          </a>
        </div>
      </section>

      {/* FAQ + RELATED */}
      <section className={sectionPad}>
        <div className={`${wrap} flex flex-wrap gap-12`}>
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-3.5">
            <h2 className="mb-2 text-[26px] font-extrabold leading-[1.2] md:text-[34px]">{say(COMMON.faqHeading(p.faqTopic), lang)}</h2>
            <Faq items={p.faqs.map((f) => ({ q: say(f.q, lang), a: say(f.a, lang) }))} />
            {p.disclaimers.map((d) => (
              <p key={d} className="mt-2 text-[14px] text-[#4A5568]" data-disclaimer={d}>
                {say(COMMON.disclaimers[d], lang)}
              </p>
            ))}
          </div>
          <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3.5">
            <h2 className="mb-2 text-[26px] font-extrabold">{say(COMMON.relatedHeading, lang)}</h2>
            {p.related.map((slug) => {
              const r = getProgram(slug);
              const rg = GROUPS[r.group];
              return (
                <a
                  key={slug}
                  href={programHref(slug, lang)}
                  className="flex flex-col gap-1 rounded-[14px] border-[1.5px] border-[#E3E6EC] bg-white p-[18px] text-[#0E1B2C] no-underline transition-colors hover:border-[#0E1B2C]"
                  data-related={slug}
                >
                  <span className="self-start rounded-full px-2.5 py-0.5 text-[12px] font-extrabold" style={{ background: rg.tagBg, color: rg.tagFg }}>
                    {say(rg.label, lang)}
                  </span>
                  <span className="text-[19px] font-extrabold">{say(r.name, lang)}</span>
                  <span className="font-extrabold text-[#1F3A8A]">{say(COMMON.learnMore, lang)}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <StickyBookBar href={book} label={say(COMMON.sticky, lang)} />
    </>
  );
}
