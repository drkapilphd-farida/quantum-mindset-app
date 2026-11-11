import Link from "next/link";
import { FREE_TEST_LINKS } from "@/config/navigation";

// FreeTestButton (owner, Nov 2026): the one style for every free-test call to
// action on the site — deep teal (#0F766E, hover #115E59), white text, a
// small white "FREE" / "मुफ़्त" pill, the test name, "→", and the time under
// it. Gold stays for paid actions only. White on #0F766E is 5.5:1 (WCAG AA).

export type FreeTest = "reading" | "overthinking";
type Lang = "en" | "hi";

const LABELS: Record<FreeTest, { en: string; hi: string }> = {
  reading: { en: "Reading & Memory Test", hi: "Reading और Memory Test" },
  overthinking: { en: "Overthinking Test", hi: "ओवरथिंकिंग टेस्ट" },
};
const HREF: Record<FreeTest, string> = { reading: FREE_TEST_LINKS.speedTest, overthinking: FREE_TEST_LINKS.overthinkingTest };
const BADGE = { en: "FREE", hi: "मुफ़्त" } as const;
const TIME = { en: "3 minutes", hi: "3 मिनट" } as const;

export function FreeTestButton({
  test,
  lang,
  className = "",
  rounded = "rounded-sm",
  align = "start",
  timeTone = "light",
}: {
  test: FreeTest;
  lang: Lang;
  className?: string;
  /** Match the page's own button corners (home/Sharp Brain: rounded-sm; program pages: rounded-[10px]). */
  rounded?: string;
  align?: "start" | "center";
  /** Time line colour: on a light or a dark background. */
  timeTone?: "light" | "dark";
}): React.JSX.Element {
  return (
    <span className={`inline-flex flex-col gap-1.5 ${align === "center" ? "items-center" : "items-start"} ${className}`} data-free-test={test}>
      <Link
        href={HREF[test]}
        className={`inline-flex min-h-12 items-center justify-center gap-2.5 bg-[#0F766E] px-6 py-3 text-[15.5px] font-semibold text-white transition-colors hover:bg-[#115E59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${rounded}`}
      >
        <span className="rounded-full bg-white px-2 py-0.5 text-[11.5px] font-extrabold uppercase leading-none tracking-[0.04em] text-[#0F766E]">{BADGE[lang]}</span>
        {LABELS[test][lang]}
        <span aria-hidden="true">→</span>
      </Link>
      <span className={`text-[13px] ${timeTone === "dark" ? "text-[#AEB2C8]" : "text-ink-dim"}`}>{TIME[lang]}</span>
    </span>
  );
}
