import qrcode from 'qrcode-generator'
import { LANGUAGES, type AppLang } from '@/lib/app-i18n/languages'
import { formatCertDate, gainPercent, gainPoints, PROGRAM_NAME, type CertificateSnapshot } from './certificate'
import { fill, type CertLabels } from './labels'

// Draws the certificate (A4 landscape) and the share image (1080 × 1350) on a
// canvas, following the approved mockup. Drawn in the browser so all 8
// scripts are shaped correctly; the PDF then carries this picture.

export const CERT_SIZE = { width: 2480, height: 1754 } // A4 landscape, ~212 dpi
export const SHARE_SIZE = { width: 1080, height: 1350 }

const C = {
  paper: '#FDFCF8',
  ink: '#142038',
  inkSoft: '#55607A',
  gold: '#B08A3E',
  goldSoft: '#E4D3A8',
  up: '#2F7D57',
  navyTop: '#18233D',
  navyBottom: '#0E1526',
  cream: '#F5EFDF',
  mist: '#9AA5BF',
  goldLight: '#D9B56A',
  green: '#7CD992',
}

export type CertFonts = { display: string; body: string; latinDisplay: string; latinBody: string }

export type CertDrawInput = {
  lang: AppLang
  labels: CertLabels
  learnerName: string
  completedOn: string
  code: string
  snapshot: CertificateSnapshot
  verifyUrl: string
  domain: string
  fonts: CertFonts
  logo: CanvasImageSource
  signature: CanvasImageSource | null
}

type Ctx = CanvasRenderingContext2D
type Seg = { text: string; bold: boolean }

const isLatin = (lang: AppLang): boolean => lang === 'en'

function font(ctx: Ctx, weight: number, sizePx: number, family: string): void {
  ctx.font = `${weight} ${Math.round(sizePx)}px ${family}`
}

/** Letter-spaced text (Latin labels), drawn glyph by glyph so every browser spaces it the same. */
function spaced(ctx: Ctx, text: string, x: number, y: number, spacing: number, align: 'left' | 'center' | 'right'): number {
  const chars = [...text]
  const width = chars.reduce((w, ch) => w + ctx.measureText(ch).width, 0) + spacing * (chars.length - 1)
  let at = align === 'left' ? x : align === 'center' ? x - width / 2 : x - width
  const saved = ctx.textAlign
  ctx.textAlign = 'left'
  for (const ch of chars) {
    ctx.fillText(ch, at, y)
    at += ctx.measureText(ch).width + spacing
  }
  ctx.textAlign = saved
  return width
}

/** Shrinks the font until the text fits. */
function fitFont(ctx: Ctx, text: string, weight: number, size: number, family: string, maxWidth: number): void {
  let s = size
  font(ctx, weight, s, family)
  while (s > 8 && ctx.measureText(text).width > maxWidth) {
    s -= 2
    font(ctx, weight, s, family)
  }
}

/** Word-wraps text made of normal and bold pieces; returns the lines. */
function wrapRich(ctx: Ctx, segs: Seg[], maxWidth: number, setFont: (bold: boolean) => void): Seg[][] {
  const words: Seg[] = []
  for (const seg of segs) for (const w of seg.text.split(/(\s+)/)) if (w !== '') words.push({ text: w, bold: seg.bold })
  const lines: Seg[][] = [[]]
  let width = 0
  for (const w of words) {
    setFont(w.bold)
    const ww = ctx.measureText(w.text).width
    const line = lines[lines.length - 1]!
    if (/^\s+$/.test(w.text)) {
      if (line.length > 0) {
        line.push(w)
        width += ww
      }
      continue
    }
    if (width + ww > maxWidth && line.length > 0) {
      while (line.length > 0 && /^\s+$/.test(line[line.length - 1]!.text)) line.pop()
      lines.push([w])
      width = ww
    } else {
      line.push(w)
      width += ww
    }
  }
  return lines
}

function drawRichCentered(ctx: Ctx, lines: Seg[][], cx: number, y: number, lineHeight: number, setFont: (bold: boolean) => void, colors: { normal: string; bold: string }): number {
  ctx.textAlign = 'left'
  lines.forEach((line, i) => {
    const width = line.reduce((w, s) => {
      setFont(s.bold)
      return w + ctx.measureText(s.text).width
    }, 0)
    let x = cx - width / 2
    for (const s of line) {
      setFont(s.bold)
      ctx.fillStyle = s.bold ? colors.bold : colors.normal
      ctx.fillText(s.text, x, y + i * lineHeight)
      x += ctx.measureText(s.text).width
    }
  })
  return y + (lines.length - 1) * lineHeight
}

function richFromTemplate(template: string, vars: Record<string, string>, boldVar: string): Seg[] {
  const parts = template.split(`{${boldVar}}`)
  const segs: Seg[] = []
  parts.forEach((part, i) => {
    if (part !== '') segs.push({ text: fill(part, vars), bold: false })
    if (i < parts.length - 1) segs.push({ text: vars[boldVar]!, bold: true })
  })
  return segs
}

function drawQr(ctx: Ctx, text: string, x: number, y: number, size: number, color: string): void {
  const qr = qrcode(0, 'M')
  qr.addData(text)
  qr.make()
  const n = qr.getModuleCount()
  const cell = size / n
  ctx.fillStyle = color
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(x + c * cell, y + r * cell, Math.ceil(cell), Math.ceil(cell))
}

function languageName(lang: AppLang, readLang: 'en' | 'hi'): string {
  return lang === 'en' ? LANGUAGES[readLang].englishName : LANGUAGES[readLang].nativeName
}

function imageWidthFor(img: CanvasImageSource, height: number): number {
  const w = 'naturalWidth' in img ? img.naturalWidth : (img as { width: number }).width
  const h = 'naturalHeight' in img ? img.naturalHeight : (img as { height: number }).height
  return h > 0 ? (w / h) * height : height
}

export function drawCertificate(canvas: HTMLCanvasElement, input: CertDrawInput): void {
  const { width: W, height: H } = CERT_SIZE
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const u = W / 100
  const { labels: L, fonts: F, snapshot } = input
  const latin = isLatin(input.lang)
  ctx.textBaseline = 'alphabetic'

  // Paper, faint watermark, double frame, corner diamonds.
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, W, H)
  ctx.save()
  ctx.globalAlpha = 0.045
  if ('filter' in ctx) ctx.filter = 'grayscale(1)'
  const wm = 34 * u
  ctx.drawImage(input.logo, W / 2 - wm / 2, H * 0.52 - wm / 2, wm, wm)
  ctx.restore()

  ctx.strokeStyle = C.gold
  ctx.lineWidth = 0.25 * u
  ctx.strokeRect(2.2 * u, 2.2 * u, W - 4.4 * u, H - 4.4 * u)
  ctx.lineWidth = 0.08 * u
  ctx.strokeRect(2.9 * u, 2.9 * u, W - 5.8 * u, H - 5.8 * u)
  const d = 3 * u
  for (const [cx, cy] of [
    [2.7 * u, 2.7 * u],
    [W - 2.7 * u, 2.7 * u],
    [2.7 * u, H - 2.7 * u],
    [W - 2.7 * u, H - 2.7 * u],
  ] as const) {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(Math.PI / 4)
    ctx.fillStyle = C.paper
    ctx.fillRect(-d / 2, -d / 2, d, d)
    ctx.strokeRect(-d / 2, -d / 2, d, d)
    ctx.fillStyle = C.gold
    ctx.fillRect(-d / 2 + 0.75 * u, -d / 2 + 0.75 * u, d - 1.5 * u, d - 1.5 * u)
    ctx.restore()
  }

  const cx = W / 2
  let y = 8.4 * u

  // Logo + "MIND UR MIND" between two short gold rules.
  font(ctx, 500, 1.45 * u, F.latinBody)
  ctx.fillStyle = C.ink
  const brandText = 'MIND UR MIND'
  const brandWidth = [...brandText].reduce((w, ch) => w + ctx.measureText(ch).width, 0) + 0.46 * u * (brandText.length - 1)
  const logoSize = 4.2 * u
  const groupWidth = logoSize + 1.2 * u + brandWidth
  const gx = cx - groupWidth / 2
  ctx.drawImage(input.logo, gx, y - logoSize * 0.72, logoSize, logoSize)
  spaced(ctx, brandText, gx + logoSize + 1.2 * u, y, 0.46 * u, 'left')
  ctx.fillStyle = C.gold
  ctx.fillRect(gx - 5.5 * u, y - 0.5 * u, 4 * u, 0.08 * u)
  ctx.fillRect(gx + groupWidth + 1.5 * u, y - 0.5 * u, 4 * u, 0.08 * u)

  // Title, "This certifies that", name with a gold rule.
  y += 6.4 * u
  ctx.fillStyle = C.ink
  ctx.textAlign = 'center'
  fitFont(ctx, L.title, 400, 4.3 * u, F.display, 80 * u)
  if (latin) spaced(ctx, L.title, cx, y, 0.26 * u, 'center')
  else ctx.fillText(L.title, cx, y)

  y += 3.4 * u
  font(ctx, 400, 1.3 * u, F.body)
  ctx.fillStyle = C.inkSoft
  ctx.fillText(L.certifies, cx, y)

  y += 6 * u
  ctx.fillStyle = C.ink
  fitFont(ctx, input.learnerName, 400, 4.6 * u, F.display, 70 * u)
  ctx.fillText(input.learnerName, cx, y)
  const nameWidth = ctx.measureText(input.learnerName).width
  ctx.fillStyle = C.gold
  ctx.fillRect(cx - nameWidth / 2 - 3 * u, y + 1.1 * u, nameWidth + 6 * u, 0.08 * u)

  // "has completed all 30 days of <program> on <date>", programme in bold.
  y += 4.2 * u
  const date = formatCertDate(input.completedOn, LANGUAGES[input.lang].htmlLang)
  const setBody = (bold: boolean): void => font(ctx, bold ? 600 : 400, 1.35 * u, bold ? F.latinBody : F.body)
  const lines = wrapRich(ctx, richFromTemplate(L.completed, { program: PROGRAM_NAME, date }, 'program'), 62 * u, setBody)
  y = drawRichCentered(ctx, lines, cx, y, 2.1 * u, setBody, { normal: C.inkSoft, bold: C.ink })

  // Results: fair reading test (left) and Memory Palace (right).
  y += 5.2 * u
  const reading = snapshot.reading
  const memory = snapshot.memory
  const memCount = memory === null ? 0 : [memory.memory, memory.retention].filter((v) => v !== null).length
  const readingW = reading === null ? 0 : reading.before === null ? 34 * u : 47 * u
  const memoryW = memCount === 0 ? 0 : memCount === 2 ? 26 * u : 13 * u
  const gap = readingW > 0 && memoryW > 0 ? 4 * u : 0
  let x0 = cx - (readingW + gap + memoryW) / 2

  const sectionLabel = (text: string, x: number, yy: number): void => {
    ctx.fillStyle = C.gold
    font(ctx, 600, 1.05 * u, latin ? F.latinBody : F.body)
    ctx.textAlign = 'left'
    if (latin) spaced(ctx, text.toUpperCase(), x, yy, 0.21 * u, 'left')
    else ctx.fillText(text, x, yy)
  }

  if (reading !== null) {
    sectionLabel(L.readingTitle, x0, y)
    const before = reading.before
    const cols = before === null ? [x0 + readingW] : [x0 + readingW * 0.6, x0 + readingW * 0.78, x0 + readingW]
    let ty = y + 2.2 * u
    font(ctx, 500, 1.05 * u, F.body)
    ctx.fillStyle = C.inkSoft
    ctx.textAlign = 'right'
    const rows: { label: string; b: string; a: string; change: string | null; key: boolean }[] = [
      { label: L.speed, b: `${before?.wpm ?? ''}`, a: `${reading.after.wpm}`, change: before ? gainPercent(before.wpm, reading.after.wpm) : null, key: false },
      {
        label: L.comprehension,
        b: before ? `${before.comprehension}%` : '',
        a: `${reading.after.comprehension}%`,
        change: before ? ((p) => (p === null ? null : fill(L.points, { n: p })))(gainPoints(before.comprehension, reading.after.comprehension)) : null,
        key: false,
      },
      { label: L.effective, b: `${before?.effective ?? ''}`, a: `${reading.after.effective}`, change: before ? gainPercent(before.effective, reading.after.effective) : null, key: true },
    ]
    // The "Change" heading only when at least one number went up.
    const heads = before === null ? [fill(L.day, { day: 30 })] : [fill(L.day, { day: before.day }), fill(L.day, { day: 30 }), ...(rows.some((r) => r.change !== null) ? [L.change] : [])]
    heads.forEach((h, i) => ctx.fillText(h, cols[i]!, ty))
    for (const row of rows) {
      ctx.fillStyle = C.goldSoft
      ctx.fillRect(x0, ty + 0.7 * u, readingW, 0.06 * u)
      ty += 2.6 * u
      const size = row.key ? 1.45 * u : 1.3 * u
      ctx.textAlign = 'left'
      font(ctx, 400, size, F.body)
      ctx.fillStyle = C.inkSoft
      ctx.fillText(row.label, x0, ty)
      ctx.textAlign = 'right'
      if (before === null) {
        font(ctx, 700, size, F.latinBody)
        ctx.fillStyle = C.ink
        ctx.fillText(row.a, cols[0]!, ty)
      } else {
        font(ctx, 400, size, F.latinBody)
        ctx.fillStyle = C.ink
        ctx.fillText(row.b, cols[0]!, ty)
        font(ctx, 700, size, F.latinBody)
        ctx.fillText(row.a, cols[1]!, ty)
        if (row.change !== null) {
          font(ctx, 600, size, F.body)
          ctx.fillStyle = C.up
          ctx.fillText(row.change, cols[2]!, ty)
        }
      }
    }
    ty += 2.1 * u
    ctx.textAlign = 'left'
    font(ctx, 400, 0.95 * u, F.body)
    ctx.fillStyle = C.inkSoft
    const notes = [fill(L.readingNote, { language: languageName(input.lang, reading.lang) })]
    if (before !== null && before.day > 1) notes.unshift(fill(L.baselineOnDay, { day: before.day }))
    const noteLines = wrapRich(ctx, [{ text: notes.join(' '), bold: false }], readingW, () => font(ctx, 400, 0.95 * u, F.body))
    noteLines.forEach((line, i) => ctx.fillText(line.map((s) => s.text).join(''), x0, ty + i * 1.5 * u))
    x0 += readingW + gap
  }

  if (memory !== null && memCount > 0) {
    sectionLabel(L.memoryTitle, x0, y)
    const boxes = [
      memory.memory === null ? null : { label: L.memory, value: memory.memory, sub: L.memorySub },
      memory.retention === null ? null : { label: L.retention, value: memory.retention, sub: L.retentionSub },
    ].filter((b) => b !== null)
    const boxW = (memoryW - (boxes.length - 1) * 1 * u) / boxes.length
    const by = y + 1.4 * u
    const boxH = 7.4 * u
    boxes.forEach((b, i) => {
      const bx = x0 + i * (boxW + 1 * u)
      ctx.strokeStyle = C.goldSoft
      ctx.lineWidth = 0.06 * u
      ctx.strokeRect(bx, by, boxW, boxH)
      ctx.textAlign = 'left'
      font(ctx, 400, 1.05 * u, F.body)
      ctx.fillStyle = C.inkSoft
      ctx.fillText(b.label, bx + 1 * u, by + 2 * u)
      font(ctx, 400, 2.6 * u, F.latinDisplay)
      ctx.fillStyle = C.ink
      ctx.fillText(`${b.value}%`, bx + 1 * u, by + 4.9 * u)
      fitFont(ctx, b.sub, 400, 0.9 * u, F.body, boxW - 2 * u)
      ctx.fillStyle = C.inkSoft
      ctx.fillText(b.sub, bx + 1 * u, by + 6.4 * u)
    })
  }

  // Footer: signature (left), seal and website (centre), QR + ID (right).
  const footY = H - 7.4 * u
  const left = 7 * u
  const right = W - 7 * u
  if (input.signature !== null) {
    const sh = 6.2 * u
    const sw = Math.min(24 * u, imageWidthFor(input.signature, sh))
    ctx.drawImage(input.signature, left, footY - 2.4 * u - sh + 1 * u, sw, (sw / imageWidthFor(input.signature, sh)) * sh)
  }
  ctx.fillStyle = C.inkSoft
  ctx.fillRect(left, footY - 1.6 * u, 26 * u, 0.08 * u)
  ctx.textAlign = 'left'
  font(ctx, 600, 1.1 * u, F.latinBody)
  ctx.fillStyle = C.ink
  ctx.fillText('Dr. Kapil Dev Sharma', left, footY)
  font(ctx, 400, 0.95 * u, F.body)
  ctx.fillStyle = C.inkSoft
  ctx.fillText(L.founder, left, footY + 1.5 * u)

  const sealR = 4.5 * u
  const sealY = footY - 4.4 * u
  const grad = ctx.createRadialGradient(cx - 1.4 * u, sealY - 1.6 * u, 0.5 * u, cx, sealY, sealR)
  grad.addColorStop(0, '#E9D49B')
  grad.addColorStop(0.55, C.gold)
  grad.addColorStop(1, '#8C6A2A')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, sealY, sealR, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'
  ctx.lineWidth = 0.12 * u
  ctx.beginPath()
  ctx.arc(cx, sealY, sealR - 0.55 * u, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#FFF8E6'
  font(ctx, 400, 1.05 * u, F.latinDisplay)
  ;['SHARP', 'BRAIN', '30 DAYS'].forEach((line, i) => spaced(ctx, line, cx, sealY - 1.1 * u + i * 1.45 * u, 0.15 * u, 'center'))
  font(ctx, 400, 0.95 * u, F.latinBody)
  ctx.fillStyle = C.inkSoft
  spaced(ctx, input.domain, cx, footY + 1.5 * u, 0.11 * u, 'center')

  const qrSize = 6 * u
  drawQr(ctx, input.verifyUrl, right - qrSize, footY - 2.4 * u - qrSize, qrSize, C.ink)
  ctx.textAlign = 'right'
  font(ctx, 400, 1 * u, F.body)
  ctx.fillStyle = C.inkSoft
  const idLabel = `${L.certId} `
  font(ctx, 600, 1 * u, F.latinBody)
  const codeW = ctx.measureText(input.code).width
  ctx.fillStyle = C.ink
  ctx.fillText(input.code, right, footY)
  font(ctx, 400, 1 * u, F.body)
  ctx.fillStyle = C.inkSoft
  ctx.fillText(idLabel, right - codeW, footY)
  ctx.fillText(fill(L.verifyAt, { url: input.verifyUrl.replace(/^https?:\/\/(www\.)?/, '') }), right, footY + 1.5 * u)
}

export function drawShareImage(canvas: HTMLCanvasElement, input: CertDrawInput): void {
  const { width: W, height: H } = SHARE_SIZE
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const u = W / 100
  const { labels: L, fonts: F, snapshot } = input

  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H)
  bg.addColorStop(0, C.navyTop)
  bg.addColorStop(1, C.navyBottom)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = C.gold
  ctx.lineWidth = 0.4 * u
  ctx.strokeRect(4 * u, 4 * u, W - 8 * u, H - 8 * u)

  const cx = W / 2
  let y = 14 * u
  // Logo + wordmark.
  font(ctx, 400, 4.2 * u, F.latinDisplay)
  const brand = 'MIND UR MIND'
  const bw = [...brand].reduce((w, ch) => w + ctx.measureText(ch).width, 0) + 0.6 * u * (brand.length - 1)
  const ls = 10 * u
  const gx = cx - (ls + 2.4 * u + bw) / 2
  ctx.drawImage(input.logo, gx, y - ls * 0.72, ls, ls)
  ctx.fillStyle = C.cream
  spaced(ctx, brand, gx + ls + 2.4 * u, y, 0.6 * u, 'left')

  y += 7 * u
  font(ctx, 500, 3 * u, F.latinBody)
  ctx.fillStyle = C.goldLight
  spaced(ctx, 'SHARP BRAIN™', cx, y, 0.9 * u, 'center')

  y += 11 * u
  ctx.textAlign = 'center'
  ctx.fillStyle = C.cream
  fitFont(ctx, L.shareDone, 400, 7.4 * u, F.display, 80 * u)
  ctx.fillText(L.shareDone, cx, y)

  y += 10.5 * u
  ctx.fillStyle = '#FFFFFF'
  fitFont(ctx, input.learnerName, 400, 6.4 * u, F.display, 80 * u)
  ctx.fillText(input.learnerName, cx, y)

  const reading = snapshot.reading
  if (reading !== null) {
    y += 23 * u
    const before = reading.before
    const to = `${reading.after.effective}`
    font(ctx, 400, 15 * u, F.latinDisplay)
    const toW = ctx.measureText(to).width
    if (before !== null) {
      font(ctx, 400, 9 * u, F.latinDisplay)
      const from = `${before.effective}`
      const fromW = ctx.measureText(from).width
      font(ctx, 400, 6 * u, F.latinBody)
      const arrowW = ctx.measureText('→').width
      const total = fromW + 3 * u + arrowW + 3 * u + toW
      let x = cx - total / 2
      ctx.textAlign = 'left'
      font(ctx, 400, 9 * u, F.latinDisplay)
      ctx.fillStyle = C.mist
      ctx.fillText(from, x, y)
      x += fromW + 3 * u
      font(ctx, 400, 6 * u, F.latinBody)
      ctx.fillStyle = C.goldLight
      ctx.fillText('→', x, y - 1 * u)
      x += arrowW + 3 * u
      font(ctx, 400, 15 * u, F.latinDisplay)
      ctx.fillStyle = C.cream
      ctx.fillText(to, x, y)
    } else {
      ctx.textAlign = 'center'
      ctx.fillStyle = C.cream
      ctx.fillText(to, cx, y)
    }
    y += 7.5 * u
    ctx.textAlign = 'center'
    font(ctx, 400, 3.4 * u, F.body)
    ctx.fillStyle = '#C9CFDD'
    ctx.fillText(before === null ? L.shareUnitDay30 : fill(L.shareUnit, { day: before.day }), cx, y)
    const gain = before === null ? null : gainPercent(before.effective, reading.after.effective)
    if (gain !== null) {
      y += 8 * u
      font(ctx, 700, 5 * u, F.latinBody)
      ctx.fillStyle = C.green
      ctx.fillText(gain, cx, y)
    }
  }

  // Bottom row: whichever of speed, comprehension and retention exist.
  const cells: { label: string; value: string }[] = []
  if (reading !== null) {
    const b = reading.before
    cells.push({ label: L.shareSpeed, value: b ? `${b.wpm} → ${reading.after.wpm}` : `${reading.after.wpm}` })
    cells.push({ label: L.shareComprehension, value: b ? `${b.comprehension} → ${reading.after.comprehension}%` : `${reading.after.comprehension}%` })
  }
  if (snapshot.memory?.retention != null) cells.push({ label: L.shareRetention, value: `${snapshot.memory.retention}%` })
  const rowTop = H - 33 * u
  if (cells.length > 0) {
    ctx.fillStyle = 'rgba(217,181,106,0.5)'
    ctx.fillRect(9 * u, rowTop, W - 18 * u, 0.25 * u)
    const cw = (W - 18 * u) / cells.length
    cells.forEach((cell, i) => {
      const ccx = 9 * u + cw * i + cw / 2
      ctx.textAlign = 'center'
      font(ctx, 400, 2.8 * u, F.body)
      ctx.fillStyle = C.mist
      ctx.fillText(cell.label, ccx, rowTop + 6 * u)
      font(ctx, 700, 4.6 * u, F.latinBody)
      ctx.fillStyle = C.cream
      fitFont(ctx, cell.value, 700, 4.6 * u, F.latinBody, cw - 2 * u)
      ctx.fillText(cell.value, ccx, rowTop + 12 * u)
    })
  }

  ctx.textAlign = 'center'
  font(ctx, 400, 2.7 * u, F.body)
  ctx.fillStyle = C.mist
  ctx.fillText(fill(L.shareVerify, { url: input.verifyUrl.replace(/^https?:\/\/(www\.)?/, '') }), cx, H - 12.5 * u)
  font(ctx, 500, 2.6 * u, F.latinBody)
  ctx.fillStyle = C.goldLight
  spaced(ctx, input.domain, cx, H - 8.6 * u, 0.36 * u, 'center')
}
