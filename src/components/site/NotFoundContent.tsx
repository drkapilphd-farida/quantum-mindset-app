"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { freeTestLinks, programGroups, TALK_TO_US_HREF } from "@/config/navigation";
import SimplePageNav from "../SimplePageNav";
import Footer from "../Footer";
import { Eyebrow } from "../ui";

// Site-wide 404: back to the homepage, every program by pillar, the free
// tests and WhatsApp — so a broken or old link is never a dead end.
export default function NotFoundContent(): React.JSX.Element {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const groups = [...programGroups(lang), { heading: hi ? "फ्री टेस्ट" : "Free Tests", links: freeTestLinks(lang) }];

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SimplePageNav />
      <main className="border-b border-line px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-content">
          <Eyebrow color="text-gold">404</Eyebrow>
          <h1 className="mt-4 text-[30px] font-extrabold leading-tight sm:text-[40px]">
            {hi ? "यह पेज नहीं मिला" : "This page doesn’t exist"}
          </h1>
          <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-dim">
            {hi
              ? "हो सकता है लिंक पुराना हो या पेज का नाम बदल गया हो। नीचे से अपना प्रोग्राम चुनें, या होमपेज पर जाएं।"
              : "The link may be old, or the page may have moved. Pick a program below, or go to the homepage."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-7 py-[15px] text-[15px] font-semibold text-[#1B1508] hover:bg-[#cb9a44]"
            >
              {hi ? "होमपेज पर जाएं" : "Go to the homepage"}
            </Link>
            <a
              href={TALK_TO_US_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-line-strong px-7 py-[15px] text-[15px] font-semibold text-ink hover:bg-panel2"
            >
              {hi ? "WhatsApp पर पूछें" : "Ask us on WhatsApp"}
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <div key={group.heading}>
                <h2 className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">{group.heading}</h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[15px] font-semibold text-gold hover:underline">
                        {link.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
