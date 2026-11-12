"use client";

import { useEffect, useState } from "react";
import { CLARITY_SESSION } from "@/config/site.config";
import { waLink } from "@/data/links";
import { trackInitiateCheckout } from "@/lib/analytics/conversions";
import { readUtmParams } from "@/lib/analytics/utm";
import { confirmClarityPayment, startClarityCheckout } from "@/app/clarity-session/actions";
import { say } from "@/features/programs/common";
import type { ProgramLang } from "@/features/programs/types";
import { CLARITY_PAGE, CLARITY_WHATSAPP_MESSAGE } from "../copy";

// "Pay ₹1,100 and choose your time" (owner's conversion brief):
// - "checkout": Razorpay Checkout on this page (Razorpay keys set in Vercel);
// - "link": the Razorpay Payment Page, which redirects to /clarity-session/booked;
// - "whatsapp": neither is set yet — the request goes to WhatsApp instead.

export type PayMode = { kind: "checkout" } | { kind: "link"; href: string } | { kind: "whatsapp" };

type RazorpayResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, handler: () => void) => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;
declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const CHECKOUT_JS = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<RazorpayConstructor | null> {
  if (window.Razorpay !== undefined) return Promise.resolve(window.Razorpay);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_JS;
    script.async = true;
    script.onload = () => resolve(window.Razorpay ?? null);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
}

export function bookedHref(lang: ProgramLang, paymentId?: string): string {
  const params = new URLSearchParams();
  if (paymentId !== undefined) params.set("razorpay_payment_id", paymentId);
  if (lang === "hi") params.set("lang", "hi");
  const query = params.toString();
  return `/clarity-session/booked${query === "" ? "" : `?${query}`}`;
}

export function ClarityPayButton({ mode, lang }: { mode: PayMode; lang: ProgramLang }): React.JSX.Element {
  const [busy, setBusy] = useState(false);
  // The program the visitor came from (?program=<slug>) — read here so the page itself can be pre-built.
  const [program, setProgram] = useState<string | null>(null);
  useEffect(() => setProgram(new URLSearchParams(window.location.search).get("program")), []);
  const [error, setError] = useState<string | null>(null);

  async function openCheckout(): Promise<void> {
    setBusy(true);
    setError(null);
    const [Razorpay, order] = await Promise.all([loadCheckout(), startClarityCheckout({ ...(program !== null ? { program } : {}), utm: readUtmParams() })]);
    if (Razorpay === null || !order.ok) {
      setBusy(false);
      setError(say(CLARITY_PAGE.payError, lang));
      return;
    }
    const checkout = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amountPaise,
      currency: "INR",
      name: "Mind Ur Mind",
      description: "Clarity Session (60 min) · 1-on-1 with Dr. Kapil",
      notes: { product: "clarity-session", ...(program !== null ? { program } : {}) },
      theme: { color: "#0E1B2C" },
      modal: { ondismiss: () => setBusy(false) },
      handler: (response: RazorpayResponse) => {
        void confirmClarityPayment({ orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature, url: window.location.href }).then((result) => {
          if (result.ok) window.location.assign(bookedHref(lang, response.razorpay_payment_id));
          else {
            setBusy(false);
            setError(say(CLARITY_PAGE.payError, lang));
          }
        });
      },
    });
    checkout.open();
  }

  function onClick(event: React.MouseEvent<HTMLAnchorElement>): void {
    trackInitiateCheckout("Clarity Session", CLARITY_SESSION.priceInr);
    if (mode.kind !== "checkout") return; // the link itself navigates
    event.preventDefault();
    void openCheckout();
  }

  const href = mode.kind === "link" ? mode.href : mode.kind === "whatsapp" ? waLink(CLARITY_WHATSAPP_MESSAGE) : "#pay";
  return (
    <div className="flex flex-col gap-3">
      <a
        id="pay"
        href={href}
        onClick={onClick}
        aria-disabled={busy}
        {...(mode.kind === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`inline-flex min-h-14 w-full items-center justify-center rounded-[12px] bg-[#F2A93B] px-7 py-4 text-center text-[19px] font-extrabold text-[#0E1B2C] hover:bg-[#E39A2A] sm:w-auto ${busy ? "pointer-events-none opacity-60" : ""}`}
        data-clarity-pay={mode.kind}
        data-checkout-tracked
      >
        {busy ? say(CLARITY_PAGE.paying, lang) : say(CLARITY_PAGE.pay, lang)}
      </a>
      {error !== null && (
        <p role="alert" className="rounded-[8px] border border-[#F2A93B]/60 px-3 py-2 text-[15px]">
          {error}
        </p>
      )}
    </div>
  );
}
