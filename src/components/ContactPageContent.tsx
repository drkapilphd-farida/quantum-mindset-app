"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import SimplePageNav from "./SimplePageNav";
import Footer from "./Footer";
import WhatsAppWidget from "./WhatsAppWidget";
import SiteTodo from "./site/SiteTodo";
import { contact } from "@/config/site.config";
import { WHATSAPP_GENERAL_INQUIRY_LINK } from "@/config/whatsappSupportLink";
import { trackGaEvent } from "@/lib/analytics/ga4";

// Contact Us — real contact methods only (phone, WhatsApp, email, address),
// all from the contact block in site.config.ts. No backend contact form:
// every other page routes enquiries through WhatsApp/email too.

type Row = { icon: typeof Mail; label: string; value: string; href?: string; external?: boolean };

export default function ContactPageContent(): React.JSX.Element {
  const { t, lang } = useLanguage();
  const c = t.contactPage;
  const hours = contact.hours === null ? null : contact.hours[lang];

  const rows: Row[] = [
    { icon: Phone, label: c.phoneLabel, value: contact.phoneDisplay, href: contact.phoneHref },
    { icon: MessageCircle, label: c.whatsappLabel, value: contact.phoneDisplay, href: WHATSAPP_GENERAL_INQUIRY_LINK, external: true },
    { icon: Mail, label: c.emailLabel, value: contact.email, href: `mailto:${contact.email}` },
    { icon: MapPin, label: c.addressLabel, value: contact.address[lang] },
    ...(hours === null ? [] : [{ icon: Clock, label: c.hoursLabel, value: hours }]),
  ];

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SimplePageNav />
      <main className="border-b border-line px-6 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-[32px] font-extrabold leading-tight sm:text-[40px]">{c.headline}</h1>
          <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-ink-dim">{c.sub}</p>

          <div className="mx-auto mt-12 max-w-sm space-y-4 text-left">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start gap-3.5 rounded-sm border border-line-strong bg-panel2 px-5 py-4">
                <row.icon className="mt-0.5 h-4.5 w-4.5 flex-none text-gold" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{row.label}</div>
                  {row.href === undefined ? (
                    <p className="mt-0.5 text-[14.5px] leading-relaxed text-ink">{row.value}</p>
                  ) : (
                    <a
                      href={row.href}
                      {...(row.external === true ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-0.5 block break-words text-[14.5px] font-semibold text-ink hover:text-gold"
                    >
                      {row.value}
                    </a>
                  )}
                </div>
              </div>
            ))}
            {hours === null && <SiteTodo>working hours are empty in site.config (contact.hours) — hidden on production.</SiteTodo>}
          </div>

          <p className="mt-8 text-[13px] text-ink-faint">{c.responseTime}</p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href={WHATSAPP_GENERAL_INQUIRY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGaEvent("whatsapp_click", { location: "contact_page" })}
              className="group inline-flex items-center gap-2.5 rounded-sm bg-gold px-7 py-[15px] text-[14.5px] font-semibold text-[#1B1508] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#cb9a44]"
            >
              {c.ctaPrimary}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a href={`mailto:${contact.email}`} className="text-[13.5px] text-ink-dim underline decoration-ink-faint/50 underline-offset-2 hover:text-ink">
              {c.ctaSecondary} {contact.email}
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
