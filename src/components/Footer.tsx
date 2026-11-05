"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LivingBrainLogo } from "./brand/LivingBrainLogo";
import { contact } from "@/config/site.config";
import { CONTACT_EMAIL, TALK_TO_US_HREF, footerAddress, footerBottom, footerColumns } from "@/config/navigation";
import { LINKS, YOUTUBE_CHANNEL, isPlaceholderLink } from "@/data/links";

// Site-wide footer (positioning rework, copy/header-footer.md): programs ·
// more · address, then privacy · terms · refund · ©. Hindi pages show the
// Hindi labels, /en and English pages the English ones. "Google पर रिव्यू"
// appears once LINKS.googleBusinessProfile is filled in (still a
// placeholder — a link labelled "Google reviews" must not open WhatsApp).
export default function Footer(): React.JSX.Element {
  const { lang } = useLanguage();
  const columns = footerColumns(lang);
  const address = footerAddress(lang);
  const bottom = footerBottom(lang);
  const gbp: string = LINKS.googleBusinessProfile;

  return (
    <footer className="px-4 pb-40 pt-16 sm:px-8 sm:pb-24">
      <div className="mx-auto max-w-content">
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 font-mono text-sm tracking-[0.06em]">
              <LivingBrainLogo size={24} decorative={false} animated={false} />
              MIND UR MIND
            </div>
          </div>

          {columns.map((column, i) => (
            <div key={i}>
              {column.heading !== null && <h2 className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{column.heading}</h2>}
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[13.5px] leading-snug text-ink-dim transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1">
            {address.heading !== null && <h2 className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{address.heading}</h2>}
            <address className="space-y-2.5 text-[13.5px] not-italic leading-snug text-ink-dim">
              <p>{address.address}</p>
              <p>
                <a href={TALK_TO_US_HREF} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  {contact.phoneDisplay} {address.whatsappSuffix}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="break-all hover:text-ink">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                {!isPlaceholderLink(gbp) && (
                  <>
                    <a href={gbp} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                      {address.googleReviews}
                    </a>
                    {" · "}
                  </>
                )}
                <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  YouTube
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-6 text-[12.5px] text-ink-faint">
          {bottom.links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
          <span>{bottom.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
