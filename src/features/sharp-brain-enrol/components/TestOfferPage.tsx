"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { sharpBrainEnrolment } from "@/config/site.config";
import { Eyebrow } from "@/components/ui";
import GuaranteeBadge from "@/components/sharp-brain/GuaranteeBadge";
import type { PricingSnapshot } from "../server";
import { inr } from "../copy";
import { BatchCheckout, Countdown, PriceLine, SharpBrainPricingProvider, useNextBatch } from "./SharpBrainPricing";

const copy = {
  en: {
    eyebrow: "Your Reading Speed Test offer",
    title: (discount: string) => `${discount} off the Sharp Brain 30-Day Program`,
    unlocked: (price: string, regular: string) => `${price} instead of ${regular}. Choose your batch and enrol.`,
    valid: "Valid for:",
    expiredTitle: "This offer has ended",
    expired: "Your test offer was valid for 48 hours. You can still enrol at the current price:",
    program: "See what’s in the program →",
  },
  hi: {
    eyebrow: "आपका Reading Speed Test ऑफ़र",
    title: (discount: string) => `Sharp Brain 30-दिवसीय प्रोग्राम पर ${discount} की छूट`,
    unlocked: (price: string, regular: string) => `${regular} की जगह ${price}। अपना बैच चुनें और जुड़ें।`,
    valid: "बचा समय:",
    expiredTitle: "यह ऑफ़र ख़त्म हो चुका है",
    expired: "आपका टेस्ट ऑफ़र 48 घंटे के लिए था। आप अब भी मौजूदा कीमत पर जुड़ सकते हैं:",
    program: "प्रोग्राम में क्या है, देखें →",
  },
} as const;

export default function TestOfferPage({
  offer,
  initial,
}: {
  offer: { id: string; expiresAtMs: number } | null;
  initial: PricingSnapshot;
}): React.JSX.Element {
  const { lang } = useLanguage();
  const c = copy[lang];
  return (
    <section className="border-b border-line px-4 py-12 sm:px-8 sm:py-20" data-offer-state={offer === null ? "expired" : "active"}>
      <div className="mx-auto w-full max-w-2xl rounded-sm border border-line-strong bg-panel2 p-5 sm:p-10">
        <SharpBrainPricingProvider initial={initial} {...(offer !== null ? { offerId: offer.id } : {})}>
          <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
          {offer !== null ? (
            <>
              <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-ink sm:text-[34px]">{c.title(inr(sharpBrainEnrolment.testOffer.discountInr))}</h1>
              <OfferPrice text={c.unlocked} />
              <p className="mt-2 text-[15px] text-ink-dim">
                {c.valid} <Countdown endsAtMs={offer.expiresAtMs} className="font-semibold text-ink" />
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-ink sm:text-[34px]">{c.expiredTitle}</h1>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-dim">{c.expired}</p>
              <PriceLine className="mt-3" />
            </>
          )}
          <div className="mt-7">
            <BatchCheckout location={offer !== null ? "offer_page" : "offer_page_expired"} showPerDay />
          </div>
        </SharpBrainPricingProvider>
        <Link href="/programs/sharp-brain" className="mt-6 inline-block text-[14px] font-semibold text-gold hover:underline">
          {c.program}
        </Link>
        <GuaranteeBadge className="mt-6" />
      </div>
    </section>
  );
}

function OfferPrice({ text }: { text: (price: string, regular: string) => string }): React.JSX.Element {
  const next = useNextBatch();
  return <p className="mt-3 text-[17px] leading-relaxed text-ink">{text(inr(next?.amountInr ?? sharpBrainEnrolment.floorInr), inr(next?.regularInr ?? sharpBrainEnrolment.regularInr))}</p>;
}
