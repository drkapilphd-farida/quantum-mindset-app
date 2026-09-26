"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

// Auto-hides the day after the event — no manual cleanup needed once
// 18 Oct 2026 has passed; the strip simply stops rendering. Previously
// promoted the PREfrontal POWER Mumbai workshop (see the "Executive
// Brain Performance Workshop: page fixes + homepage positioning" task,
// section 2.1/2.2) — that workshop's own page and every other link to
// it elsewhere on the site are untouched; only this top-of-homepage
// highlight was replaced. A new DISMISS_STORAGE_KEY (not reused from
// the old PFC strip) so a visitor who already dismissed that one still
// sees this new, different announcement.
const EVENT_EXPIRY = new Date("2026-10-19T00:00:00+05:30");
const DISMISS_STORAGE_KEY = "mum_executive_workshop_strip_dismissed";

// Slim, non-sticky top strip — sits in normal document flow above the
// (sticky) Navbar, so once a visitor scrolls even slightly it scrolls
// away with the rest of the page rather than permanently eating into the
// viewport. Dismissal persists via localStorage (wrapped in try/catch —
// a private window, cleared site data, or a browser blocking storage
// must never crash this strip) so a visitor who closes it doesn't see
// it again on their next visit.
export default function HomeAnnouncementStrip(): React.JSX.Element | null {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_STORAGE_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      // Storage unavailable — never block the strip from showing.
    }
  }, []);

  if (dismissed || new Date() > EVENT_EXPIRY) return null;

  function handleDismiss(): void {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_STORAGE_KEY, "1");
    } catch {
      // Storage unavailable — dismissal just won't persist across visits.
    }
  }

  return (
    <div className="border-b border-line bg-[#12162a] px-4 py-2.5 text-center text-[12.5px] text-[#f5f1e6] sm:px-8">
      <div className="mx-auto flex max-w-content items-center justify-center gap-3">
        <Link href="/executive-brain-workshop#pricing" className="min-w-0 truncate hover:underline">
          <span className="font-semibold text-gold">NEW IN MUMBAI</span>
          <span className="text-[#8b8fa8]"> · </span>
          Executive Brain Performance Workshop
          <span className="text-[#8b8fa8]"> · Sun, 18 Oct 2026 · Andheri East</span>
          <span className="ml-1.5 font-semibold text-gold">Reserve Seat →</span>
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-[#8b8fa8] transition-colors hover:text-[#f5f1e6]"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
