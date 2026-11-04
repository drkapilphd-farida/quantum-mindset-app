"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { waLink } from "@/config/site.config";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { trackInitiateCheckout } from "@/lib/analytics/conversions";
import { readUtmParams } from "@/lib/analytics/utm";
import { getSharpBrainPricing, startSharpBrainCheckout, type CheckoutResult } from "../actions";
import type { PricingSnapshot } from "../server";
import type { CurrentPrice } from "../offer";
import { classWhen, countdownParts, inr } from "../copy";
import { enrolT } from "@/lib/app-i18n/enrol";
import { useUiLang } from "@/lib/app-i18n/client";

// Sharp Brain price, seat counter and checkout. The server renders a first
// snapshot; on mount it is refreshed from the server (real seat count). On
// preview builds `?now=<ISO date>` simulates another moment and `?seats=<n>`
// another seat count; production ignores both.

type PricingState = { snapshot: PricingSnapshot | null; offsetMs: number | null; simulateNow: string | undefined; simulateSeats: string | undefined };

const PricingContext = createContext<PricingState | null>(null);

function readParam(name: string): string | undefined {
  try {
    return new URLSearchParams(window.location.search).get(name) ?? undefined;
  } catch {
    return undefined;
  }
}

export function SharpBrainPricingProvider({
  initial,
  children,
}: {
  /** Server-rendered snapshot; null where there is none (in-app popup) — fetched on mount. */
  initial: PricingSnapshot | null;
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, setState] = useState<PricingState>({ snapshot: initial, offsetMs: null, simulateNow: undefined, simulateSeats: undefined });

  useEffect(() => {
    let cancelled = false;
    const simulateNow = readParam("now");
    const simulateSeats = readParam("seats");
    void getSharpBrainPricing({ simulateNow, simulateSeats }).then((snapshot) => {
      if (!cancelled) setState({ snapshot, offsetMs: snapshot.serverNowMs - Date.now(), simulateNow, simulateSeats });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return <PricingContext.Provider value={state}>{children}</PricingContext.Provider>;
}

export function useSharpBrainPricing(): PricingState {
  const value = useContext(PricingContext);
  if (value === null) throw new Error("useSharpBrainPricing must be used within SharpBrainPricingProvider");
  return value;
}

/** What a seat costs right now (null until the server has answered, on pages without a first snapshot). */
export function useCurrentPrice(): CurrentPrice | null {
  return useSharpBrainPricing().snapshot?.price ?? null;
}

/** "Next live class: Mon, 9 Nov, 8 pm" — the next class of the Mon & Thu cycle. */
export function useNextClassLine(): string | null {
  const lang = useUiLang();
  const at = useSharpBrainPricing().snapshot?.nextClassAt ?? null;
  return at === null ? null : enrolT(lang)("nextClass", { when: classWhen(at, lang) });
}

export function Countdown({ endsAtMs, className = "" }: { endsAtMs: number; className?: string }): React.JSX.Element | null {
  const { offsetMs } = useSharpBrainPricing();
  const lang = useUiLang();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  // Hidden until the server clock is known — never counts on the device clock alone.
  if (offsetMs === null) return null;
  void tick;
  const { d, h, m, s } = countdownParts(endsAtMs - (Date.now() + offsetMs));
  const t = enrolT(lang);
  const u = { d: t("units.d"), h: t("units.h"), m: t("units.m"), s: t("units.s") };
  const pad = (n: number): string => String(n).padStart(2, "0");
  const unit = (n: string, label: string): string => (/^[a-z]$/i.test(label) ? `${n}${label}` : `${n} ${label}`);
  return (
    <span className={`font-mono tabular-nums ${className}`} data-countdown suppressHydrationWarning>
      {[...(d > 0 ? [unit(String(d), u.d)] : []), unit(pad(h), u.h), unit(pad(m), u.m), unit(pad(s), u.s)].join(" ")}
    </span>
  );
}

/** "Book a seat — ₹2,999" — the current price. */
export function useEnrolLabel(): string {
  const lang = useUiLang();
  const price = useCurrentPrice();
  return enrolT(lang)("bookSeat", { price: price === null ? "" : inr(price.amountInr) }).replace(/ — $/, "");
}

/** "Seats left at ₹2,999: 63" — real, from paid seats — or "₹2,999 seats are full — now ₹3,999". Hidden when the count is unknown. */
export function SeatCounter({ className = "" }: { className?: string }): React.JSX.Element | null {
  const lang = useUiLang();
  const { snapshot } = useSharpBrainPricing();
  if (snapshot === null || !snapshot.seatsKnown) return null;
  const t = enrolT(lang);
  const { price } = snapshot;
  return (
    <p className={className} data-seat-counter={price.seatsLeft}>
      {price.seatsLeft > 0 ? t("seatsLeft", { price: inr(price.introInr), n: price.seatsLeft }) : t("seatsFull", { intro: inr(price.introInr), price: inr(price.laterInr) })}
    </p>
  );
}

/** "~~₹8,999~~ ₹2,999 · first 100 seats" under a call to action. */
export function PriceLine({ className = "", tone = "light", startToday = false }: { className?: string; tone?: "light" | "app"; startToday?: boolean }): React.JSX.Element | null {
  const lang = useUiLang();
  const price = useCurrentPrice();
  if (price === null) return null;
  const t = enrolT(lang);
  const strike = tone === "app" ? "text-muted-foreground" : "text-ink-faint";
  const strong = tone === "app" ? "text-foreground" : "text-ink";
  return (
    <p className={`text-[14px] ${strike} ${className}`} data-price-state={price.offer}>
      <s>{inr(price.struckInr)}</s> <span className={`font-bold ${strong}`}>{inr(price.amountInr)}</span>
      {price.seatsLeft > 0 && ` · ${t("firstSeats", { n: price.introSeats })}`}
      {startToday && ` · ${t("startToday")}`}
    </p>
  );
}

/**
 * Email + name + pay button. The server decides the price from the real
 * seat count and returns a Razorpay link for this checkout.
 */
export function SeatCheckout({
  location,
  tone = "light",
  showPerDay = false,
}: {
  location: string;
  tone?: "light" | "app";
  showPerDay?: boolean;
}): React.JSX.Element {
  const lang = useUiLang();
  const { snapshot, simulateNow, simulateSeats } = useSharpBrainPricing();
  const t = enrolT(lang);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  // Prefill with the signed-in learner's email once the server has said who they are.
  const viewerEmail = snapshot?.viewerEmail ?? null;
  useEffect(() => {
    if (viewerEmail !== null) setEmail((current) => (current === "" ? viewerEmail : current));
  }, [viewerEmail]);
  const [error, setError] = useState<Exclude<CheckoutResult, { ok: true }>["reason"] | null>(null);

  if (snapshot === null) return <div className="h-[168px]" aria-busy="true" />;
  const price = snapshot.price;

  async function pay(): Promise<void> {
    setPending(true);
    setError(null);
    const result = await startSharpBrainCheckout({ email, name, simulateNow, simulateSeats });
    if (result.ok) {
      trackInitiateCheckout("Sharp Brain 30-Day Program", result.amountInr);
      trackGaEvent("razorpay_checkout_click", {
        location,
        offer: result.amountInr === price.introInr ? "parent_2999" : "parent_3999",
        value: String(result.amountInr),
        seats_left: String(result.seatsLeft),
        utm_source: readUtmParams().utm_source ?? "(none)",
      });
      window.location.assign(result.url);
      return;
    }
    setPending(false);
    setError(result.reason);
  }

  const app = tone === "app";
  const faint = app ? "text-muted-foreground" : "text-ink-faint";
  const input = app
    ? "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground"
    : "w-full rounded-sm border border-line-strong bg-void px-4 py-3 text-[15px] text-ink";
  const button = app
    ? "inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-60"
    : "inline-flex w-full items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44] disabled:opacity-60 sm:w-auto";

  return (
    <div data-seat-checkout>
      <form
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void pay();
        }}
        id={`enrol-form-${location}`}
      >
        <label className="block">
          <span className={`text-[12.5px] font-semibold ${faint}`}>{t("emailLabel")}</span>
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
          <span className={`text-[12.5px] font-semibold ${faint}`}>{t("nameLabel")}</span>
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
        <p className={`text-[12px] sm:col-span-2 ${faint}`}>{t("emailHint")}</p>
      </form>
      <button type="submit" form={`enrol-form-${location}`} disabled={pending} className={`${button} mt-4`} data-enrol-button>
        {pending ? t("redirecting") : t("bookSeat", { price: inr(price.amountInr) })}
      </button>
      <p className={`mt-2 text-[12.5px] ${faint}`}>
        {showPerDay ? t("perDay", { price: inr(Math.round(price.amountInr / 30)) }) : t("oneTime")} · {t("secure")}
      </p>
      {error !== null && (
        <p role="alert" className="mt-3 text-[13.5px] text-red-700">
          {t(`errors.${error}`)}{" "}
          <a href={waLink(t("whatsappEnrol", { price: inr(price.amountInr) }))} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            {t("chatOnWhatsapp")} →
          </a>
        </p>
      )}
    </div>
  );
}

function LivePriceAmount(): React.JSX.Element {
  const price = useCurrentPrice();
  return <>{price === null ? "" : inr(price.amountInr)}</>;
}

/**
 * The current seat price ("₹2,999", or "₹3,999" once the first 100 seats
 * are gone) for client components outside a pricing page. Fetched from the
 * server; empty until it arrives, so no wrong price ever flashes.
 */
export function LiveProgramPrice(): React.JSX.Element {
  return (
    <SharpBrainPricingProvider initial={null}>
      <LivePriceAmount />
    </SharpBrainPricingProvider>
  );
}
