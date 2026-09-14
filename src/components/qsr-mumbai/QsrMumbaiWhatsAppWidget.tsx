"use client";

import { useLanguage } from "@/context/LanguageContext";
import WhatsAppWidget from "../WhatsAppWidget";
import { WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK } from "@/config/whatsappSupportLink";

// Same hero-clear-reveal + auto-dismiss pattern as QsrWhatsAppWidget.tsx
// — this page's hero also uses id="top", so the widget stays hidden
// until the hero has fully scrolled out of view, avoiding the same
// portrait/content overlap that pattern was built to fix.
const BUBBLE_AUTO_DISMISS_MS = 6_000;

export default function QsrMumbaiWhatsAppWidget(): React.JSX.Element {
  const { t } = useLanguage();
  const qsrMumbaiWhatsapp = t.qsrMumbaiLanding.whatsapp;

  return (
    <WhatsAppWidget
      href={WHATSAPP_MUMBAI_WORKSHOP_INQUIRY_LINK}
      bubble={qsrMumbaiWhatsapp.bubble}
      buttonLabel={qsrMumbaiWhatsapp.button}
      ariaLabel={qsrMumbaiWhatsapp.ariaLabel}
      bottomClassName="bottom-24 sm:bottom-24"
      analyticsLocation="qsr_mumbai_widget"
      autoDismissBubbleMs={BUBBLE_AUTO_DISMISS_MS}
      revealAfterElementId="top"
    />
  );
}
