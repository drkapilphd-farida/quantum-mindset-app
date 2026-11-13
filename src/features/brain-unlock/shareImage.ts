// The shareable Brain Unlock card (1080 × 1350 PNG, drawn in the browser):
// Brain Type, score, the three before → after cards and Mind Ur Mind branding.
// Real numbers only — the same ones the report shows.

export type ShareCardData = {
  title: string;
  typeEmoji: string;
  typeName: string;
  typeLine: string;
  scoreLabel: string;
  score: number;
  cards: { colour: string; label: string; value: string }[];
  footer: string;
  url: string;
};

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line === "" ? w : `${line} ${w}`;
    if (ctx.measureText(next).width > maxWidth && line !== "") {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line !== "") lines.push(line);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function drawBrainUnlockCard(d: ShareCardData): Promise<Blob> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (ctx === null) throw new Error("canvas unavailable");
  const font = (size: number, weight = 700): string =>
    `${weight} ${size}px "Baloo 2", "Noto Sans Devanagari", "Noto Sans", system-ui, sans-serif`;
  try {
    await document.fonts.ready;
  } catch {
    // system fonts are fine
  }

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#1e1b4b");
  bg.addColorStop(1, "#312e81");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#fde68a";
  ctx.font = font(44);
  ctx.textAlign = "center";
  ctx.fillText(d.title, W / 2, 110);

  ctx.font = font(150, 400);
  ctx.fillText(d.typeEmoji, W / 2, 300);
  ctx.fillStyle = "#ffffff";
  ctx.font = font(84);
  ctx.fillText(d.typeName, W / 2, 410);
  ctx.font = font(36, 500);
  ctx.fillStyle = "#e0e7ff";
  wrap(ctx, d.typeLine, 900).forEach((l, i) =>
    ctx.fillText(l, W / 2, 470 + i * 48),
  );

  ctx.fillStyle = "#fde68a";
  ctx.font = font(40);
  ctx.fillText(`${d.scoreLabel}: ${d.score}/100`, W / 2, 610);

  const top = 670;
  const h = 150;
  d.cards.forEach((card, i) => {
    const y = top + i * (h + 24);
    roundRect(ctx, 90, y, W - 180, h, 32);
    ctx.fillStyle = card.colour;
    ctx.fill();
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = font(34, 600);
    ctx.fillText(card.label, 130, y + 56);
    ctx.font = font(56);
    ctx.fillText(card.value, 130, y + 120);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#c7d2fe";
  ctx.font = font(32, 600);
  ctx.fillText(d.footer, W / 2, H - 110);
  ctx.fillStyle = "#fde68a";
  ctx.font = font(34);
  ctx.fillText(d.url, W / 2, H - 60);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b === null ? reject(new Error("no image")) : resolve(b)),
      "image/png",
    ),
  );
}
