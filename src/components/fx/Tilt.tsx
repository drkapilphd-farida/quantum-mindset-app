"use client";

import { useRef } from "react";

// A card that tilts towards the pointer in 3D, with a soft light glare
// (owner, 23 Nov 2026: "3D look, people should interact"). Mouse/pen only —
// on touch screens and with reduced motion it stays still.
export function Tilt({ children, className = "", max = 7 }: { children: React.ReactNode; className?: string; max?: number }): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(event: React.PointerEvent<HTMLDivElement>): void {
    const el = ref.current;
    if (el === null || event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width;
    const y = (event.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
    el.style.setProperty("--glare", "1");
  }

  function onLeave(): void {
    const el = ref.current;
    if (el === null) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glare", "0");
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`fx-tilt ${className}`}>
      {children}
      <span className="fx-tilt-glare" aria-hidden="true" />
    </div>
  );
}
