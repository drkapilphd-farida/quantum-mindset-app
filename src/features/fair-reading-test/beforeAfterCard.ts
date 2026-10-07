// The 30-day before/after share card: a 1080×1350 PNG drawn in the browser
// (no server, no stored image). First name only — no email, no full name.

export type BeforeAfterRow = { label: string; before: string; after: string; change: string }

export type BeforeAfterCardInput = {
  brand: string
  title: string
  firstName: string
  beforeLabel: string
  afterLabel: string
  rows: readonly BeforeAfterRow[]
  footnote: string
}

const W = 1080
const H = 1350

export async function drawBeforeAfterCard(input: BeforeAfterCardInput): Promise<Blob> {
  const family = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif'
  try {
    await document.fonts.load(`700 56px ${family}`, `${input.title} ${input.firstName} ${input.rows.map((r) => r.label).join(' ')}`)
  } catch {
    // The browser's fallback font still renders the card.
  }
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (ctx === null) throw new Error('canvas unavailable')

  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#1B1508')
  bg.addColorStop(1, '#3A2A0C')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#D9A84E'
  ctx.lineWidth = 6
  ctx.strokeRect(48, 48, W - 96, H - 96)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#D9A84E'
  ctx.font = `600 36px ${family}`
  ctx.fillText(input.brand, W / 2, 150)
  ctx.fillStyle = '#F5F1E6'
  ctx.font = `700 60px ${family}`
  ctx.fillText(input.title, W / 2, 240)
  if (input.firstName) {
    ctx.font = `400 44px ${family}`
    ctx.fillText(input.firstName, W / 2, 310)
  }

  ctx.font = `600 34px ${family}`
  ctx.fillStyle = '#AEB2C8'
  ctx.fillText(input.beforeLabel, 420, 410)
  ctx.fillText(input.afterLabel, 660, 410)

  input.rows.forEach((row, i) => {
    const y = 520 + i * 230
    ctx.textAlign = 'left'
    ctx.fillStyle = '#F5F1E6'
    ctx.font = `600 38px ${family}`
    ctx.fillText(row.label, 110, y)
    ctx.textAlign = 'center'
    ctx.font = `700 64px ${family}`
    ctx.fillStyle = '#AEB2C8'
    ctx.fillText(row.before, 420, y + 90)
    ctx.fillStyle = '#F5F1E6'
    ctx.fillText(row.after, 660, y + 90)
    ctx.fillStyle = row.change.startsWith('+') ? '#7CD992' : '#AEB2C8'
    ctx.font = `700 48px ${family}`
    ctx.fillText(row.change, 890, y + 90)
  })

  ctx.textAlign = 'center'
  ctx.fillStyle = '#AEB2C8'
  ctx.font = `400 28px ${family}`
  ctx.fillText(input.footnote, W / 2, H - 110)

  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png'))
}
