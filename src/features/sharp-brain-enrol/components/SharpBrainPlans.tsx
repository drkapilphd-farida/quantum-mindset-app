"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { SHARP_BRAIN_PRICES, sharpBrainEnrolment } from "@/config/site.config";
import { enrolT, type EnrolKey } from "@/lib/app-i18n/enrol";
import { useUiLang } from "@/lib/app-i18n/client";
import type { PlanType } from "@/features/sharp-brain-plans/rules";
import { inr } from "../copy";
import { BatchCheckout, useNextBatch } from "./SharpBrainPricing";

// The app's two Sharp Brain plans side by side — same wording, features and
// prices as the website page. Live batch (₹8,999) first and recommended;
// Self-paced (₹2,999) next to it. Choosing one opens the same checkout
// (sign-in email + name → Razorpay); the server decides the amount.
// Must sit inside SharpBrainPricingProvider.

type Feature = { key: EnrolKey; included: boolean };

const LIVE_FEATURES: readonly Feature[] = [
  { key: "plans.live.f1", included: true },
  { key: "plans.live.f2", included: true },
  { key: "plans.f3", included: true },
  { key: "plans.f4", included: true },
];
const SELF_FEATURES: readonly Feature[] = [
  { key: "plans.self.f1", included: true },
  { key: "plans.f3", included: true },
  { key: "plans.f4", included: true },
  { key: "plans.self.noEeg", included: false },
];

function FeatureList({ features }: { features: readonly Feature[] }): React.JSX.Element {
  const t = enrolT(useUiLang());
  return (
    <ul className="mt-3 space-y-1.5">
      {features.map((f) => (
        <li key={f.key} className={`flex items-start gap-2 text-[13px] leading-snug ${f.included ? "text-foreground" : "text-muted-foreground"}`}>
          {f.included ? <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" /> : <X className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />}
          <span>{t(f.key)}</span>
        </li>
      ))}
    </ul>
  );
}

export function SharpBrainPlans({ location }: { location: string }): React.JSX.Element {
  const lang = useUiLang();
  const t = enrolT(lang);
  const next = useNextBatch();
  const [chosen, setChosen] = useState<PlanType | null>(null);
  const livePrice = inr(next?.amountInr ?? sharpBrainEnrolment.regularInr);
  const selfPrice = inr(SHARP_BRAIN_PRICES.selfPacedInr);

  if (chosen !== null) {
    const live = chosen === "live";
    return (
      <div className="w-full text-left" data-plan-checkout={chosen}>
        <button type="button" onClick={() => setChosen(null)} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
          {t("plans.other")}
        </button>
        <p className="mt-3 text-base font-bold text-foreground">
          {live ? t("plans.live.name") : t("plans.self.name")} · {live ? livePrice : selfPrice}
        </p>
        {!live && <p className="mt-1 text-xs text-muted-foreground">{t("plans.self.recordings")}</p>}
        <div className="mt-3">
          <BatchCheckout
            location={`${location}_${chosen}`}
            tone="app"
            hidePicker
            hideRegularPrice
            plan={chosen}
            buttonLabel={live ? t("plans.live.cta") : t("plans.self.cta")}
          />
        </div>
      </div>
    );
  }

  const card = "flex flex-col rounded-2xl border p-4 text-left";
  const cta = "mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors";
  return (
    <div className="w-full" data-sharp-brain-plans="true">
      <p className="mb-3 text-sm font-semibold text-foreground">{t("plans.title")}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <article className={`${card} border-2 border-emerald-500 bg-emerald-500/5`} data-plan-card="live">
          <span className="self-start rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white uppercase">{t("plans.recommended")}</span>
          <h3 className="mt-2 text-base font-bold text-foreground">{t("plans.live.name")}</h3>
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{t("plans.live.badge")}</p>
          <p className="mt-2 text-2xl font-extrabold text-foreground tabular-nums" data-plan-price="live">
            {livePrice} <span className="text-xs font-medium text-muted-foreground">· {t("plans.oneTime")}</span>
          </p>
          <FeatureList features={LIVE_FEATURES} />
          <p className="mt-2 text-xs text-muted-foreground">{t("plans.live.seats")}</p>
          <div className="mt-auto">
            <button type="button" onClick={() => setChosen("live")} className={`${cta} bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400`} data-plan-choose="live">
              {t("plans.live.cta")}
            </button>
          </div>
        </article>
        <article className={`${card} border-border bg-card`} data-plan-card="self_paced">
          <h3 className="text-base font-bold text-foreground">{t("plans.self.name")}</h3>
          <p className="text-xs text-muted-foreground">{t("plans.self.recordings")}</p>
          <p className="mt-2 text-2xl font-extrabold text-foreground tabular-nums" data-plan-price="self_paced">
            {selfPrice} <span className="text-xs font-medium text-muted-foreground">· {t("plans.oneTime")}</span>
          </p>
          <FeatureList features={SELF_FEATURES} />
          <p className="mt-2 text-xs text-muted-foreground">{t("plans.self.upgrade")}</p>
          <div className="mt-auto">
            <button type="button" onClick={() => setChosen("self_paced")} className={`${cta} border-2 border-foreground/70 text-foreground hover:bg-muted`} data-plan-choose="self_paced">
              {t("plans.self.cta")}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
