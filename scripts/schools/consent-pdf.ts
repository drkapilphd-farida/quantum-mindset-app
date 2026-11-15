// Prints the parent consent form (src/features/schools/consent.ts) to
// one-page A4 PDFs: public/schools/parent-consent-{en,hi}.pdf.
// Run: node scripts/schools/consent-pdf.ts   (uses Playwright's Chromium,
// already a dev dependency; Devanagari is shaped by the Noto fonts from
// Google Fonts, so it needs a network connection).
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const { CONSENT } = (await import(path.resolve('src/features/schools/consent.ts'))) as typeof import('../../src/features/schools/consent')
const OUT = path.resolve('public/schools')
mkdirSync(OUT, { recursive: true })

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function html(lang: 'en' | 'hi'): string {
  const c = CONSENT[lang]
  const font = lang === 'hi' ? "'Noto Sans Devanagari', 'Noto Sans', sans-serif" : "'Noto Sans', sans-serif"
  const f = (i: number): string => c.fields[i] ?? ''
  const pairs: [string, string][] = [
    [f(0), f(1)],
    [f(2), f(3)],
    [f(4), ''],
    [f(5), f(6)],
  ]
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=block" rel="stylesheet">
<style>
@page { size: A4; margin: 16mm 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: ${font}; color: #1b1b2f; font-size: 11.2pt; line-height: 1.5; margin: 0; }
.brand { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #4f46e5; padding-bottom: 6px; margin-bottom: 12px; font-weight: 700; color: #4f46e5; font-size: 10.5pt; }
h1 { font-size: 15.5pt; line-height: 1.3; margin: 0 0 10px; }
p { margin: 0 0 8px; }
ul { margin: 0 0 12px; padding-left: 18px; }
li { margin-bottom: 5px; }
.box { display: flex; gap: 10px; align-items: flex-start; margin: 0 0 9px; }
.sq { flex: none; width: 13px; height: 13px; border: 1.6px solid #1b1b2f; margin-top: 4px; }
.fields { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; row-gap: 22px; }
.f { font-size: 9.8pt; color: #4f4f66; }
.f::after { content: ''; display: block; height: 34px; border-bottom: 1.2px solid #1b1b2f; }
.f.empty::after { border: 0; }
.note { margin-top: 26px; font-size: 9.6pt; color: #4f4f66; border-top: 1px solid #ccc; padding-top: 6px; text-align: center; }
</style></head><body>
<div class="brand"><span>Mind Ur Mind · Sharp Brain for Schools</span><span>${lang === 'hi' ? 'हिंदी' : 'English'}</span></div>
<h1>${esc(c.title)}</h1>
<p>${esc(c.intro)}</p>
<p><strong>${esc(c.understand)}</strong></p>
<ul>${c.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
${c.boxes.map((x) => `<div class="box"><span class="sq"></span><span>${esc(x)}</span></div>`).join('')}
<div class="fields">${pairs.map(([a, b]) => `<div class="f">${esc(a)}</div><div class="f${b === '' ? ' empty' : ''}">${esc(b)}</div>`).join('')}</div>
<div class="note">${esc(c.footer)}</div>
</body></html>`
}

const browser = await chromium.launch()
try {
  for (const lang of ['en', 'hi'] as const) {
    const page = await browser.newPage()
    await page.setContent(html(lang), { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const file = path.join(OUT, `parent-consent-${lang}.pdf`)
    await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true })
    process.stdout.write(`wrote ${path.relative(process.cwd(), file)}\n`)
    await page.close()
  }
} finally {
  await browser.close()
}
