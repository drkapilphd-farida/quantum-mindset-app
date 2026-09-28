"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { programForPath, programs } from "@/config/site.config";
import { HABIT_BUILDER_SIGNUP_HREF } from "@/config/habitBuilderSignupLink";
import { captureUtmParams, withUtmInWhatsAppHref } from "@/lib/analytics/utm";
import { classifyHref, contentNameFor, trackInitiateCheckout, trackLead, trackViewContent } from "@/lib/analytics/conversions";

// Site-wide conversion tracking (root layout), so no individual button has
// to remember it:
// - ViewContent on every program page (pages listed in the programs registry);
// - InitiateCheckout on any click to a payment link (Razorpay, Classplus);
// - Lead on any WhatsApp link click, whose pre-filled message also gets the
//   visitor's UTM params appended.
// - Lead on a click to the free starter's sign-up link.
// Form submits and free tests call trackLead themselves.
export default function ConversionTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    captureUtmParams();
  }, []);

  useEffect(() => {
    const program = programForPath(pathname);
    if (program !== null) trackViewContent(program.name);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.href === new URL(HABIT_BUILDER_SIGNUP_HREF, window.location.href).href) {
        trackLead(programs.focusStarter.name, "free_starter_signup");
        return;
      }
      const kind = classifyHref(anchor.href);
      if (kind === null) return;
      const path = window.location.pathname;
      if (kind === "checkout") {
        trackInitiateCheckout(contentNameFor(path, anchor.href, "Checkout"));
        return;
      }
      // Rewrite before the browser follows the link, so the message carries UTM params.
      anchor.href = withUtmInWhatsAppHref(anchor.href);
      trackLead(contentNameFor(path, anchor.href, "WhatsApp enquiry"), "whatsapp");
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
