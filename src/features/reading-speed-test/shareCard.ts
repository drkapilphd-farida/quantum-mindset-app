// Share card for a Reading Speed Test result: a 1080×1080 PNG drawn in the
// browser (no server, no stored image). Uses the page's own font stack so
// Hindi renders with the site's Devanagari font once it has loaded.

export type ShareCardInput = {
  heading: string
  line: string
  ask: string
  effectiveWpm: number
  wpmLabel: string
  comprehension: string
  profileName: string
  url: string
}

const SIZE = 1080

function fontStack(): string {
  return getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif'
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/u)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line === '' ? word : `${line} ${word}`
    if (ctx.measureText(next).width > maxWidth && line !== '') {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line !== '') lines.push(line)
  return lines
}

export async function drawShareCard(input: ShareCardInput): Promise<Blob> {
  const family = fontStack()
  const sample = `${input.heading} ${input.line} ${input.profileName}`
  try {
    await Promise.all([document.fonts.load(`700 64px ${family}`, sample), document.fonts.load(`400 40px ${family}`, sample)])
  } catch {
    // Fonts not available — the browser's fallback still renders the card.
  }

  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (ctx === null) throw new Error('canvas unavailable')

  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE)
  bg.addColorStop(0, '#1B1508')
  bg.addColorStop(1, '#3A2A0C')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.strokeStyle = '#D9A84E'
  ctx.lineWidth = 6
  ctx.strokeRect(48, 48, SIZE - 96, SIZE - 96)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#D9A84E'
  ctx.font = `600 40px ${family}`
  ctx.fillText(input.heading, SIZE / 2, 170)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = `800 230px ${family}`
  ctx.fillText(String(input.effectiveWpm), SIZE / 2, 450)
  ctx.font = `600 44px ${family}`
  ctx.fillStyle = '#E8DCC2'
  ctx.fillText(input.wpmLabel, SIZE / 2, 520)

  ctx.font = `700 52px ${family}`
  ctx.fillStyle = '#FFFFFF'
  wrap(ctx, input.line, SIZE - 220).forEach((l, i) => ctx.fillText(l, SIZE / 2, 640 + i * 66))

  ctx.font = `400 36px ${family}`
  ctx.fillStyle = '#E8DCC2'
  ctx.fillText(`${input.profileName} · ${input.comprehension}`, SIZE / 2, 790)

  ctx.font = `700 46px ${family}`
  ctx.fillStyle = '#D9A84E'
  ctx.fillText(input.ask, SIZE / 2, 890)
  ctx.font = `400 32px ${family}`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(input.url, SIZE / 2, 950)

  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png'))
}

/** Share the card through the phone's share sheet, or download it where that isn't supported. */
export async function shareOrDownload(blob: Blob, text: string): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], 'reading-profile.png', { type: 'image/png' })
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], text })
    return 'shared'
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'reading-profile.png'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return 'downloaded'
}
