"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LivingBrainLogo } from "../brand/LivingBrainLogo";
import { navLabels, siteNavCta, siteNavLinks, type NavLink } from "@/config/navigation";

// The one site-wide header (positioning rework, copy/header-footer.md):
// at most 5 links + one button on the right. The button defaults to
// "Sharp Brain से जुड़िए" / "Join Sharp Brain" (the Sharp Brain offers); a page may
// pass its own primary action instead (e.g. its enrol link). Hindi pages
// show Hindi labels, English pages English ones (the page's
// language, see LanguageOverride). No language toggle: `/` links to
// "हिंदी" (/hi) and /hi to "English" (/); the workshop pages pass their own
// link (?lang=hi); other pages have none. On Hindi pages the logo goes to /hi. Below 1024px the links (and, below 640px, the button)
// live in the menu.

export type SiteNavCta = {
  label: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
};

// Phase 4.3: the site opens in English. `/` links to "हिंदी" (/hi), /hi to "English" (/).
const LANGUAGE_LINKS: Record<string, NavLink> = {
  "/": { label: "हिंदी", href: "/hi" },
  "/hi": { label: "English", href: "/" },
};

export default function SiteNav({
  cta,
  showLanguageToggle = true,
  languageLink: pageLanguageLink,
}: {
  cta?: SiteNavCta;
  /** False hides the "English" / "हिंदी" link (on `/`, `/hi` and the workshop pages). */
  showLanguageToggle?: boolean;
  /** A page's own language link (e.g. /telepathy-workshop ↔ ?lang=en). */
  languageLink?: NavLink;
}): React.JSX.Element {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const labels = navLabels(lang);
  const links = siteNavLinks(lang);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const button: SiteNavCta = cta ?? siteNavCta(lang);
  const languageLink = !showLanguageToggle ? undefined : (pageLanguageLink ?? LANGUAGE_LINKS[pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (event.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function linkProps(link: SiteNavCta): { target?: string; rel?: string } {
    return link.external === true ? { target: "_blank", rel: "noopener noreferrer" } : {};
  }

  return (
    <header className={`sticky top-0 ${mobileOpen ? "z-[60]" : "z-50"} border-b border-line bg-void/90 backdrop-blur-md`}>
      <nav ref={navRef} aria-label="Main" className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
        <Link href={lang === "hi" ? "/hi" : "/"} className="flex flex-none items-center gap-2.5 font-mono text-sm tracking-[0.06em] text-ink">
          <LivingBrainLogo size={24} decorative={false} animated={false} />
          MIND UR MIND
        </Link>

        <div className="hidden items-center gap-7 text-[13.5px] text-ink-dim lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {languageLink !== undefined && (
            <Link href={languageLink.href} lang={languageLink.label === "English" ? "en" : "hi"} className="rounded-sm px-2 py-1.5 text-[13px] font-semibold text-ink underline decoration-gold/60 underline-offset-4 hover:decoration-gold">
              {languageLink.label}
            </Link>
          )}
          <a
            href={button.href}
            onClick={button.onClick}
            {...linkProps(button)}
            className="hidden whitespace-nowrap rounded-sm bg-gold px-4 py-2 text-[13px] font-semibold text-[#1B1508] transition-transform hover:-translate-y-0.5 hover:bg-[#cb9a44] sm:inline-flex"
          >
            {button.label}
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile"
            aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-line-strong text-ink lg:hidden"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" aria-hidden="true" /> : <Menu className="h-4.5 w-4.5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="nav-mobile" className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-line bg-void px-4 pb-6 pt-4 sm:px-8 lg:hidden">
          <div className="flex flex-col">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="py-2.5 text-[15px] text-ink-dim hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
          <a
            href={button.href}
            onClick={button.onClick}
            {...linkProps(button)}
            className="mt-5 flex items-center justify-center rounded-sm bg-gold px-4 py-3 text-[14px] font-semibold text-[#1B1508]"
          >
            {button.label}
          </a>
        </div>
      )}
    </header>
  );
}
