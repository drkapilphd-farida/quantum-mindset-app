"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LivingBrainLogo } from "./brand/LivingBrainLogo";
import { brand, contact } from "@/config/site.config";
import {
  CONTACT_EMAIL,
  FOOTER_LOCATION,
  footerGroups,
  footerMetaLinks,
  TALK_TO_US_HREF,
} from "@/config/navigation";

// Site-wide footer: Sharp Brain / Calm Mind / Meditation / Free Tests /
// For Organisations / For Trainers, then About · Contact · policies,
// address, phone, WhatsApp and email. Built from src/config/navigation.ts
// and the contact block in site.config.ts.
export default function Footer(): React.JSX.Element {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const groups = footerGroups(lang);

  return (
    <footer className="px-4 pb-40 pt-16 sm:px-8 sm:pb-24">
      <div className="mx-auto max-w-content">
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em]">
              <LivingBrainLogo size={24} decorative={false} animated={false} />
              MIND UR MIND
            </div>
            <p className="mt-4 max-w-[240px] text-[13.5px] leading-relaxed text-ink-dim">
              {hi ? brand.taglineHi : brand.tagline}
            </p>
            <a
              href={TALK_TO_US_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-[13.5px] font-semibold text-gold hover:underline"
            >
              {hi ? "WhatsApp पर बात करें →" : "WhatsApp us →"}
            </a>
            <div className="mt-3 space-y-1 text-[13px] text-ink-dim">
              <a href={contact.phoneHref} className="block hover:text-ink">
                {contact.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="block break-all hover:text-ink">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.heading}>
              <h2 className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{group.heading}</h2>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={`${group.heading}-${link.label}`}>
                    <Link href={link.href} className="text-[13.5px] leading-snug text-ink-dim transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6 text-[12.5px] text-ink-faint">
          {footerMetaLinks(lang).map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-ink">
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="mt-4 flex flex-col gap-3 font-mono text-[12px] uppercase tracking-[0.05em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {brand.name} · mindurmind.org.in</span>
          <address className="not-italic">{hi ? FOOTER_LOCATION.hi : FOOTER_LOCATION.en}</address>
        </div>
      </div>
    </footer>
  );
}
