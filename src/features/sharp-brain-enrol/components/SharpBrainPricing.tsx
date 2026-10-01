"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { waLink } from "@/config/site.config";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { trackInitiateCheckout } from "@/lib/analytics/conversions";
import { getSharpBrainPricing, startSharpBrainCheckout, type CheckoutResult } from "../actions";
import type { PricedBatch, PricingSnapshot } from "../server";
import { countdownParts, enrolCopy, inr, istDayMonth, istDeadline } from "../copy";

// Sharp Brain prices on the page. The server renders a first snapshot;
// on mount it is refreshed from the server, and the countdown runs on the
// server's clock (offset = server time − this device's time), so it shows
// the same remaining time on every device, whatever its own clock says.
// On preview builds `?now=<ISO date>` simulates another moment.

type PricingState = { snapshot: PricingSnapshot | null; offsetMs: number | null; simulateNow: string | undefined; offerId: string | undefined };

const PricingContext = createContext<PricingState | null>(null);

function readSimulateNow(): string | undefined {
  try {
    return new URLSearchParams(window.location.search).get("now") ?? undefined;
  } catch {
    return undefined;
  }
}

export function SharpBrainPricingProvider({
  initial,
  offerId,
  children,
}: {
  /** Server-rendered snapshot; null where there is none (in-app popup) — fetched on mount. */
  initial: PricingSnapshot | null;
  offerId?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, setState] = useState<PricingState>({ snapshot: initial, offsetMs: null, simulateNow: undefined, offerId });

  useEffect(() => {
    let cancelled = false;
    const simulateNow = readSimulateNow();
    void getSharpBrainPricing({ simulateNow, offerId }).then((snapshot) => {
      if (!cancelled) setState({ snapshot, offsetMs: snapshot.serverNowMs - Date.now(), simulateNow, offerId });
    });
    return () => {
      cancelled = true;
    };
  }, [offerId]);

  return <PricingContext.Provider value={state}>{children}</PricingContext.Provider>;
}

export function useSharpBrainPricing(): PricingState {
  const value = useContext(PricingContext);
  if (value === null) throw new Error("useSharpBrainPricing must be used within SharpBrainPricingProvider");
  return value;
}

/** The batch every headline price refers to: the next one still open. */
export function useNextBatch(): PricedBatch | null {
  return useSharpBrainPricing().snapshot?.batches[0] ?? null;
}

export function Countdown({ endsAtMs, className = "" }: { endsAtMs: number; className?: string }): React.JSX.Element | null {
  const { offsetMs } = useSharpBrainPricing();
  const { lang } = useLanguage();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  // Hidden until the server clock is known — never counts on the device clock alone.
  if (offsetMs === null) return null;
  void tick;
  const { d, h, m, s } = countdownParts(endsAtMs - (Date.now() + offsetMs));
  const u = enrolCopy[lang].units;
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    <span className={`font-mono tabular-nums ${className}`} data-countdown suppressHydrationWarning>
      {d > 0 && `${d}${u.d} `}
      {pad(h)}
      {u.h} {pad(m)}
      {u.m} {pad(s)}
      {u.s}
    </span>
  );
}

/** "Enrol now · ₹8,999" — the price of the next batch. */
export function useEnrolLabel(): string {
  const { lang } = useLanguage();
  const next = useNextBatch();
  return enrolCopy[lang].enrolNow(inr(next?.amountInr ?? 9999));
}

/**
 * The price line under a call to action: early-bird with the real
 * countdown, or the regular price with the next batch date.
 */
export function PriceLine({ className = "", tone = "light" }: { className?: string; tone?: "light" | "app" }): React.JSX.Element | null {
  const { lang } = useLanguage();
  const next = useNextBatch();
  if (next === null) return null;
  const c = enrolCopy[lang];
  const date = istDayMonth(next.startsAtMs, lang);
  const strike = tone === "app" ? "text-muted-foreground" : "text-ink-faint";
  const strong = tone === "app" ? "text-foreground" : "text-ink";
  const accent = tone === "app" ? "text-emerald-600 dark:text-emerald-400" : "text-gold";

  if (next.offer === "regular" || next.endsAtMs === null) {
    return (
      <p className={`text-[14px] ${strike} ${className}`} data-price-state="regular">
        <span className={`font-semibold ${strong}`}>{inr(next.amountInr)}</span> · {c.oneTime} · {c.regularLine(date)}
      </p>
    );
  }
  return (
    <div className={`text-[14px] leading-relaxed ${className}`} data-price-state={next.offer}>
      <p className={strong}>
        <span className={`font-semibold ${accent}`}>{next.offer === "test1000" ? c.offerTag : c.earlyBirdFor(date)}:</span>{" "}
        <s className={strike}>{inr(next.regularInr)}</s> <span className="font-bold">{inr(next.amountInr)}</span>
      </p>
      <p className={strike}>
        {c.endsIn} <Countdown endsAtMs={next.endsAtMs} className={`font-semibold ${strong}`} />
        <span className="ml-1">({c.endsOn(istDeadline(next.endsAtMs, lang))})</span>
      </p>
    </div>
  );
}

/**
 * Batch picker + pay button. The server re-checks the batch and decides the
 * price, then returns a Razorpay link for this checkout.
 */
export function BatchCheckout({
  location,
  tone = "light",
  showPerDay = false,
}: {
  location: string;
  tone?: "light" | "app";
  showPerDay?: boolean;
}): React.JSX.Element {
  const { lang } = useLanguage();
  const { snapshot, simulateNow, offerId } = useSharpBrainPricing();
  const c = enrolCopy[lang];
  const [chosen, setChosen] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  // Prefill with the signed-in learner's email once the server has said who they are.
  const viewerEmail = snapshot?.viewerEmail ?? null;
  useEffect(() => {
    if (viewerEmail !== null) setEmail((current) => (current === "" ? viewerEmail : current));
  }, [viewerEmail]);
  const [error, setError] = useState<Exclude<CheckoutResult, { ok: true }>["reason"] | null>(null);
  const batches = snapshot?.batches ?? [];
  const batch = batches.find((b) => b.start === chosen) ?? batches[0] ?? null;

  if (snapshot === null || batch === null) return <div className="h-[168px]" aria-busy="true" />;
  const date = istDayMonth(batch.startsAtMs, lang);

  async function pay(selected: PricedBatch): Promise<void> {
    setPending(true);
    setError(null);
    trackInitiateCheckout("Sharp Brain 30-Day Program");
    trackGaEvent("razorpay_checkout_click", { location, offer: selected.offer, batch: selected.start });
    const result = await startSharpBrainCheckout({ batch: selected.start, email, name, offerId, simulateNow });
    if (result.ok) {
      window.location.assign(result.url);
      return;
    }
    setPending(false);
    setError(result.reason);
  }

  const app = tone === "app";
  const optionBase = app ? "rounded-xl border px-4 py-3 text-left text-sm transition-colors" : "rounded-sm border px-4 py-3 text-left text-[14.5px] transition-colors";
  const optionOn = app ? "border-emerald-500 bg-emerald-500/10 text-foreground" : "border-gold bg-gold-soft text-ink";
  const optionOff = app ? "border-border text-foreground hover:border-emerald-500/60" : "border-line-strong text-ink hover:border-gold/60";
  const faint = app ? "text-muted-foreground" : "text-ink-faint";
  const input = app
    ? "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
    : "w-full rounded-sm border border-line-strong bg-void px-4 py-3 text-[15px] text-ink";
  const button = app
    ? "inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-60"
    : "inline-flex w-full items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44] disabled:opacity-60 sm:w-auto";

  return (
    <div data-batch-checkout>
      <p className={`font-mono text-[11.5px] uppercase tracking-[0.08em] ${faint}`}>{c.chooseBatch}</p>
      <div role="radiogroup" aria-label={c.chooseBatch} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {batches.map((option) => {
          const on = option.start === batch.start;
          return (
            <button
              key={option.start}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setChosen(option.start)}
              className={`${optionBase} ${on ? optionOn : optionOff}`}
            >
              <span className="block font-semibold">{c.batchOption(istDayMonth(option.startsAtMs, lang))}</span>
              <span className={`mt-0.5 block text-[13px] ${faint}`}>
                {option.offer !== "regular" && <s className="mr-1.5">{inr(option.regularInr)}</s>}
                <span className="font-semibold">{inr(option.amountInr)}</span>
                {option.offer === "earlybird" && ` · ${c.earlyBirdTag}`}
                {option.offer === "test1000" && ` · ${c.offerTag}`}
              </span>
            </button>
          );
        })}
      </div>
      {snapshot.seatsPerBatch !== null && <p className={`mt-2 text-[12.5px] ${faint}`}>{c.seatsLeft(snapshot.seatsPerBatch)}</p>}
      <form
        className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void pay(batch);
        }}
        id={`enrol-form-${location}`}
      >
        <label className="block">
          <span className={`text-[12.5px] font-semibold ${faint}`}>{c.emailLabel}</span>
          <input
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${input} mt-1`}
            data-enrol-email
          />
        </label>
        <label className="block">
          <span className={`text-[12.5px] font-semibold ${faint}`}>{c.nameLabel}</span>
          <input
            type="text"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={`${input} mt-1`}
            data-enrol-name
          />
        </label>
        <p className={`text-[12px] sm:col-span-2 ${faint}`}>{c.emailHint}</p>
      </form>
      <button type="submit" form={`enrol-form-${location}`} disabled={pending} className={`${button} mt-4`} data-enrol-button>
        {pending ? c.redirecting : c.enrolNow(inr(batch.amountInr))}
      </button>
      <p className={`mt-2 text-[12.5px] ${faint}`}>
        {c.oneTime}
        {showPerDay && ` · ${c.perDay(inr(Math.round(batch.amountInr / 30)))}`} · {c.secure}
      </p>
      {error !== null && (
        <p role="alert" className="mt-3 text-[13.5px] text-red-700">
          {c.errors[error]}{" "}
          <a href={waLink(c.whatsappEnrol(date, inr(batch.amountInr)))} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            {c.chatOnWhatsapp} →
          </a>
        </p>
      )}
    </div>
  );
}
