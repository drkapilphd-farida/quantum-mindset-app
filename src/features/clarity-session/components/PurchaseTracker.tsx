"use client";

import { useEffect } from "react";
import { CLARITY_SESSION } from "@/config/site.config";
import { track } from "@/lib/fbq";
import { trackGaEvent } from "@/lib/analytics/ga4";
import { newEventId } from "@/lib/analytics/metaPixel";

// Purchase (₹1,100 INR) on /clarity-session/booked (owner's conversion
// brief). Counted only for a visitor who really came from a payment: the
// page has Razorpay's payment id, or the visitor arrived from a Razorpay
// page. Counted once per payment (a refresh does not count it again). The
// payment id is the event_id, matching the server-side Purchase that
// confirmClarityPayment sends after checking the signature.

const RAZORPAY_REFERRERS = ["razorpay.com", "rzp.io", "razorpay.me"];
const KEY = "mum_clarity_purchase";

export function PurchaseTracker(): null {
  useEffect(() => {
    const paymentId = new URLSearchParams(window.location.search).get("razorpay_payment_id");
    let fromRazorpay = false;
    try {
      const host = document.referrer === "" ? "" : new URL(document.referrer).hostname;
      fromRazorpay = RAZORPAY_REFERRERS.some((h) => host === h || host.endsWith(`.${h}`));
    } catch {
      fromRazorpay = false;
    }
    if (paymentId === null && !fromRazorpay) return;
    const eventId = paymentId ?? newEventId();
    try {
      if (window.sessionStorage.getItem(KEY) === (paymentId ?? "counted")) return;
      window.sessionStorage.setItem(KEY, paymentId ?? "counted");
    } catch {
      // storage blocked — count it anyway
    }
    const value = CLARITY_SESSION.priceInr;
    // The pixel may still be loading: fbq queues calls made before it finishes.
    track("Purchase", { value, currency: "INR", content_name: "Clarity Session" }, eventId);
    trackGaEvent("purchase", { transaction_id: eventId, value, currency: "INR", content_name: "Clarity Session" });
  }, []);
  return null;
}
