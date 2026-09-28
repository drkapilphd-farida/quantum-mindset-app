import type { AssessmentRecord } from './assessmentTypes'

// Share card (Phase 8, Item 11), drawn in the browser on a canvas so Hindi
// (Devanagari) names and labels are shaped correctly — the server image
// renderer can't join Devanagari letters. Uses the fonts the site already
// embeds (Inter + Noto Sans Devanagari). First name and Day 1 → Day 30
// numbers only; never contact details.

export type ShareCardLabels = {
  program: string
  heading: (firstName: string | null) => string
  rows: { wpm: string; comprehension: string; effective: string; accuracy: string }
  disclaimer: string
}

const SIZE = 1080

function fontStack(): string {
  const style = getComputedStyle(document.documentElement)
  const latin = style.getPropertyValue('--font-homepage-sans').trim()
  const devanagari = style.getPropertyValue('--font-homepage-devanagari').trim()
  return [latin, devanagari, '"Noto Sans Devanagari"', 'sans-serif'].filter((part) => part !== '').join(', ')
}

export async function drawShareCard(
  canvas: HTMLCanvasElement,
  { firstName, day1, day30, labels }: { firstName: string | null; day1: AssessmentRecord; day30: AssessmentRecord; labels: ShareCardLabels },
): Promise<void> {
  const stack = fontStack()
  // Make sure both scripts' fonts are loaded before drawing.
  await Promise.all([document.fonts.load(`700 56px ${stack}`, 'Aa अआ'), document.fonts.load(`400 36px ${stack}`, 'Aa अआ')])

  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (ctx === null) return

  ctx.fillStyle = '#0b0f17'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = '#d4af37'
  ctx.font = `600 28px ${stack}`
  ctx.fillText('MIND UR MIND', 72, 120)

  ctx.fillStyle = '#edeef3'
  ctx.font = `700 56px ${stack}`
  ctx.fillText(labels.program, 72, 200, SIZE - 144)

  ctx.fillStyle = '#9ca3b8'
  ctx.font = `400 36px ${stack}`
  ctx.fillText(labels.heading(firstName), 72, 262, SIZE - 144)

  const rows: [string, string, string][] = [
    [labels.rows.wpm, `${day1.wpm}`, `${day30.wpm}`],
    [labels.rows.comprehension, `${day1.comprehensionPercent}%`, `${day30.comprehensionPercent}%`],
    [labels.rows.effective, `${day1.effectiveWpm}`, `${day30.effectiveWpm}`],
    [labels.rows.accuracy, `${day1.attentionAccuracyPercent}%`, `${day30.attentionAccuracyPercent}%`],
  ]
  let y = 400
  for (const [label, from, to] of rows) {
    ctx.fillStyle = '#9ca3b8'
    ctx.font = `400 36px ${stack}`
    ctx.textAlign = 'left'
    ctx.fillText(label, 72, y, 560)

    ctx.textAlign = 'right'
    ctx.fillStyle = '#d4af37'
    ctx.font = `700 40px ${stack}`
    ctx.fillText(to, SIZE - 72, y)
    const toWidth = ctx.measureText(to).width
    ctx.fillStyle = '#edeef3'
    ctx.font = `400 40px ${stack}`
    ctx.fillText(`${from} → `, SIZE - 72 - toWidth, y)

    ctx.strokeStyle = '#2a3142'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(72, y + 34)
    ctx.lineTo(SIZE - 72, y + 34)
    ctx.stroke()
    y += 118
  }

  ctx.textAlign = 'left'
  ctx.fillStyle = '#8a93a8'
  ctx.font = `400 24px ${stack}`
  ctx.fillText(`${labels.disclaimer} · mindurmind.org.in`, 72, SIZE - 72, SIZE - 144)
}
