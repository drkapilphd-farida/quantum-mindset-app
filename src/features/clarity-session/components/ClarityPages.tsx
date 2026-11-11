import { CLARITY_BOOKING, CLARITY_SESSION, PAGE_VIDEOS } from "@/config/site.config";
import { PageVideo } from "@/components/video/PageVideo";
import { waLink } from "@/data/links";
import SiteTodo from "@/components/site/SiteTodo";
import { hasPaymentLinksApi } from "@/lib/razorpay/paymentLinksApi";
import { ASK_WHATSAPP, CAPACITY_LINE, CLARITY_CARD, COMMON, REFUND_LINE, say } from "@/features/programs/common";
import { ProgramsShell } from "@/features/programs/components/ProgramsShell";
import { WhatsAppGlyph } from "@/features/programs/components/WhatsAppGlyph";
import type { ProgramLang } from "@/features/programs/types";
import { BOOKED_PAGE, BOOKED_WHATSAPP_MESSAGE, CLARITY_PAGE } from "../copy";
import { ClarityPayButton, type PayMode } from "./ClarityPayButton";
import { PurchaseTracker } from "./PurchaseTracker";

// /clarity-session and /clarity-session/booked (owner's conversion brief, Nov 2026).


function payMode(): PayMode {
  // Razorpay Checkout needs both keys (the same RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET as Sharp Brain).
  if (hasPaymentLinksApi()) return { kind: "checkout" };
  if (CLARITY_BOOKING.paymentLink !== null) return { kind: "link", href: CLARITY_BOOKING.paymentLink };
  return { kind: "whatsapp" };
}

export function ClaritySessionPage({ lang }: { lang: ProgramLang }): React.JSX.Element {
  const mode = payMode();
  const self = lang === "hi" ? "/clarity-session?lang=hi" : "/clarity-session";
  return (
    <ProgramsShell lang={lang} path="/clarity-session" ctaHref={`${self}#pay`} ctaLabel={say(COMMON.bookButton, lang)} schemas={[]}>
      <section className="bg-[#0E1B2C] px-4 py-14 text-white sm:px-6 md:py-20" data-clarity-page>
        <div className="mx-auto grid w-full max-w-[1160px] grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <p className="text-[15px] font-semibold tracking-[0.06em] text-[#F2A93B]">{say(CLARITY_CARD.eyebrow, lang)}</p>
          <h1 className="text-[36px] font-extrabold leading-[1.15] md:text-[52px]">{say(CLARITY_CARD.title, lang)}</h1>
          {/* Owner (Nov 2026): the Clarity page video — under the headline on phones, beside it on desktop. */}
          <PageVideo video={PAGE_VIDEOS.clarity} lang={lang} priority className="lg:hidden" />
          <p className="text-[20px] leading-[1.5] text-[#D6DCE8] md:text-[22px]" data-clarity-recap>
            {say(CLARITY_PAGE.recap, lang)}
          </p>
          <div className="pt-2">
            <ClarityPayButton mode={mode} lang={lang} />
          </div>
          {mode.kind === "whatsapp" && <SiteTodo>Razorpay keys and [CLARITY_PAYMENT_LINK] are not set — until then this button opens WhatsApp.</SiteTodo>}
          <p className="rounded-[14px] border border-[#2C3D57] bg-[#16263D] px-5 py-4 text-[17px] text-[#D6DCE8]" data-refund-line>
            {say(REFUND_LINE, lang)}
          </p>
          <p className="text-[17px] font-semibold text-[#F2A93B]" data-capacity-line>
            {say(CAPACITY_LINE, lang)}
          </p>
          <p className="text-[15px] text-[#AEB8CA]">{say(COMMON.experience, lang)}</p>
        </div>
        <div className="hidden lg:block">
          <PageVideo video={PAGE_VIDEOS.clarity} lang={lang} priority />
        </div>
        </div>
      </section>
    </ProgramsShell>
  );
}

export function ClarityBookedPage({ lang }: { lang: ProgramLang }): React.JSX.Element {
  const cal = CLARITY_BOOKING.calcomEventLink;
  const back = lang === "hi" ? "/clarity-session?lang=hi" : "/clarity-session";
  return (
    <ProgramsShell lang={lang} path="/clarity-session/booked" ctaHref={back} ctaLabel={say(COMMON.bookButton, lang)} schemas={[]}>
      <PurchaseTracker />
      <section className="px-4 py-12 sm:px-6 md:py-16" data-booked-page>
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
          <h1 className="text-[32px] font-extrabold leading-[1.2] md:text-[44px]">{say(BOOKED_PAGE.title, lang)}</h1>
          {/* Owner (Nov 2026): the welcome video, above the Cal.com calendar. */}
          <PageVideo video={PAGE_VIDEOS.welcome} lang={lang} tone="light" priority />
          {cal !== null ? (
            <iframe
              src={`${cal}${cal.includes("?") ? "&" : "?"}embed=true&layout=month_view`}
              title={say(BOOKED_PAGE.calendarTitle, lang)}
              className="h-[780px] w-full rounded-[16px] border border-[#E3E6EC] bg-white"
              data-cal-embed
            />
          ) : (
            <div className="flex flex-col gap-3 rounded-[16px] border border-dashed border-[#C5CCD8] bg-white p-6" data-cal-missing>
              <SiteTodo>[CALCOM_EVENT_LINK] is not set — the Cal.com booking calendar appears here once it is.</SiteTodo>
              <a href={waLink(BOOKED_WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2.5 self-start rounded-[10px] bg-[#0E1B2C] px-6 py-3.5 text-[18px] font-extrabold text-white">
                <WhatsAppGlyph />
                {say(ASK_WHATSAPP.label, lang)}
              </a>
            </div>
          )}
          <p className="text-[17px] text-[#33415C]" data-booked-note>
            {say(BOOKED_PAGE.note, lang)}
          </p>
          <p className="text-[14px] text-[#4A5568]">
            {say(CLARITY_CARD.title, lang)} · ₹{CLARITY_SESSION.priceInr.toLocaleString("en-IN")} · {say(REFUND_LINE, lang)}
          </p>
        </div>
      </section>
    </ProgramsShell>
  );
}
