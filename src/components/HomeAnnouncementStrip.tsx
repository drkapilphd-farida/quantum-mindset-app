"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

// Top strip (owner, 23 Nov 2026): the 21-Day Online Retreat early-bird.
// Hides itself after the early-bird ends (20 Dec, 23:59 IST).
const EVENT_EXPIRY = new Date("2026-12-21T00:00:00+05:30");
const DISMISS_STORAGE_KEY = "mum_online_retreat_jan27_strip_dismissed";

export default function HomeAnnouncementStrip({ lang = "en" }: { lang?: "en" | "hi" }): React.JSX.Element | null {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(DISMISS_STORAGE_KEY) === "1") setDismissed(true);
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

  const hi = lang === "hi";
  return (
    <div className="border-b border-line bg-[#0a1630] px-4 py-2.5 text-center text-[12.5px] text-white sm:px-8" data-home-strip>
      <div className="mx-auto flex max-w-content items-center justify-center gap-3">
        <Link href={hi ? "/online-retreat?lang=hi" : "/online-retreat"} className="min-w-0 truncate hover:underline">
          <span className="font-semibold text-gold">{hi ? "नया" : "NEW"}</span>
          <span className="text-white/50"> · </span>
          {hi ? "21 दिन का ऑनलाइन रिट्रीट · 1 जनवरी से" : "21-Day Online Retreat · starts 1 Jan"}
          <span className="text-white/85">{hi ? " · अर्ली-बर्ड ₹3,999, 20 दिसंबर तक" : " · early-bird ₹3,999 till 20 Dec"}</span>
          <span className="ml-1.5 font-semibold text-gold">{hi ? "सीट पक्की करें →" : "Reserve →"}</span>
        </Link>
        <button type="button" onClick={handleDismiss} aria-label={hi ? "बंद करें" : "Dismiss announcement"} className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-white/60 transition-colors hover:text-white">
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
