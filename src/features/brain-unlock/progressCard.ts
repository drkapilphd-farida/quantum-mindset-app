import type { ProgressFacts, SkillFacts } from "./progress";

// The result card that goes to WhatsApp (founder, 25 Nov 2026): 1080 × 1080
// JPEG drawn in the browser (Hindi shapes correctly here, not on a server).
// The person's name, today's date, each skill's before → after, and what is
// still left when they stopped half-way. Real numbers only.

type Lang = "en" | "hi";

const T = {
  en: {
    brand: "🧠 Sharp Brain™ · Brain Test",
    title: (n: string | null) => (n !== null ? `${n}'s Brain Report` : "Your Brain Report"),
    speed: "Reading speed",
    memory: "Memory",
    focus: "Focus",
    wpm: "words/min",
    left: "Not done yet",
    afterLeft: "after technique: left",
    notCounted: "new speed not counted",
    faster: "faster",
    allDone: "✅ All 3 done — your brain changed in minutes",
    partDone: (k: number) => `${k} of 3 done — finish the rest in 2 minutes`,
    sign: "Dr. Kapil Dev Sharma · mindurmind.org.in",
  },
  hi: {
    brand: "🧠 Sharp Brain™ · Brain Test",
    title: (n: string | null) => (n !== null ? `${n} जी का Brain Report` : "आपका Brain Report"),
    speed: "पढ़ने की speed",
    memory: "याददाश्त",
    focus: "Focus",
    wpm: "शब्द/मिनट",
    left: "अभी बाकी",
    afterLeft: "technique के बाद: बाकी",
    notCounted: "नई speed नहीं गिनी",
    faster: "तेज़",
    allDone: "✅ तीनों पूरे — कुछ ही मिनट में दिमाग़ बदला",
    partDone: (k: number) => `3 में से ${k} पूरे — बाकी 2 मिनट में पूरा करें`,
    sign: "Dr. Kapil Dev Sharma · mindurmind.org.in",
  },
} as const;

type Row = {
  emoji: string;
  label: string;
  main: string;
  badge: string | null;
  good: boolean;
  pending: boolean;
};

export function cardRows(f: ProgressFacts, lang: Lang): Row[] {
  const t = T[lang];
  const pending = (emoji: string, label: string): Row => ({
    emoji, label, main: t.left, badge: null, good: false, pending: true,
  });
  const half = (emoji: string, label: string, before: string): Row => ({
    emoji, label, main: `${before} → ?`, badge: t.afterLeft, good: false, pending: false,
  });
  const rows: Row[] = [];
  const s: SkillFacts | undefined = f.speed;
  if (s === undefined) rows.push(pending("⚡", t.speed));
  else if (s.after === undefined) rows.push(half("⚡", t.speed, `${s.before}`));
  else if (s.counted !== true)
    rows.push({ emoji: "⚡", label: t.speed, main: `${s.before} ${t.wpm}`, badge: t.notCounted, good: false, pending: false });
  else {
    const p = s.before > 0 ? Math.round(((s.after - s.before) / s.before) * 100) : 0;
    rows.push({
      emoji: "⚡", label: t.speed, main: `${s.before} → ${s.after} ${t.wpm}`,
      badge: p > 0 ? `+${p}%` : null, good: p > 0, pending: false,
    });
  }
  const m = f.memory;
  if (m === undefined) rows.push(pending("🧠", t.memory));
  else if (m.after === undefined) rows.push(half("🧠", t.memory, `${m.before}/5`));
  else
    rows.push({
      emoji: "🧠", label: t.memory, main: `${m.before}/5 → ${m.after}/5`,
      badge: m.after > m.before ? `+${m.after - m.before}` : null, good: m.after > m.before, pending: false,
    });
  const fo = f.focus;
  if (fo === undefined) rows.push(pending("🎯", t.focus));
  else if (fo.after === undefined) rows.push(half("🎯", t.focus, `${fo.before}s`));
  else
    rows.push({
      emoji: "🎯", label: t.focus, main: `${fo.before}s → ${fo.after}s`,
      badge: fo.after < fo.before ? `${Math.round((fo.before - fo.after) * 10) / 10}s ${t.faster}` : null, good: fo.after < fo.before, pending: false,
    });
  return rows;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number, size: number, weight: number): void {
  let s = size;
  ctx.font = font(s, weight);
  while (ctx.measureText(text).width > max && s > 24) {
    s -= 2;
    ctx.font = font(s, weight);
  }
}
const font = (size: number, weight = 700): string =>
  `${weight} ${size}px "Baloo 2", "Noto Sans Devanagari", "Noto Sans", system-ui, sans-serif`;

/** JPEG data URL of the card (null when the browser can't draw it). */
export async function drawProgressCard(input: {
  facts: ProgressFacts;
  phasesDone: number;
  lang: Lang;
  firstName: string | null;
  photo?: string;
}): Promise<string | null> {
  try {
    const t = T[input.lang];
    const W = 1080;
    const H = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (ctx === null) return null;
    try {
      await document.fonts.ready;
    } catch {
      // system fonts are fine
    }
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b1530");
    bg.addColorStop(1, "#16254d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffc400";
    ctx.font = font(36, 700);
    ctx.fillText(t.brand, 70, 100);

    ctx.fillStyle = "#ffffff";
    fit(ctx, t.title(input.firstName), W - 140, 68, 800);
    ctx.fillText(t.title(input.firstName), 70, 190);

    ctx.fillStyle = "#9fb0d6";
    ctx.font = font(32, 500);
    ctx.fillText(
      new Date().toLocaleDateString(input.lang === "hi" ? "hi-IN" : "en-IN", {
        day: "numeric", month: "long", year: "numeric",
      }),
      70, 245,
    );

    const rows = cardRows(input.facts, input.lang);
    rows.forEach((r, i) => {
      const y = 290 + i * 180;
      roundRect(ctx, 60, y, W - 120, 155, 28);
      ctx.fillStyle = r.pending ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.10)";
      ctx.fill();
      ctx.fillStyle = r.pending ? "#7f8fb5" : "#c9d5f2";
      ctx.font = font(34, 600);
      ctx.fillText(`${r.emoji}  ${r.label}`, 95, y + 55);
      ctx.fillStyle = r.pending ? "#7f8fb5" : "#ffffff";
      fit(ctx, r.main, r.badge !== null ? W - 460 : W - 220, 56, 800);
      ctx.fillText(r.main, 95, y + 125);
      if (r.badge !== null) {
        ctx.font = font(r.good ? 48 : 28, 800);
        const bw = Math.min(ctx.measureText(r.badge).width + 50, 330);
        const bx = W - 95 - bw;
        roundRect(ctx, bx, y + 70, bw, 66, 33);
        ctx.fillStyle = r.good ? "#22c55e" : "rgba(255,255,255,0.12)";
        ctx.fill();
        ctx.fillStyle = r.good ? "#05250f" : "#c9d5f2";
        ctx.textAlign = "center";
        fit(ctx, r.badge, bw - 30, r.good ? 48 : 28, 800);
        ctx.fillText(r.badge, bx + bw / 2, y + 118);
        ctx.textAlign = "left";
      }
    });

    const done = Math.floor(input.phasesDone / 2);
    const banner = input.phasesDone >= 6 ? t.allDone : t.partDone(done);
    roundRect(ctx, 60, 840, W - 120, 80, 40);
    ctx.fillStyle = input.phasesDone >= 6 ? "#ffc400" : "rgba(255,196,0,0.18)";
    ctx.fill();
    ctx.fillStyle = input.phasesDone >= 6 ? "#1a1300" : "#ffc400";
    ctx.textAlign = "center";
    fit(ctx, banner, W - 180, 36, 800);
    ctx.fillText(banner, W / 2, 893);
    ctx.textAlign = "left";

    const photo = await loadImage(input.photo ?? "/images/bt2-dr-kapil.jpg");
    if (photo !== null) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(110, 1000, 44, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(photo, 66, 956, 88, 88);
      ctx.restore();
    }
    ctx.fillStyle = "#c9d5f2";
    ctx.font = font(32, 600);
    ctx.fillText(t.sign, photo !== null ? 175 : 70, 1012);

    return canvas.toDataURL("image/jpeg", 0.86);
  } catch {
    return null;
  }
}
