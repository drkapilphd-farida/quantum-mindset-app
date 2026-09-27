"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LivingBrainLogo } from "../brand/LivingBrainLogo";
import LanguageToggle from "../LanguageToggle";
import {
  freeTestLinks,
  navLabels,
  ORGANISATIONS_HREF,
  programGroups,
  TALK_TO_US_HREF,
  type NavLink,
} from "@/config/navigation";
import { trackGaEvent } from "@/lib/analytics/ga4";

// The one site-wide header (site-rebuild Phase 4): Programs (grouped by
// pillar) · Free Tests · For Organisations · About · Contact, plus a
// single header button. The button defaults to "Talk to Us" (WhatsApp);
// a program page may pass its own primary action instead (e.g. its
// enrol link) so the page's conversion path isn't lost. Below 640px the
// button lives in the menu (program pages also have a sticky bottom bar).

export type SiteNavCta = {
  label: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
};

type Dropdown = "programs" | "tests" | null;

export default function SiteNav({
  cta,
  showLanguageToggle = true,
}: {
  cta?: SiteNavCta;
  /** False on English-only pages. */
  showLanguageToggle?: boolean;
}): React.JSX.Element {
  const { lang } = useLanguage();
  const labels = navLabels(lang);
  const groups = programGroups(lang);
  const tests = freeTestLinks(lang);
  const [open, setOpen] = useState<Dropdown>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const button: SiteNavCta = cta ?? {
    label: labels.talkToUs,
    href: TALK_TO_US_HREF,
    external: true,
    onClick: () => trackGaEvent("whatsapp_click", { location: "site_nav" }),
  };

  useEffect(() => {
    function onPointer(event: PointerEvent): void {
      if (navRef.current !== null && !navRef.current.contains(event.target as Node)) setOpen(null);
    }
    function onKey(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function linkProps(link: NavLink | SiteNavCta): { target?: string; rel?: string } {
    return link.external === true ? { target: "_blank", rel: "noopener noreferrer" } : {};
  }

  const triggerClass =
    "inline-flex items-center gap-1 rounded-sm py-2 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
  const panelClass =
    "absolute left-0 top-full z-50 mt-2 rounded-sm border border-line-strong bg-void p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]";

  return (
    <header className={`sticky top-0 ${mobileOpen ? "z-[60]" : "z-50"} border-b border-line bg-void/90 backdrop-blur-md`}>
      <nav ref={navRef} aria-label="Main" className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
        <Link href="/" className="flex flex-none items-center gap-2.5 font-mono text-sm tracking-[0.06em] text-ink">
          <LivingBrainLogo size={24} decorative={false} animated={false} />
          MIND UR MIND
        </Link>

        <div className="hidden items-center gap-7 text-[13.5px] text-ink-dim lg:flex">
          <div className="relative">
            <button
              type="button"
              aria-expanded={open === "programs"}
              aria-controls="nav-programs"
              onClick={() => setOpen(open === "programs" ? null : "programs")}
              className={triggerClass}
            >
              {labels.programs}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {open === "programs" && (
              <div id="nav-programs" className={`${panelClass} grid w-[640px] grid-cols-3 gap-6`}>
                {groups.map((group) => (
                  <div key={group.heading}>
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">{group.heading}</p>
                    <ul className="space-y-2.5">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} onClick={() => setOpen(null)} className="block text-[13.5px] leading-snug text-ink-dim hover:text-ink">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={open === "tests"}
              aria-controls="nav-tests"
              onClick={() => setOpen(open === "tests" ? null : "tests")}
              className={triggerClass}
            >
              {labels.freeTests}
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {open === "tests" && (
              <ul id="nav-tests" className={`${panelClass} w-[280px] space-y-2.5`}>
                {tests.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={() => setOpen(null)} className="block text-[13.5px] text-ink-dim hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href={ORGANISATIONS_HREF} className="transition-colors hover:text-ink">
            {labels.organisations}
          </Link>
          <Link href="/about" className="transition-colors hover:text-ink">
            {labels.about}
          </Link>
          <Link href="/contact" className="transition-colors hover:text-ink">
            {labels.contact}
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {showLanguageToggle && <LanguageToggle />}
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
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">{labels.programs}</p>
          <div className="mt-3 space-y-4">
            {groups.map((group) => (
              <div key={group.heading}>
                <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">{group.heading}</p>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-[14.5px] text-ink-dim hover:text-ink">
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">{labels.freeTests}</p>
          <div className="mt-2">
            {tests.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-1.5 text-[14.5px] text-ink-dim hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col border-t border-line pt-4">
            {[
              { label: labels.organisations, href: ORGANISATIONS_HREF },
              { label: labels.about, href: "/about" },
              { label: labels.contact, href: "/contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="py-2 text-[14.5px] text-ink-dim hover:text-ink">
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
