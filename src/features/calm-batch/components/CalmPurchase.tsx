"use client";

import { useEffect } from "react";
import { calmMindBatch } from "@/config/site.config";
import { track } from "@/lib/fbq";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Purchase (₹2,999 INR) on the joined page — only for a verified payment
// (the page passes the payment ID only after checking its signed link). The
// payment ID is the event_id, the same as the server-side Purchase sent by
// confirmCalmPayment, so Meta counts it once. Once per payment.
const KEY = "mum_calm_purchase";

export function CalmPurchase({ paymentId }: { paymentId: string }): null {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY) === paymentId) return;
      window.sessionStorage.setItem(KEY, paymentId);
    } catch {
      // storage blocked — count it anyway
    }
    track("Purchase", { value: calmMindBatch.price, currency: "INR", content_name: "Calm Mind Batch" }, paymentId);
    trackGaEvent("purchase", { transaction_id: paymentId, value: calmMindBatch.price, currency: "INR", content_name: "Calm Mind Batch" });
  }, [paymentId]);
  return null;
}
