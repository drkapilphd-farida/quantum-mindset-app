"use client";

import { useEffect, useRef } from "react";

// Fades and lifts its content in when it scrolls into view.
export function Reveal({ children, className = "", delayMs = 0 }: { children: React.ReactNode; className?: string; delayMs?: number }): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el === null) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("fx-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => el.classList.add("fx-in"), delayMs);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delayMs]);
  return (
    <div ref={ref} className={`fx-reveal ${className}`}>
      {children}
    </div>
  );
}
