"use client";

import { useEffect, useRef, useState } from "react";
import { NeuralOrb } from "./NeuralOrb";

// A real, interactive 3D brain for the hero (owner, 23 Nov 2026): a glowing
// point-cloud brain with neural connections and travelling signals. Drag (or
// swipe) to turn it; it turns slowly by itself. Three labelled regions —
// Focus, Memory, Calm — light up on hover or tap.
//
// Performance: three.js is loaded only after the page has painted and only
// when the hero is on screen; rendering pauses when it scrolls away or the
// tab is hidden. Phones without WebGL, low-memory devices and "reduce
// motion" get the light CSS orb instead.

type Lang = "en" | "hi";
type RegionId = "focus" | "memory" | "calm";

const REGIONS: { id: RegionId; color: [number, number, number]; anchor: [number, number, number]; label: { en: string; hi: string }; line: { en: string; hi: string } }[] = [
  { id: "focus", color: [0.3, 0.5, 1], anchor: [0.2, 0.3, 1.0], label: { en: "Focus", hi: "फ़ोकस" }, line: { en: "Sharp Brain", hi: "Sharp Brain" } },
  { id: "memory", color: [0.1, 0.9, 0.72], anchor: [0.85, -0.2, -0.2], label: { en: "Memory", hi: "याददाश्त" }, line: { en: "Sharp Brain", hi: "Sharp Brain" } },
  { id: "calm", color: [0.8, 0.45, 1], anchor: [-0.3, 0.82, -0.25], label: { en: "Calm", hi: "शांति" }, line: { en: "Online Retreat", hi: "ऑनलाइन रिट्रीट" } },
];

const TEST_HREF: Record<Lang, string> = { en: "/reading-memory-test", hi: "/reading-memory-test?lang=hi" };

function regionOf(_x: number, y: number, z: number): RegionId {
  if (z > 0.28) return "focus";
  if (y > 0.3) return "calm";
  return "memory";
}

/** Deterministic pseudo-random numbers, so the brain looks the same on every visit. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function buildBrain(count: number): { positions: Float32Array; regions: RegionId[] } {
  const rand = rng(7);
  const positions = new Float32Array(count * 3);
  const regions: RegionId[] = [];
  for (let n = 0; n < count; n += 1) {
    const u = rand() * 2 - 1;
    const t = rand() * Math.PI * 2;
    const r0 = Math.sqrt(1 - u * u);
    let x = r0 * Math.cos(t);
    let y = u;
    let z = r0 * Math.sin(t);
    const part = n / count;
    if (part > 0.95) {
      // Brain stem: a short column under the middle.
      const a = rand() * Math.PI * 2;
      const h = rand();
      x = Math.cos(a) * 0.12;
      z = Math.sin(a) * 0.12 - 0.25;
      y = -0.45 - h * 0.55;
    } else if (part > 0.86) {
      // Cerebellum: a small lobe low at the back.
      x *= 0.62;
      y = y * 0.26 - 0.52;
      z = z * 0.36 - 0.86;
    } else {
      // Two hemispheres with a clear middle gap.
      const side = x >= 0 ? 1 : -1;
      x = side * (0.1 + Math.abs(x) * 0.9);
      // Temporal lobes bulge out at the sides, a little low.
      if (y < 0.05 && Math.abs(z) < 0.55) x *= 1.08;
      // Folds (gyri): fine, brain-like wrinkles.
      const fold = 1 + 0.07 * Math.sin(11 * y + 6 * z + 2 * x) * Math.cos(9 * z - 5 * y);
      x *= 0.72 * fold;
      y *= 0.8 * fold;
      z *= 1.18 * fold;
      // Flatter underside, a bit taller at the back of the top.
      if (y < -0.36) y = -0.36 + (y + 0.36) * 0.3;
      y += 0.06 * Math.max(0, -z);
    }
    positions[n * 3] = x;
    positions[n * 3 + 1] = y;
    positions[n * 3 + 2] = z;
    regions.push(part > 0.86 ? "memory" : regionOf(x, y, z));
  }
  return { positions, regions };
}

function canUseWebGl(): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (memory !== undefined && memory <= 2) return false;
    const canvas = document.createElement("canvas");
    return canvas.getContext("webgl2") !== null || canvas.getContext("webgl") !== null;
  } catch {
    return false;
  }
}

export function Brain3D({ lang, className = "", showLabels = true }: { lang: Lang; className?: string; showLabels?: boolean }): React.JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<RegionId, HTMLButtonElement | null>>({ focus: null, memory: null, calm: null });
  const highlightRef = useRef<RegionId | null>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");
  const [active, setActive] = useState<RegionId | null>(null);
  const [woken, setWoken] = useState<RegionId[]>([]);
  const awakeRef = useRef(false);
  const onWakeRef = useRef<(id: RegionId) => void>(() => {});
  onWakeRef.current = (id: RegionId): void => {
    setWoken((w) => (w.includes(id) ? w : [...w, id]));
  };
  const allAwake = woken.length === REGIONS.length;
  useEffect(() => {
    awakeRef.current = allAwake;
  }, [allAwake]);

  useEffect(() => {
    highlightRef.current = active;
  }, [active]);

  useEffect(() => {
    setMode(canUseWebGl() ? "webgl" : "fallback");
  }, []);

  useEffect(() => {
    if (mode !== "webgl") return;
    const wrap = wrapRef.current;
    if (wrap === null) return;
    let disposed = false;
    let cleanup = (): void => {};

    const start = async (): Promise<void> => {
      const THREE = await import("three");
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.style.cursor = "grab";
      wrap.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0.1, 3.9);

      const group = new THREE.Group();
      group.rotation.set(0.18, -0.6, 0);
      scene.add(group);

      // Soft round glow sprite for the points.
      const dot = document.createElement("canvas");
      dot.width = 64;
      dot.height = 64;
      const ctx = dot.getContext("2d");
      if (ctx !== null) {
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.35, "rgba(255,255,255,0.65)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
      }
      const dotTexture = new THREE.CanvasTexture(dot);

      const COUNT = window.innerWidth < 640 ? 900 : 1500;
      const { positions, regions } = buildBrain(COUNT);
      const colors = new Float32Array(COUNT * 3);
      const regionColor = (id: RegionId): [number, number, number] => REGIONS.find((r) => r.id === id)?.color ?? [1, 1, 1];
      // Per-point extra glow from taps (fades out), and the all-awake gold mode.
      const glow = new Float32Array(COUNT);
      const paint = (highlight: RegionId | null, gold: number): void => {
        for (let i = 0; i < COUNT; i += 1) {
          const id = regions[i] ?? "memory";
          const [r, g, b] = regionColor(id);
          const k = highlight === null ? 0.85 : highlight === id ? 1.35 : 0.35;
          const gl = glow[i] ?? 0;
          // Blend towards warm gold when the whole brain is awake.
          const cr = r * (1 - gold) + 1.0 * gold;
          const cg = g * (1 - gold) + 0.74 * gold;
          const cb = b * (1 - gold) + 0.32 * gold;
          colors[i * 3] = cr * k + gl;
          colors[i * 3 + 1] = cg * k + gl * 0.85;
          colors[i * 3 + 2] = cb * k + gl * 0.5;
        }
      };
      paint(null, 0);

      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const colorAttr = new THREE.BufferAttribute(colors, 3);
      pointsGeo.setAttribute("color", colorAttr);
      const pointsMat = new THREE.PointsMaterial({ size: 0.062, map: dotTexture, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
      group.add(new THREE.Points(pointsGeo, pointsMat));

      // Neural connections: each point to its 2 nearest neighbours (within reach).
      const segs: number[] = [];
      const segColors: number[] = [];
      const pairs: [number, number][] = [];
      for (let i = 0; i < COUNT; i += 1) {
        let best1 = -1;
        let best2 = -1;
        let d1 = 0.05;
        let d2 = 0.05;
        const ax = positions[i * 3] ?? 0;
        const ay = positions[i * 3 + 1] ?? 0;
        const az = positions[i * 3 + 2] ?? 0;
        for (let j = i + 1; j < COUNT; j += 1) {
          const dx = (positions[j * 3] ?? 0) - ax;
          const dy = (positions[j * 3 + 1] ?? 0) - ay;
          const dz = (positions[j * 3 + 2] ?? 0) - az;
          const d = dx * dx + dy * dy + dz * dz;
          if (d < d1) {
            d2 = d1;
            best2 = best1;
            d1 = d;
            best1 = j;
          } else if (d < d2) {
            d2 = d;
            best2 = j;
          }
        }
        for (const j of [best1, best2]) {
          if (j < 0) continue;
          segs.push(ax, ay, az, positions[j * 3] ?? 0, positions[j * 3 + 1] ?? 0, positions[j * 3 + 2] ?? 0);
          const [cr, cg, cb] = regionColor(regions[i] ?? "memory");
          segColors.push(cr, cg, cb, cr, cg, cb);
          pairs.push([i, j]);
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(segs, 3));
      lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(segColors, 3));
      const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
      group.add(new THREE.LineSegments(lineGeo, lineMat));

      // Travelling signals along random connections.
      const PULSES = Math.min(70, pairs.length);
      const pulsePos = new Float32Array(PULSES * 3);
      const pulseState = Array.from({ length: PULSES }, (_, k) => ({ pair: pairs[(k * 97) % pairs.length] ?? [0, 0], t: (k % 10) / 10, speed: 0.6 + ((k * 13) % 10) / 12 }));
      const pulseGeo = new THREE.BufferGeometry();
      const pulseAttr = new THREE.BufferAttribute(pulsePos, 3);
      pulseGeo.setAttribute("position", pulseAttr);
      const pulseMat = new THREE.PointsMaterial({ size: 0.11, map: dotTexture, color: 0xffc46b, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      group.add(new THREE.Points(pulseGeo, pulseMat));

      // Size.
      const resize = (): void => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(wrap);

      // Drag to turn.
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let velX = 0;
      let velY = 0;
      const el = renderer.domElement;
      let downX = 0;
      let downY = 0;
      let moved = 0;
      const down = (e: PointerEvent): void => {
        dragging = true;
        downX = e.clientX;
        downY = e.clientY;
        moved = 0;
        lastX = e.clientX;
        lastY = e.clientY;
        el.style.cursor = "grabbing";
      };
      const move = (e: PointerEvent): void => {
        if (!dragging) return;
        moved = Math.max(moved, Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY));
        velY = (e.clientX - lastX) * 0.006;
        velX = (e.clientY - lastY) * 0.004;
        lastX = e.clientX;
        lastY = e.clientY;
      };
      // A tap (not a drag) lights up the neurons under the finger.
      const tapAt = (clientX: number, clientY: number): void => {
        const rect = el.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;
        group.updateMatrixWorld();
        let best = -1;
        let bestD = 46 * 46;
        for (let i = 0; i < COUNT; i += 1) {
          tmp.set(positions[i * 3] ?? 0, positions[i * 3 + 1] ?? 0, positions[i * 3 + 2] ?? 0).applyMatrix4(group.matrixWorld);
          if (tmp.z < -0.15) continue; // back side
          tmp.project(camera);
          const sx = ((tmp.x + 1) / 2) * rect.width;
          const sy = ((1 - tmp.y) / 2) * rect.height;
          const d = (sx - px) ** 2 + (sy - py) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        if (best < 0) return;
        const cx = positions[best * 3] ?? 0;
        const cy = positions[best * 3 + 1] ?? 0;
        const cz = positions[best * 3 + 2] ?? 0;
        for (let i = 0; i < COUNT; i += 1) {
          const d = Math.hypot((positions[i * 3] ?? 0) - cx, (positions[i * 3 + 1] ?? 0) - cy, (positions[i * 3 + 2] ?? 0) - cz);
          if (d < 0.45) glow[i] = Math.max(glow[i] ?? 0, 1.6 * (1 - d / 0.45));
        }
        // Send a burst of signals along the links around the tapped neuron.
        const near: [number, number][] = [];
        for (const pair of pairs) {
          if ((glow[pair[0]] ?? 0) > 0.6) near.push(pair);
          if (near.length >= 18) break;
        }
        near.forEach((pair, k) => {
          const p = pulseState[k];
          if (p === undefined) return;
          p.pair = pair;
          p.t = 0;
        });
        onWakeRef.current(regions[best] ?? "memory");
      };
      const tmp = new THREE.Vector3();
      const up = (e: PointerEvent): void => {
        if (dragging && moved < 8 && e.target === el) tapAt(e.clientX, e.clientY);
        dragging = false;
        el.style.cursor = "grab";
      };
      el.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);

      // Run only while on screen and the tab is visible.
      let visible = true;
      const io = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
      });
      io.observe(wrap);

      const v = new THREE.Vector3();
      let painted: RegionId | null = null;
      let gold = 0;
      let wasGlowing = false;
      let last = performance.now();
      let raf = 0;
      const tick = (now: number): void => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) {
          last = now;
          return;
        }
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        group.rotation.y += velY + (dragging ? 0 : dt * 0.22);
        group.rotation.x = Math.max(-0.6, Math.min(0.8, group.rotation.x + velX));
        velX *= 0.9;
        velY *= 0.92;
        group.position.y = Math.sin(now / 1600) * 0.04;

        const highlight = highlightRef.current;
        const goldTarget = awakeRef.current ? 1 : 0;
        gold += (goldTarget - gold) * Math.min(1, dt * 1.5);
        let glowing = false;
        for (let i = 0; i < COUNT; i += 1) {
          const gl = glow[i] ?? 0;
          if (gl > 0.01) {
            glow[i] = gl * (1 - dt * 1.6);
            glowing = true;
          } else if (gl !== 0) {
            glow[i] = 0;
          }
        }
        if (highlight !== painted || glowing || Math.abs(goldTarget - gold) > 0.005 || wasGlowing) {
          paint(highlight, gold);
          colorAttr.needsUpdate = true;
          painted = highlight;
        }
        wasGlowing = glowing;
        pulseMat.size = 0.11 + gold * 0.05;
        lineMat.color.setRGB(1, 1 - 0.15 * gold, 1 - 0.65 * gold);
        lineMat.opacity = 0.28 + 0.14 * gold;

        for (let k = 0; k < PULSES; k += 1) {
          const p = pulseState[k];
          if (p === undefined) continue;
          p.t += dt * p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.pair = pairs[Math.floor(Math.random() * pairs.length)] ?? p.pair;
          }
          const [a, b] = p.pair;
          for (let c = 0; c < 3; c += 1) pulsePos[k * 3 + c] = (positions[a * 3 + c] ?? 0) * (1 - p.t) + (positions[b * 3 + c] ?? 0) * p.t;
        }
        pulseAttr.needsUpdate = true;

        renderer.render(scene, camera);

        // Place the HTML labels over their regions (hidden when facing away).
        const rect = { w: wrap.clientWidth, h: wrap.clientHeight };
        for (const region of REGIONS) {
          const label = labelRefs.current[region.id];
          if (label === null) continue;
          v.set(region.anchor[0], region.anchor[1], region.anchor[2]);
          group.localToWorld(v);
          const facing = v.z > -0.2;
          v.project(camera);
          label.style.transform = `translate(-50%, -50%) translate(${((v.x + 1) / 2) * rect.w}px, ${((1 - v.y) / 2) * rect.h}px)`;
          label.style.opacity = facing ? "1" : "0.25";
        }
      };
      raf = requestAnimationFrame(tick);

      cleanup = (): void => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        el.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        pointsGeo.dispose();
        pointsMat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        pulseGeo.dispose();
        pulseMat.dispose();
        dotTexture.dispose();
        renderer.dispose();
        el.remove();
      };
    };

    // Start after the page has painted, so the hero text appears first.
    const handle = globalThis.setTimeout(() => {
      void start().catch(() => setMode("fallback"));
    }, 600);
    return () => {
      disposed = true;
      globalThis.clearTimeout(handle);
      cleanup();
    };
  }, [mode]);

  if (mode === "fallback") {
    return (
      <div className={`absolute ${className}`}>
        <NeuralOrb className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.65] sm:scale-75" />
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={`absolute ${className}`} data-brain-3d>
      {showLabels &&
        REGIONS.map((region) => {
          const on = active === region.id;
          const [r, g, b] = region.color;
          const rgb = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
          return (
            <button
              key={region.id}
              ref={(node) => {
                labelRefs.current[region.id] = node;
              }}
              type="button"
              onPointerEnter={() => setActive(region.id)}
              onPointerLeave={() => setActive(null)}
              onClick={() => {
                setActive((a) => (a === region.id ? null : region.id));
                onWakeRef.current(region.id);
              }}
              className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full bg-[#071230]/70 py-1.5 pl-2 pr-3.5 text-left text-white shadow-lg ring-1 backdrop-blur transition-[opacity,box-shadow] duration-200"
              style={{ opacity: 0, boxShadow: on ? `0 0 24px ${rgb}` : undefined, ["--tw-ring-color" as string]: `${rgb}88` }}
              aria-pressed={on}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: rgb, boxShadow: `0 0 10px ${rgb}` }} aria-hidden="true" />
              <span>
                <span className="block text-[13.5px] font-extrabold leading-tight">{region.label[lang]}</span>
                {on && <span className="block text-[11.5px] leading-tight text-white/75">{region.line[lang]}</span>}
              </span>
            </button>
          );
        })}
      {showLabels && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-2 text-center" data-brain-game>
          {allAwake ? (
            <a
              href={TEST_HREF[lang]}
              className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[14.5px] font-extrabold text-[#1B1508] shadow-[0_0_30px_rgba(246,178,78,0.65)]"
              data-brain-cta
            >
              {lang === "hi" ? "🧠✨ दिमाग़ जाग गया! मुफ़्त Brain Test दीजिए →" : "🧠✨ Brain awake! Take the free Brain Test →"}
            </a>
          ) : (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/80">
                {lang === "hi" ? "दिमाग़ को छूकर जगाइए · घुमाइए" : "Tap the brain to wake it · drag to turn"}
              </p>
              <ul className="flex gap-1.5">
                {REGIONS.map((region) => {
                  const on = woken.includes(region.id);
                  const [r, g, b] = region.color;
                  const rgb = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
                  return (
                    <li key={region.id} className="flex items-center gap-1.5 rounded-full bg-[#071230]/60 px-2.5 py-1 text-[12px] font-bold text-white ring-1 ring-white/15">
                      <span className="h-2 w-2 rounded-full" style={{ background: on ? rgb : "transparent", border: `1.5px solid ${rgb}`, boxShadow: on ? `0 0 8px ${rgb}` : undefined }} aria-hidden="true" />
                      {region.label[lang]}
                      {on && <span aria-hidden="true">✓</span>}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
