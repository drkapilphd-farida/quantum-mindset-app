"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { programForPath } from "@/config/site.config";
import { captureUtmParams, withUtmInWhatsAppHref } from "@/lib/analytics/utm";
import { classifyHref, contentNameFor, trackInitiateCheckout, trackViewContent, trackWhatsAppContact } from "@/lib/analytics/conversions";
import { programs } from "@/config/site.config";

// Site-wide conversion tracking (root layout), so no individual button has
// to remember it:
// - ViewContent on every program page (pages listed in the programs registry);
// - InitiateCheckout on any click to a payment link (Razorpay, Classplus);
// - Contact on any WhatsApp link click, whose pre-filled message also gets the
//   visitor's UTM params appended.
// Form submits and finished free tests call trackLead themselves.

// Pages whose WhatsApp messages are sent exactly as written (no UTM line):
// /telepathy-workshop's "TELEPATHY - …" messages trigger WhatsApp auto-replies.
// The Contact event still fires there.
const KEEP_WHATSAPP_MESSAGE_PATHS = ["/telepathy-workshop"];

export default function ConversionTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    captureUtmParams();
  }, []);

  useEffect(() => {
    const program = programForPath(pathname);
    // The Sharp Brain page reports as "Sharp Brain" (Meta ad reporting name).
    if (program !== null) trackViewContent(program === programs.sharpBrain ? "Sharp Brain" : program.name);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const kind = classifyHref(anchor.href);
      if (kind === null) return;
      const path = window.location.pathname;
      if (kind === "checkout") {
        trackInitiateCheckout(contentNameFor(path, anchor.href, "Checkout"));
        return;
      }
      // Rewrite before the browser follows the link, so the message carries UTM params —
      // except on pages whose pre-filled messages are auto-reply keywords and must stay exact.
      if (!KEEP_WHATSAPP_MESSAGE_PATHS.includes(path)) anchor.href = withUtmInWhatsAppHref(anchor.href);
      // Buttons that already counted this Contact themselves (the free test's "Send on WhatsApp").
      if (anchor.dataset.contactTracked !== undefined) return;
      trackWhatsAppContact(contentNameFor(path, anchor.href, "WhatsApp enquiry"));
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
