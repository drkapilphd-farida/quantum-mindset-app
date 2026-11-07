"use client";

import { useEffect, useState } from "react";

// Phones only: full-width amber bar to the booking form; hidden while the
// booking form (#book) is on screen.
export function StickyBookBar({ href, label }: { href: string; label: string }): React.JSX.Element | null {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const target = document.getElementById("book");
    if (target === null) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry?.isIntersecting ?? false), { threshold: 0.05 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  if (hidden) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E39A2A] bg-[#F2A93B] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden" data-sticky-book>
      <a href={href} className="flex min-h-12 w-full items-center justify-center rounded-[10px] text-[17px] font-extrabold text-[#0E1B2C]">
        {label}
      </a>
    </div>
  );
}
