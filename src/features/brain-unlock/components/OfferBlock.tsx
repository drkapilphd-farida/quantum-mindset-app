"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import VideoReviewGrid from "@/components/VideoReviewGrid";
import {
  qsrGuarantee,
  SHARP_BRAIN_PRICES,
  SITE_CONFIG_WHATSAPP_NUMBER,
  waLink,
} from "@/config/site.config";
import { buildWhatsAppLink } from "@/lib/analytics/utm";
import { SHARP_BRAIN_VIDEO_REVIEWS } from "@/config/sharpBrainVideoReviews";
import { reviewFrameSrc } from "@/lib/video/reviewFrames";
import { trackWhatsAppContact } from "@/lib/analytics/conversions";
import { BatchCheckout } from "@/features/sharp-brain-enrol/components/SharpBrainPricing";
import type { BuCopy } from "../copy";
import { reportChatText, type ReportFacts } from "../messages";
import type { BuSettings } from "../settings";
import { trackBu, type TrackContext } from "../tracking";
import { primaryBtn, secondaryBtn } from "./ui";

// The offer, on the SAME page right after the report: real reviews (privacy-
// enhanced embeds, IDs from admin), the real-numbers strip, both plans side
// by side with the existing Sharp Brain checkout (UTM kept), the next batch
// (real values only, hidden when empty), WhatsApp with the user's own numbers,
// and a short FAQ. Must sit inside SharpBrainPricingProvider.

const inr = (n: number): string => `₹${n.toLocaleString("en-IN")}`;

function reviewCard(
  id: string,
  lang: "en" | "hi",
): {
  videoId: string;
  thumbnailSrc: string;
  frameShape: "S";
  caption?: string;
} {
  const known = SHARP_BRAIN_VIDEO_REVIEWS.find((v) => v.videoId === id);
  return {
    videoId: id,
    thumbnailSrc: reviewFrameSrc(id, known?.thumbFrame),
    frameShape: "S",
    ...(known !== undefined ? { caption: known.caption[lang] } : {}),
  };
}

export function OfferBlock({
  c,
  lang,
  settings,
  facts,
  track,
  initialPlan,
}: {
  c: BuCopy;
  lang: "en" | "hi";
  settings: BuSettings;
  facts: ReportFacts | null;
  track: TrackContext;
  initialPlan: "self" | "live" | null;
}): React.JSX.Element {
  const [chosen, setChosen] = useState<"self" | "live" | null>(initialPlan);
  const reviews = [
    settings.reviewVideoIds.parent,
    settings.reviewVideoIds.student,
  ]
    .filter((id) => id !== "")
    .map((id) => reviewCard(id, lang));
  const batchDate =
    settings.nextBatch.date === ""
      ? null
      : new Date(
          `${settings.nextBatch.date}T00:00:00+05:30`,
        ).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
          day: "numeric",
          month: "long",
          timeZone: "Asia/Kolkata",
        });
  const chatText =
    facts !== null
      ? reportChatText(facts, settings, lang)
      : lang === "hi"
        ? "नमस्ते Dr. Kapil, मुझे Sharp Brain के बारे में जानना है।"
        : "Hi Dr. Kapil, I want to know about Sharp Brain.";
  const choose = (plan: "self" | "live"): void => {
    setChosen(plan);
    trackBu("plan_clicked", track, { plan });
  };

  const planCard = (plan: "self" | "live"): React.JSX.Element => {
    const live = plan === "live";
    return (
      <article
        className={`flex flex-col rounded-3xl border-2 p-5 ${live ? "border-[#16a34a] bg-[#16a34a]/5" : "border-border bg-card"}`}
        data-bu-plan={plan}
      >
        {live && (
          <span className="self-start rounded-full bg-[#15803d] px-3 py-1 text-xs font-bold text-white uppercase">
            {c.offer.recommended}
          </span>
        )}
        <h3 className="mt-2 text-xl text-foreground">
          {live ? c.offer.liveName : c.offer.selfName}
        </h3>
        <p className="text-sm text-muted-foreground">
          {live ? c.offer.liveSub : c.offer.selfSub}
        </p>
        <p className="mt-3 font-heading text-[2rem] leading-none text-foreground tabular-nums">
          {inr(
            live ? SHARP_BRAIN_PRICES.liveInr : SHARP_BRAIN_PRICES.selfPacedInr,
          )}{" "}
          <span className="text-sm font-medium text-muted-foreground">
            · {c.offer.oneTime}
          </span>
        </p>
        {live && batchDate !== null && (
          <p
            className="mt-2 text-sm font-semibold text-foreground"
            data-bu-batch
          >
            {c.offer.batch(batchDate, settings.nextBatch.seatsLeft)}
          </p>
        )}
        <div className="mt-4">
          {chosen === plan ? (
            <BatchCheckout
              location={`brain_unlock_${plan}`}
              tone="app"
              hidePicker
              hideRegularPrice
              plan={live ? "live" : "self_paced"}
              buttonLabel={live ? c.offer.liveCta : c.offer.selfCta}
            />
          ) : (
            <button
              type="button"
              className={live ? primaryBtn : secondaryBtn}
              onClick={() => choose(plan)}
              data-bu-choose={plan}
            >
              {live ? c.offer.liveCta : c.offer.selfCta}
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <section
      id="plans"
      className="flex scroll-mt-20 flex-col gap-6 border-t-2 border-border pt-6"
      data-bu-offer
    >
      {reviews.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl text-foreground">{c.offer.reviewsTitle}</h2>
          <VideoReviewGrid
            videos={reviews}
            aspectRatioClassName="aspect-[9/16]"
            gridClassName="grid grid-cols-2 gap-3"
          />
        </div>
      )}

      {settings.numbersStrip.length > 0 && (
        <div className="play-card flex flex-col gap-2 p-4" data-bu-strip>
          <p className="text-sm font-semibold text-muted-foreground">
            {c.offer.stripTitle}
          </p>
          <ul className="flex flex-wrap gap-2">
            {settings.numbersStrip.map((n) => (
              <li
                key={n}
                className="rounded-full bg-[#c2410c] px-3 py-1 text-sm font-bold text-white tabular-nums"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl text-foreground">{c.offer.plansTitle}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {planCard("self")}
          {planCard("live")}
        </div>
        <p className="text-sm text-muted-foreground" data-bu-guarantee>
          {qsrGuarantee[lang].short}{" "}
          <Link
            href="/programs/sharp-brain#guarantee"
            className="font-semibold text-foreground underline underline-offset-2"
          >
            {c.offer.guaranteeLink}
          </Link>
        </p>
      </div>

      <a
        href={waLink(chatText)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          // The visit's UTM tags go into the message (read at tap time, never during render).
          e.preventDefault();
          trackWhatsAppContact("Brain Unlock");
          window.open(
            buildWhatsAppLink(SITE_CONFIG_WHATSAPP_NUMBER, chatText),
            "_blank",
            "noopener,noreferrer",
          );
        }}
        className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#0b7a3e] px-5 text-lg font-bold text-white"
        data-bu-whatsapp
        data-contact-tracked
      >
        {c.offer.whatsapp}
      </a>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl text-foreground">{c.offer.faqTitle}</h2>
        {c.offer.faq.map((f) => (
          <details key={f.q} className="play-card group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-base font-bold text-foreground">
              {f.q}
              <span
                className="text-muted-foreground transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-2 flex gap-2 text-base text-foreground">
              <Check
                className="mt-1 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
