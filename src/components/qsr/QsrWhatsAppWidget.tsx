"use client";

import { useLanguage } from "@/context/LanguageContext";
import WhatsAppWidget from "../WhatsAppWidget";
import { WHATSAPP_MASTERCLASS_INQUIRY_LINK } from "@/config/whatsappSupportLink";

// Thin translated wrapper — page.tsx stays a Server Component, but the
// bubble/button copy needs the client-side language toggle's current
// value, so that lookup has to happen in a client component.
//
// Compact-Button-First™ — this is the one long, screenshot-heavy page on
// the site where the explanatory bubble was confirmed (via measured
// bounding boxes) to end up parked directly over product screenshots
// during scroll, since the widget is fixed to the viewport rather than
// any particular section. 6s is enough to read the short message; after
// that, only the compact round button remains — still fully available,
// never removed, just no longer competing with page content for
// attention. This prop is QSR-only; every other page using the shared
// WhatsAppWidget keeps its exact existing manual-dismiss-only behavior.
const BUBBLE_AUTO_DISMISS_MS = 6_000;

export default function QsrWhatsAppWidget(): React.JSX.Element {
  const { t } = useLanguage();
  const qsrWhatsapp = t.qsrLanding.whatsapp;

  return (
    <WhatsAppWidget
      href={WHATSAPP_MASTERCLASS_INQUIRY_LINK}
      bubble={qsrWhatsapp.bubble}
      buttonLabel={qsrWhatsapp.button}
      ariaLabel={qsrWhatsapp.ariaLabel}
      bottomClassName="bottom-24 sm:bottom-24"
      analyticsLocation="qsr_widget"
      autoDismissBubbleMs={BUBBLE_AUTO_DISMISS_MS}
      // Hero-overlap fix (see the "Homepage & QSR Conversion Rewrite"
      // task) — the hero's new primary+secondary CTA pair (each with its
      // own meta line) plus the tertiary Speed Test link made the hero
      // tall enough on mobile that this widget's fixed bottom-24
      // position landed directly over the secondary CTA button
      // (confirmed via screenshot). Same fix already used on the
      // homepage widget (see HomePage's own doc comment): only reveal
      // once the hero (id="qsr-hero") has fully scrolled out of view.
      revealAfterElementId="qsr-hero"
    />
  );
}
