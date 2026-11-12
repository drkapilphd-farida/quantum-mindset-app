"use client";

import { useEffect, useState } from "react";
import { calmMindBatch } from "@/config/site.config";
import { waLink } from "@/data/links";
import { normalizeIndianMobile } from "@/lib/phone/indianMobile";
import { trackInitiateCheckout, trackViewContent } from "@/lib/analytics/conversions";
import { readUtmParams } from "@/lib/analytics/utm";
import { confirmCalmPayment, startCalmCheckout } from "@/app/calm-mind-batch/actions";
import type { BatchState, Lang } from "../batch";
import { CALM_COPY } from "../copy";

// "Reserve my seat — ₹2,999" (owner's brief): a short details form (name,
// email, WhatsApp — prefilled into Razorpay Checkout), then Checkout, then the
// joined page. A full or past batch → WhatsApp waitlist instead; no Razorpay
// keys yet → a WhatsApp message to reserve.

const say = (text: { en: string; hi: string }, lang: Lang): string => text[lang];
const GOLD = "inline-flex min-h-12 items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-center text-[16px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44]";
const RESERVE_MESSAGE = "Hi Dr. Kapil, I want to reserve a seat in the 21-Day Calm Mind batch.";

type RazorpayResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;
// Read without re-declaring window.Razorpay (the Clarity Session button declares it with its own type).
const razorpayGlobal = (): RazorpayConstructor | undefined => (window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay;

function loadCheckout(): Promise<RazorpayConstructor | null> {
  const ready = razorpayGlobal();
  if (ready !== undefined) return Promise.resolve(ready);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(razorpayGlobal() ?? null);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
}

export function CalmViewContent(): null {
  useEffect(() => trackViewContent("Calm Mind Batch", calmMindBatch.price), []);
  return null;
}

/** The reserve button everywhere on the page (hero, price card, comparison, final band, sticky bar). */
export function CalmReserveButton({ state, checkout, lang, label, className = "", full = false }: { state: BatchState; checkout: boolean; lang: Lang; label?: string; className?: string; full?: boolean }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const width = full ? "w-full" : "";
  if (state.status !== "open") {
    return (
      <a href={waLink(CALM_COPY.waitlistMessage)} target="_blank" rel="noopener noreferrer" className={`${GOLD} ${width} ${className}`} data-calm-waitlist>
        {say(state.status === "full" ? CALM_COPY.full : CALM_COPY.ended, lang)}
      </a>
    );
  }
  const text = label ?? say(CALM_COPY.hero.reserve, lang);
  if (!checkout) {
    return (
      <a href={waLink(RESERVE_MESSAGE)} target="_blank" rel="noopener noreferrer" onClick={() => trackInitiateCheckout("Calm Mind Batch", calmMindBatch.price)} className={`${GOLD} ${width} ${className}`} data-calm-reserve="whatsapp" data-checkout-tracked>
        {text}
      </a>
    );
  }
  return (
    <>
      <button
        type="button"
        onClick={() => {
          trackInitiateCheckout("Calm Mind Batch", calmMindBatch.price);
          setOpen(true);
        }}
        className={`${GOLD} ${width} ${className}`}
        data-calm-reserve="checkout"
      >
        {text}
      </button>
      {open && <CheckoutForm lang={lang} onClose={() => setOpen(false)} />}
    </>
  );
}

function CheckoutForm({ lang, onClose }: { lang: Lang; onClose: () => void }): React.JSX.Element {
  const c = CALM_COPY.checkout;
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const field = "min-h-12 w-full rounded-sm border border-line-strong bg-void px-3 text-[16px] text-ink focus:border-gold focus:outline-none";

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (normalizeIndianMobile(form.phone) === null) {
      setError(say(c.phoneError, lang));
      return;
    }
    setBusy(true);
    setError(null);
    const utm = readUtmParams();
    const [Razorpay, order] = await Promise.all([loadCheckout(), startCalmCheckout({ ...form, utm })]);
    if (Razorpay === null || !order.ok) {
      setBusy(false);
      setError(order.ok || order.reason !== "closed" ? say(c.error, lang) : say(CALM_COPY.full, lang));
      return;
    }
    const checkout = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amountPaise,
      currency: "INR",
      name: "Mind Ur Mind",
      description: "21-Day Calm Mind — Live Batch",
      prefill: { name: form.name, email: form.email, contact: order.contact },
      theme: { color: "#B8862E" },
      modal: { ondismiss: () => setBusy(false) },
      handler: (response: RazorpayResponse) => {
        void confirmCalmPayment({ ...form, utm, orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature, url: window.location.href, lang }).then((result) => {
          if (result.ok) window.location.assign(result.href);
          else {
            setBusy(false);
            setError(say(c.error, lang));
          }
        });
      },
    });
    checkout.open();
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={say(c.title, lang)} className="fixed inset-0 z-[60] flex items-end justify-center bg-void/70 px-0 sm:items-center sm:px-4" onClick={() => !busy && onClose()} data-calm-form>
      <form onSubmit={(event) => void onSubmit(event)} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-t-lg border border-line-strong bg-panel p-6 shadow-xl sm:rounded-lg">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-[20px] font-extrabold">{say(c.title, lang)}</h2>
          <button type="button" onClick={onClose} disabled={busy} aria-label={say(c.close, lang)} className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[24px] leading-none text-ink-dim hover:bg-panel2">
            ×
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
            {say(c.name, lang)}
            <input required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
            {say(c.email, lang)}
            <input required type="email" maxLength={200} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-[14px] font-semibold">
            {say(c.phone, lang)}
            <input required type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field} />
          </label>
        </div>
        {error !== null && (
          <p role="alert" className="mt-3 rounded-sm border border-gold/60 px-3 py-2 text-[14px]">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={`${GOLD} mt-5 w-full disabled:opacity-60`} data-calm-pay>
          {busy ? say(c.paying, lang) : say(c.pay, lang)}
        </button>
      </form>
    </div>
  );
}

/** Phone-only bottom bar: appears once the hero has scrolled away, hides while the price card is on screen. */
export function CalmStickyBar({ state, checkout, lang }: { state: BatchState; checkout: boolean; lang: Lang }): React.JSX.Element | null {
  const [heroGone, setHeroGone] = useState(false);
  const [priceVisible, setPriceVisible] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("calm-hero");
    const price = document.getElementById("calm-price");
    if (hero === null || price === null) return undefined;
    const heroObserver = new IntersectionObserver(([entry]) => setHeroGone(entry !== undefined && !entry.isIntersecting));
    const priceObserver = new IntersectionObserver(([entry]) => setPriceVisible(entry !== undefined && entry.isIntersecting));
    heroObserver.observe(hero);
    priceObserver.observe(price);
    return () => {
      heroObserver.disconnect();
      priceObserver.disconnect();
    };
  }, []);
  const show = heroGone && !priceVisible;
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-panel/95 px-4 py-3 backdrop-blur transition-transform duration-200 sm:hidden ${show ? "translate-y-0" : "pointer-events-none translate-y-full"}`} aria-hidden={!show} data-calm-sticky={show ? "shown" : "hidden"}>
      <CalmReserveButton state={state} checkout={checkout} lang={lang} label={say(CALM_COPY.sticky, lang)} full />
    </div>
  );
}
