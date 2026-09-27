"use client";

import Link from "next/link";
import { useHomeCopy } from "./useHomeCopy";
import { Eyebrow } from "../ui";
import TrainerBio from "../TrainerBio";

// 6. About Dr. Kapil — short bio card from site.config + link to /about.
export default function HomeAbout(): React.JSX.Element {
  const c = useHomeCopy().about;

  return (
    <section id="about-coach" className="border-b border-line px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Eyebrow color="text-gold">{c.eyebrow}</Eyebrow>
        <div className="mt-6">
          <TrainerBio variant="short" accent="gold" />
        </div>
        <Link href="/about" className="mt-5 inline-flex text-[14.5px] font-semibold text-gold hover:underline">
          {c.readStory}
        </Link>
      </div>
    </section>
  );
}
