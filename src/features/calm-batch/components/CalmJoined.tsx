import { calmMindBatch, PAGE_VIDEOS } from "@/config/site.config";
import { LanguageOverride } from "@/context/LanguageContext";
import SiteNav from "@/components/site/SiteNav";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { PageVideo } from "@/components/video/PageVideo";
import { WhatsAppGlyph } from "@/features/programs/components/WhatsAppGlyph";
import { formatBatchDate, type Lang } from "../batch";
import { CALM_COPY } from "../copy";
import { CalmPurchase } from "./CalmPurchase";

// /calm-mind-batch/joined (owner's brief): shown after a verified payment.
// The WhatsApp group and Zoom links appear only with a valid signed link
// (verified on the server); otherwise — or while the links are not set — the
// "details reach you on WhatsApp within 2 hours" line.

const say = (text: { en: string; hi: string }, lang: Lang): string => text[lang];

export function CalmJoinedPage({ lang, verifiedPaymentId }: { lang: Lang; verifiedPaymentId: string | null }): React.JSX.Element {
  const c = CALM_COPY.joined;
  const start = formatBatchDate(calmMindBatch.nextBatch.startDate, lang);
  const verified = verifiedPaymentId !== null;
  const whatsapp = verified ? calmMindBatch.whatsappGroupLink : undefined;
  const zoom = verified ? calmMindBatch.zoomLink : undefined;
  const linksReady = (whatsapp ?? "") !== "" && (zoom ?? "") !== "";
  const languageLink = lang === "hi" ? { label: "English", href: "/calm-mind-batch" } : { label: "हिंदी", href: "/calm-mind-batch?lang=hi" };
  return (
    <LanguageOverride lang={lang}>
      <div className="warm-light min-h-screen font-sans antialiased" lang={lang}>
        {verifiedPaymentId !== null && <CalmPurchase paymentId={verifiedPaymentId} />}
        <SiteNav languageLink={languageLink} />
        <main className="px-4 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto flex max-w-xl flex-col gap-6" data-calm-joined={verified ? "verified" : "unverified"}>
            <h1 className="text-[30px] font-extrabold leading-tight sm:text-[38px]">{say(c.title(start), lang)}</h1>
            {linksReady ? (
              <>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-sm bg-[#25D366] px-6 py-4 text-[18px] font-extrabold text-[#0b2e17] hover:bg-[#1fbe5a]" data-calm-join-whatsapp>
                  <WhatsAppGlyph />
                  {say(c.whatsapp, lang)}
                </a>
                <div className="rounded-sm border border-line-strong bg-panel p-5" data-calm-zoom>
                  <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-faint">{say(c.zoom, lang)}</p>
                  <a href={zoom} target="_blank" rel="noopener noreferrer" className="mt-1.5 block break-all text-[16px] font-semibold text-ink underline decoration-gold/60 underline-offset-4">
                    {zoom}
                  </a>
                </div>
              </>
            ) : (
              <p className="rounded-sm border border-gold/50 bg-gold-soft px-5 py-4 text-[17px] font-semibold leading-relaxed" data-calm-pending>
                {say(c.pending, lang)}
              </p>
            )}
            <a href="/calm-mind-batch/calendar.ics" download className="inline-flex min-h-12 items-center justify-center rounded-sm border-2 border-ink px-6 py-3 text-[15.5px] font-semibold text-ink hover:bg-panel2" data-calm-calendar>
              📅 {say(c.calendar, lang)}
            </a>
            <PageVideo video={PAGE_VIDEOS.welcome} lang={lang} tone="light" />
            <div>
              <h2 className="text-[20px] font-extrabold">{say(c.tipsHeading, lang)}</h2>
              <ul className="mt-3 space-y-2">
                {c.tips.map((tip) => (
                  <li key={tip.en} className="flex items-start gap-2.5 text-[16px] leading-relaxed">
                    <span className="font-bold text-gold" aria-hidden="true">✓</span>
                    {say(tip, lang)}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[12.5px] leading-relaxed text-ink-dim">{say(CALM_COPY.disclaimer, lang)}</p>
          </div>
        </main>
        <Footer />
        <WhatsAppWidget bottomClassName="bottom-6 sm:bottom-7" />
      </div>
    </LanguageOverride>
  );
}
