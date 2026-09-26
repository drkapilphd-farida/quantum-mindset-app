"use client";

import { useLanguage } from "@/context/LanguageContext";
import SimplePageNav from "./SimplePageNav";
import Footer from "./Footer";
import WhatsAppWidget from "./WhatsAppWidget";
import TrainerBio from "./TrainerBio";

// About Us™ — company-level page. The footer's old "About Dr. Sharma"
// link pointed at this same /about route while implying a
// founder-bio-only page; there's no separate dedicated founder bio page
// in this codebase to link out to instead, so rather than inventing one
// (or a link to a page that doesn't exist), the real founder bio content
// is embedded directly on this page via the shared TrainerBio component
// the Personal Class and Course pages already use — real, existing
// content, not new copy.
export default function AboutPageContent(): React.JSX.Element {
  const { t } = useLanguage();
  const a = t.aboutPage;

  return (
    <div className="warm-light min-h-screen font-sans antialiased">
      <SimplePageNav />
      <main>
        <section className="border-b border-line px-6 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-[32px] font-extrabold leading-tight sm:text-[40px]">{a.headline}</h1>

            <div className="mx-auto mt-8 max-w-xl space-y-5 text-left">
              {a.body.map((paragraph) => (
                <p key={paragraph} className="text-[15.5px] leading-relaxed text-ink-dim">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <TrainerBio variant="long" accent="gold" eyebrow={a.guide.eyebrow} quote={a.guide.quote} />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
